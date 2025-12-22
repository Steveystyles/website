import { Skeleton } from "@/components/ui/Skeleton"

export default function OutputThreeSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/3" />

      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-14" />
        ))}
      </div>
    </div>
  )
}
