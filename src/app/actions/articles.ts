"use server";

import { stackServerApp } from "@/stack/server";
import { ensureUserExists } from "@/db/sync-user";
import { eq, desc } from "drizzle-orm";
import db from '@/db'
import { articles, usersSync } from "@/db/schema";
import { redirect } from "next/navigation";

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
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.id, id))
    .limit(1);

  return result[0] ?? null;
}

export async function getAllArticles() {
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
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.published, true))
    .orderBy(desc(articles.createdAt));

  return result;
}

export type CreateArticleInput = {
  title: string;
  content: string;
  authorId: string;
  imageUrl?: string;
};

export type UpdateArticleInput = {
  title?: string;
  content?: string;
  imageUrl?: string;
};

export async function createArticle(data: CreateArticleInput) {
  const user = await stackServerApp.getUser()
  if (!user) throw new Error('ERROR: Unauthorized')

  await ensureUserExists(user);

  await db.insert(articles).values({
    title: data.title,
    content: data.content,
    slug: `${Date.now()}`,
    published: true,
    authorId: user.id,
    imageUrl: data.imageUrl ?? undefined
  })

  return { success: true, message: "Article create logged (stub)" };
}

export async function updateArticle(id: string, data: UpdateArticleInput) {
  const user = await stackServerApp.getUser()
  if (!user) throw new Error('ERROR: Unauthorized')

  const authorId = user.id

  await db.update(articles).set({
    title: data.title,
    content: data.content,
    ...(data.imageUrl !== undefined ? { imageUrl: data.imageUrl } : {}),
  }).where(eq(articles.id, +id))

  return { success: true, message: `Article ${id} update logged (stub)` };
}

export async function deleteArticle(id: string) {
  const user = stackServerApp.getUser()
  if (!user) throw new Error('ERROR: Unauthorized')

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
