import { ArrowRight, FileText, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { DECLARATIONS } from "@/lib/constants/hebrew"

export default function DeclarationDetailLoading() {
  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb & Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" disabled className="gap-2">
            <ArrowRight className="h-4 w-4" />
            {DECLARATIONS.title}
          </Button>
          <span className="text-muted-foreground">/</span>
          <Skeleton className="h-4 w-32" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>

      {/* Main Header Card Skeleton */}
      <Card className="overflow-hidden">
        {/* Client Info Section */}
        <div className="bg-gradient-to-l from-primary/5 to-transparent p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 flex-1">
              <div className="flex items-center gap-3">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-4 w-32" />
                <Separator orientation="vertical" className="h-4" />
                <Skeleton className="h-4 w-24" />
                <Separator orientation="vertical" className="h-4" />
                <Skeleton className="h-4 w-16" />
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-36" />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
              <Skeleton className="h-9 w-28" />
              <Skeleton className="h-9 w-32" />
            </div>
          </div>
        </div>

        {/* Office Status Section */}
        <div className="border-t bg-muted/30 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="rounded-lg border bg-background/50 p-3">
                <Skeleton className="h-3 w-24 mb-2" />
                <Skeleton className="h-5 w-32 mb-1" />
                <Skeleton className="h-3 w-20" />
              </div>
            ))}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Documents Card Skeleton */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  מסמכים
                </CardTitle>
                <Skeleton className="h-5 w-32 rounded-full" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[1, 2].map((category) => (
                  <div key={category} className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <div className="rounded-lg border bg-muted/30">
                      {[1, 2].map((doc) => (
                        <div
                          key={doc}
                          className={`flex items-center justify-between p-3 gap-3 ${
                            doc !== 2 ? "border-b" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Skeleton className="h-8 w-8 rounded" />
                            <div className="flex-1 space-y-1">
                              <Skeleton className="h-4 w-3/4" />
                              <Skeleton className="h-3 w-1/2" />
                            </div>
                          </div>
                          <Skeleton className="h-8 w-8" />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Timeline Card Skeleton */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                היסטוריה
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-3">
                    <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-24" />
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border bg-gradient-to-l from-primary/5 to-transparent p-3">
                <div className="flex items-center justify-between gap-2">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-8 w-16" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <Skeleton className="h-5 w-20" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-8" />
                <Skeleton className="h-4 w-24" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
