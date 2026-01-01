import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function FirmDetailLoading() {
  return (
    <div className="space-y-6">
      {/* Back Button Skeleton */}
      <Skeleton className="h-8 w-40" />

      {/* Page Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-7 w-48" />
            <Skeleton className="h-4 w-32" />
          </div>
        </div>
        <Skeleton className="h-10 w-28" />
      </div>

      {/* Content Grid Skeleton */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Firm Info Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Subscription Card Skeleton */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-24" />
          </CardHeader>
          <CardContent className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b last:border-0">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
