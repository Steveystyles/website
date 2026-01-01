import { Skeleton } from "@/components/ui/Skeleton"

export default function OutputFourSkeleton() {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-6 w-1/2" />
        <Skeleton className="h-4 w-full" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="space-y-2">
            <Skeleton className="h-3 w-1/3" />
            <Skeleton className="h-5 w-1/2" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>

      <div className="space-y-3">
        <Skeleton className="h-8 w-1/3" />
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full" />
        ))}
      </div>
    </div>
  )
}
