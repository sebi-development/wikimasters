import { pgTable, serial, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersSync = pgTable("usersSync", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email"),
});

export const articles = pgTable("articles", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  published: boolean("published").default(false).notNull(),
  authorId: text("author_id")
    .notNull()
    .references(() => usersSync.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "string" }).defaultNow().notNull(),
});

export const schema = { articles, usersSync };
export default schema;

export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;
export type User = typeof usersSync.$inferSelect;