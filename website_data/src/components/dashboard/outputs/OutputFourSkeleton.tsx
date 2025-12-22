import { Skeleton } from "@/components/ui/Skeleton"

export default function OutputFourSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-5 w-1/4" />

      <div className="space-y-3">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-10 w-1/2" />
        <Skeleton className="h-10 w-3/4" />
      </div>
    </div>
  )
}
