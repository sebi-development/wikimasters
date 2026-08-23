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
  await stackServerApp.getUser({ or: "redirect" });
  const { id } = await params;

  const article = await getArticleById(+id);

  if (!article) {
    notFound();
  }

  // Permission check – in a real app this would compare article.authorId to user.id
  const canEdit = true;

  return (
    <WikiArticleViewer
      article={{
        id: article.id,
        title: article.title,
        content: article.content,
        author: article.author,
        createdAt: article.createdAt,
        imageUrl: article.imageUrl,
      }}
      canEdit={canEdit}
    />
  );
}
