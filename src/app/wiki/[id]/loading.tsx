export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-pulse">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center space-x-2 mb-6">
        <div className="h-4 w-12 bg-muted rounded" />
        <div className="h-4 w-4 bg-muted rounded" />
        <div className="h-4 w-32 bg-muted rounded" />
      </div>

      {/* Title skeleton */}
      <div className="mb-6">
        <div className="h-9 w-3/4 bg-muted rounded mb-4" />
        <div className="flex gap-4">
          <div className="h-4 w-24 bg-muted rounded" />
          <div className="h-4 w-28 bg-muted rounded" />
          <div className="h-5 w-16 bg-muted rounded-full" />
        </div>
      </div>

      {/* Content card skeleton */}
      <div className="rounded-xl border bg-card p-6">
        <div className="space-y-3">
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-5/6 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-4/6 bg-muted rounded" />
          <div className="h-4 w-full bg-muted rounded" />
          <div className="h-4 w-3/4 bg-muted rounded" />
        </div>
      </div>
    </div>
  );
}
