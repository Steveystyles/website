import { Skeleton } from "@/components/ui/Skeleton"

export default function OutputThreeSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-2/3" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-16 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton className="h-4 w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-14 w-full" />
        ))}
      </div>

      <div className="flex items-start gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-3 w-1/4" />
          <Skeleton className="h-5 w-1/3" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>
    </div>
  )
}
