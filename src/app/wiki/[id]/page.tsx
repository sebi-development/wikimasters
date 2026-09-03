import { notFound } from "next/navigation";
import WikiArticleViewer from "@/components/wiki-article-viewer";
import { getArticleById } from "@/app/actions/articles";
import { stackServerApp } from "@/stack/server";

interface ViewArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ViewArticlePage({
  params,
}: ViewArticlePageProps) {
  const { id } = await params;

  const [user, article] = await Promise.all([
    stackServerApp.getUser({ or: "redirect" }),
    getArticleById(+id),
  ]);

  if (!article) {
    notFound();
  }

  // Permission check: compare article.authorId to user.id
  const canEdit = user.id === article.authorId;

  return (
    <WikiArticleViewer
      article={{
        id: article.id,
        title: article.title,
        content: article.content,
        author: article.author,
        createdAt: article.createdAt,
        imageUrl: article.imageUrl,
        isAnonymous: article.isAnonymous,
      }}
      canEdit={canEdit}
    />
  );
}
