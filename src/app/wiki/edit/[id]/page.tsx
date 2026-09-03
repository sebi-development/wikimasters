import { notFound } from "next/navigation";
import WikiEditor from "@/components/wiki-editor";
import { AnimatedLink } from "@/components/ui/animated-link";
import { getArticleById } from "@/app/actions/articles";
import { stackServerApp } from "@/stack/server";

interface EditArticlePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function EditArticlePage({
  params,
}: EditArticlePageProps) {
  const { id } = await params;

  const [, article] = await Promise.all([
    stackServerApp.getUser({ or: "redirect" }),
    getArticleById(+id),
  ]);

  if (!article) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <AnimatedLink
          href={`/wiki/${article.id}`}
          direction="left"
          className="text-muted-foreground hover:text-foreground"
        >
          Back to Article
        </AnimatedLink>
      </div>
      <div className="-mx-4 -my-8">
        <WikiEditor
          initialTitle={article.title}
          initialContent={article.content}
          initialImageUrl={article.imageUrl}
          isEditing={true}
          articleId={String(article.id)}
        />
      </div>
    </div>
  );
}
