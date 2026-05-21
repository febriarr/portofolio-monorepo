import { Skeleton } from '@workspace/ui/components/skeleton'

export function BlogDetailSkeleton() {
  return (
    <article className="mx-auto w-full max-w-6xl px-4 md:px-6 lg:px-16 pt-6 pb-20 border border-border relative">
      <div className="absolute inset-0 -z-10 w-full h-full grid grid-cols-3 divide-x divide-dashed pointer-events-none">
        <div></div>
        <div></div>
        <div></div>
      </div>

      <div className="z-30">
        <header className="mb-12">
          {/* Category */}
          <div className="flex justify-center mb-4">
            <Skeleton className="h-4 w-20" />
          </div>

          {/* Title */}
          <div className="flex flex-col items-center gap-3 mb-6">
            <Skeleton className="h-10 w-3/4 md:h-14" />
            <Skeleton className="h-10 w-1/2 md:h-14" />
          </div>

          {/* Avatar + Name */}
          <div className="w-full flex justify-center">
            <div className="flex items-center space-x-4">
              <Skeleton className="size-10 rounded-full" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="flex flex-col gap-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />

          <Skeleton className="h-8 w-48 mt-4" />

          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-4/5" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-4 w-full" />
        </div>
      </div>
    </article>
  )
}
