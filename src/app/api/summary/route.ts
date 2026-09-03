import { NextRequest, NextResponse } from "next/server";

import { eq, isNull } from 'drizzle-orm'
import { summarizeArticle } from "@/ai/summarize";
import db from "@/db";
import redis from "@/cache";
import { articles } from "@/db/schema";

export async function GET(req: NextRequest) {
  if (process.env.NODE_ENV !== 'development' && req.headers.get('authorization') !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const rows = await db
    .select({
      id: articles.id,
      title: articles.title,
      content: articles.content
    })
    .from(articles)
    .where(isNull(articles.summary))

  let updated = 0

  for (const row of rows) {
    try {
      const summary = await summarizeArticle(row.title ?? '', row.content)

      if (summary && summary.trim().length > 0) {

        await db.update(articles).set({ summary }).where(eq(articles.id, row.id))
        updated++

      }

    } catch (error) {
      throw new Error(`Failed to summarize id ${row.id}`)
    }
  }

  if (updated > 0) {
    try {
      await redis.del('articles:all')
    } catch (error) {
      throw new Error('Failed to clear articles cache')
    }
  }

  return NextResponse.json({ ok: true, updated })
}