import { formatDistanceToNow } from "date-fns"
import { he } from "date-fns/locale"
import { User, Bot, ArrowLeft } from "lucide-react"
import { getDeclarationStatusHistory } from "@/app/dashboard/declarations/actions"
import { DeclarationStatusBadge } from "@/components/declarations/declaration-status"
import { STATUS_MANAGEMENT } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

interface StatusHistoryTimelineProps {
  declarationId: string
  className?: string
}

export async function StatusHistoryTimeline({
  declarationId,
  className,
}: StatusHistoryTimelineProps) {
  const history = await getDeclarationStatusHistory(declarationId)

  if (history.length === 0) {
    return (
      <div className={cn("rounded-lg border p-4", className)}>
        <h3 className="font-semibold mb-3">{STATUS_MANAGEMENT.timeline.title}</h3>
        <p className="text-sm text-muted-foreground">{STATUS_MANAGEMENT.timeline.empty}</p>
      </div>
    )
  }

  return (
    <div className={cn("rounded-lg border p-4", className)}>
      <h3 className="font-semibold mb-4">{STATUS_MANAGEMENT.timeline.title}</h3>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute top-0 bottom-0 start-3 w-px bg-border" />

        <div className="space-y-4">
          {history.map((entry) => {
            const isSystemChange = entry.changedBy === null
            const timeAgo = formatDistanceToNow(new Date(entry.changedAt), {
              addSuffix: true,
              locale: he,
            })

            return (
              <div key={entry.id} className="relative flex gap-3 ps-8">
                {/* Timeline dot with icon */}
                <div
                  className={cn(
                    "absolute start-0 flex h-6 w-6 items-center justify-center rounded-full border-2 border-background",
                    isSystemChange
                      ? "bg-muted text-muted-foreground"
                      : "bg-primary text-primary-foreground"
                  )}
                >
                  {isSystemChange ? (
                    <Bot className="h-3 w-3" />
                  ) : (
                    <User className="h-3 w-3" />
                  )}
                </div>

                <div className="flex-1 min-w-0 pb-4">
                  {/* Status transition */}
                  <div className="flex flex-wrap items-center gap-1.5 text-sm">
                    {entry.fromStatus && (
                      <>
                        <DeclarationStatusBadge status={entry.fromStatus} />
                        <ArrowLeft className="h-3 w-3 text-muted-foreground rotate-180 rtl:rotate-0" />
                      </>
                    )}
                    <DeclarationStatusBadge status={entry.toStatus} />
                  </div>

                  {/* Meta info */}
                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                    <span>
                      {isSystemChange
                        ? STATUS_MANAGEMENT.timeline.systemChange
                        : entry.changedBy?.name || STATUS_MANAGEMENT.timeline.manualChange}
                    </span>
                    <span>•</span>
                    <span>{timeAgo}</span>
                  </div>

                  {/* Notes */}
                  {entry.notes && (
                    <p className="mt-2 text-sm text-muted-foreground bg-muted/50 rounded-md p-2">
                      {entry.notes}
                    </p>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
