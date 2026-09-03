export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
      {/* Page title skeleton */}
      <div className="mb-8">
        <div className="h-8 w-48 bg-muted rounded mb-2" />
        <div className="h-4 w-40 bg-muted rounded" />
      </div>

      {/* Title card skeleton */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <div className="h-5 w-24 bg-muted rounded mb-3" />
        <div className="h-9 w-full bg-muted rounded" />
      </div>

      {/* Content card skeleton */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <div className="h-5 w-36 bg-muted rounded mb-3" />
        <div className="h-64 w-full bg-muted rounded" />
      </div>

      {/* Attachments card skeleton */}
      <div className="rounded-xl border bg-card p-6 mb-6">
        <div className="h-5 w-28 bg-muted rounded mb-3" />
        <div className="h-32 w-full bg-muted rounded border-2 border-dashed border-muted-foreground/25" />
      </div>
    </div>
  );
}
