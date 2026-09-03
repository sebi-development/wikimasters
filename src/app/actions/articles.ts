"use server";

import { stackServerApp } from "@/stack/server";
import { ensureUserExists } from "@/db/sync-user";
import { eq, desc } from "drizzle-orm";
import db from '@/db'
import { articles, usersSync } from "@/db/schema";
import { redirect } from "next/navigation";
import redis from "@/cache";
import { summarizeArticle } from "@/ai/summarize";

export async function getArticleById(id: number) {
  const result = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      content: articles.content,
      imageUrl: articles.imageUrl,
      published: articles.published,
      authorId: articles.authorId,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      author: usersSync.name,
      summary: articles.summary,
      isAnonymous: articles.isAnonymous
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getAllArticles() {
  // Read-through cache: check Redis first
  const cached = await redis.get('articles:all');
  if (cached) {
    return cached as Awaited<ReturnType<typeof fetchAllArticles>>;
  }

  const result = await fetchAllArticles();
  await redis.set('articles:all', JSON.stringify(result), { ex: 300 }); // 5min TTL
  return result;
}

async function fetchAllArticles() {
  const result = await db
    .select({
      id: articles.id,
      title: articles.title,
      slug: articles.slug,
      content: articles.content,
      imageUrl: articles.imageUrl,
      published: articles.published,
      authorId: articles.authorId,
      createdAt: articles.createdAt,
      updatedAt: articles.updatedAt,
      summary: articles.summary,
      isAnonymous: articles.isAnonymous,
      author: usersSync.name
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.published, true))
    .orderBy(desc(articles.createdAt));

  return result;
}

export type ArticleList = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string | null;
  summary?: string | null;
  useAiSummary?: boolean;
  isAnonymous?: boolean;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string | null;
  useAiSummary?: boolean;
  isAnonymous?: boolean;
};

export async function createArticle(data: ArticleList) {
  const user = await stackServerApp.getUser()
  if (!user) throw new Error('ERROR: Unauthorized')

  await ensureUserExists(user);

  // Insert article immediately without waiting for AI summary
  const [inserted] = await db.insert(articles).values({
    title: data.title,
    content: data.content,
    slug: `${Date.now()}`,
    published: true,
    authorId: user.id,
    imageUrl: data.imageUrl ?? undefined,
    summary: null,
    isAnonymous: data.isAnonymous ?? false
  }).returning({ id: articles.id })

  redis.del('articles:all')

  // Generate summary in the background only if user opted in
  if (data.useAiSummary) {
    summarizeArticle(data.title || "", data.content || "")
      .then(async (summary) => {
        await db.update(articles).set({ summary }).where(eq(articles.id, inserted.id))
        redis.del('articles:all')
      })
      .catch((err) => console.error("Background summary failed:", err))
  }

  return { success: true, message: "Article created" };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await stackServerApp.getUser()
  if (!user) throw new Error('ERROR: Unauthorized')

  const article = await getArticleById(+id);
  if (!article) throw new Error('ERROR: Article not found');
  if (article.authorId !== user.id) throw new Error('ERROR: Forbidden');

  // Save edits immediately without waiting for AI summary
  await db.update(articles).set({
    title: data.title,
    content: data.content,
    ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
    // Clear summary if user opted out of AI
    ...(!data.useAiSummary ? { summary: null } : {}),
    ...(data.isAnonymous !== undefined ? { isAnonymous: data.isAnonymous } : {}),
  }).where(eq(articles.id, +id))

  redis.del('articles:all')

  // Regenerate summary in the background only if user opted in
  if (data.useAiSummary) {
    summarizeArticle(data.title || "", data.content || "")
      .then(async (summary) => {
        await db.update(articles).set({ summary: summary ?? undefined }).where(eq(articles.id, +id))
        redis.del('articles:all')
      })
      .catch((err) => console.error("Background summary failed:", err))
  }

  return { success: true, message: `Article ${id} updated` };
}

export async function deleteArticle(id: string) {
  const user = await stackServerApp.getUser()
  if (!user) throw new Error('ERROR: Unauthorized')

  const article = await getArticleById(+id);
  if (!article) throw new Error('ERROR: Article not found');
  if (article.authorId !== user.id) throw new Error('ERROR: Forbidden');

  await db.delete(articles).where(eq(articles.id, +id))
  return { success: true, message: `Article ${id} delete logged (stub)` };
}

// Form-friendly server action: accepts FormData from a client form and calls deleteArticle
export async function deleteArticleForm(formData: FormData): Promise<void> {
  const id = formData.get("id");
  if (!id) {
    throw new Error("Missing article id");
  }

  await deleteArticle(String(id));
  // After deleting, redirect the user back to the homepage.
  redirect("/");
}
