import { Skeleton } from "@/components/ui/Skeleton"

export default function OutputTwoSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/4" />

      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-24" />
        ))}
      </div>
    </div>
  )
}
