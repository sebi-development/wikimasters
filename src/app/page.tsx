import { WikiCard } from "@/components/ui/wiki-card";
import { getAllArticles } from "@/app/actions/articles";

export default async function Home() {
  const articles = await getAllArticles();

  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
        {articles.length === 0 && (
          <p className="text-center text-muted-foreground">
            No articles yet. Create your first one!
          </p>
        )}
        {articles.map((article) => (
          <WikiCard
            key={article.id}
            title={article.title}
            author={article.author ?? "Unknown"}
            date={new Date(article.createdAt).toLocaleDateString("en-US", {
              month: "short",
              year: "numeric",
            })}
            summary={
              article.summary
                ? article.summary
                : `${article.content.slice(0, 150)}…`
            }
            isAiSummary={!!article.summary}
            isAnonymous={!!article.isAnonymous}
            href={`/wiki/${article.id}`}
          />
        ))}
      </main>
    </div>
  );
}
