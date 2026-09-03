import { eq } from "drizzle-orm";
import db from "@/db";
import { articles, usersSync } from "@/db/schema";
import resend from "@/email";
import CelebrationTemplate from "./templates/celebration-template";

const BASE_URL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : `http://localhost:3000`;

export default async function sendCelebrationEmail(
  articleId: number,
  pageviews: number,
) {
  const response = await db
    .select({
      email: usersSync.email,
      id: usersSync.id,
      title: articles.title,
      name: usersSync.name,
    })
    .from(articles)
    .leftJoin(usersSync, eq(articles.authorId, usersSync.id))
    .where(eq(articles.id, articleId));

  const { email, name, title } = response[0];

  if (!email)
    throw new Error(
      "Error founding email. Skipping celebration email for this article ",
    );

  const emailRes = await resend.emails.send({
    from: "Wikimasters <moriacik.prem@seznam.cz>",
    to: email,
    subject: `Your article on wikimasters got ${pageviews}`,
    react: (
      <CelebrationTemplate
        articleTitle={title ?? undefined}
        articleUrl={`${BASE_URL}/wiki/${articleId}`}
        name={name ?? "Friend"}
        pageviews={pageviews}
      />
    ),
  });

  if (emailRes.error) throw new Error(`Error sending email`);
}
