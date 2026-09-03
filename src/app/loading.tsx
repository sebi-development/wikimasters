export default function Loading() {
  return (
    <div>
      <main className="max-w-2xl mx-auto mt-10 flex flex-col gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            // biome-ignore lint/suspicious/noArrayIndexKey: static skeleton items
            key={i}
            className="rounded-xl border bg-card p-6 animate-pulse"
          >
            <div className="h-5 w-2/3 bg-muted rounded mb-3" />
            <div className="h-4 w-full bg-muted rounded mb-2" />
            <div className="h-4 w-5/6 bg-muted rounded mb-4" />
            <div className="flex gap-4">
              <div className="h-3 w-20 bg-muted rounded" />
              <div className="h-3 w-16 bg-muted rounded" />
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
