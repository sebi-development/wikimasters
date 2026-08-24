import db from "@/db/index";
import redis from '@/cache'
import { articles } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { usersSync } from "@/db/schema";


export async function getArticles() {

  const cached = await redis.get('articles:all')

  if (cached) return cached

  const response = await db.select({ title: articles.title, id: articles.id, createdAt: articles.createdAt, content: articles.content, author: usersSync.name })
    .from(articles).leftJoin(usersSync, eq(articles.authorId, usersSync.id))
  return response
}

export async function getArticlesById(id: number) {
  const response = await db.select({ title: articles.title, id: articles.id, createdAt: articles.createdAt, content: articles.content, author: usersSync.name, imageUrl: articles.imageUrl })
    .from(articles)
    .where(eq(articles.id, id))
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
  return response[0] ? response[0] : null
}