import { Skeleton } from "@/components/ui/Skeleton"

export default function OutputOneSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />

      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-20" />
        <Skeleton className="h-20" />
      </div>

      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-12" />
        ))}
      </div>
    </div>
  )
}
