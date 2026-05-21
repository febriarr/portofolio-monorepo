import { Skeleton } from '@workspace/ui/components/skeleton'

function PostCardSkeleton() {
  return (
    <div className="flex flex-col p-6 h-full">
      <div className="mb-4 flex items-center justify-between gap-4">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-4 w-24" />
      </div>
      <Skeleton className="h-6 w-full mb-2" />
      <Skeleton className="h-6 w-3/4 mb-4" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-full mb-2" />
      <Skeleton className="h-4 w-2/3 mb-6" />
      <div className="mt-auto">
        <Skeleton className="h-4 w-28" />
      </div>
    </div>
  )
}

function HighlightedPostSkeleton() {
  return (
    <div className="col-span-1 md:col-span-2 lg:col-span-3 flex flex-col md:flex-row md:min-h-105">
      {/* Image */}
      <Skeleton className="w-full aspect-video md:aspect-auto md:w-1/2 md:self-stretch rounded-none" />

      {/* Content */}
      <div className="flex-1 p-8 border-l flex flex-col">
        <div className="mb-4 flex items-center justify-between gap-4">
          <Skeleton className="h-4 w-16" />
          <Skeleton className="h-4 w-24" />
        </div>
        <Skeleton className="h-3 w-20 mb-4" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-full mb-2" />
        <Skeleton className="h-8 w-3/4 mb-6" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-4/5 mb-2" />
        <div className="mt-auto">
          <Skeleton className="h-4 w-28" />
        </div>
      </div>
    </div>
  )
}

export function BlogListSkeleton() {
  return (
    <div>
      {/* Search + Tabs */}
      <div className="w-full flex flex-col md:flex-row gap-4 mb-6">
        <Skeleton className="h-10 w-full max-w-sm" />
        <div className="flex gap-2">
          <Skeleton className="h-8 w-10" />
          <Skeleton className="h-8 w-20" />
        </div>
      </div>

      {/* Grid */}
      <section className="grid divide-x divide-y border border-border md:grid-cols-2 lg:grid-cols-3">
        <HighlightedPostSkeleton />
        {Array.from({ length: 3 }).map((_, i) => (
          <PostCardSkeleton key={i} />
        ))}
      </section>
    </div>
  )
}
