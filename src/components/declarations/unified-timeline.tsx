"use client"

import { useEffect, useState } from "react"
import {
  ArrowLeftRight,
  Bot,
  ChevronDown,
  Clock,
  Mail,
  MessageCircle,
  Phone,
  StickyNote,
  User,
} from "lucide-react"

import { getUnifiedHistory, type UnifiedHistoryEntry } from "@/app/dashboard/declarations/actions"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { COMMUNICATION, DECLARATIONS, STATUS_MANAGEMENT } from "@/lib/constants/hebrew"
import { cn, formatDateLong } from "@/lib/utils"

interface UnifiedTimelineProps {
  declarationId: string
  initialLimit?: number
}

// Status classification
const OFFICE_STATUSES = [
  "reviewing",
  "in_preparation",
  "pending_approval",
  "submitted",
  "completed",
]

function isOfficeStatus(status: string | undefined): boolean {
  if (!status) return false
  return OFFICE_STATUSES.includes(status)
}

// Icon components for each entry type
function getEntryIcon(entry: UnifiedHistoryEntry) {
  if (entry.type === "status_change") {
    if (entry.isSystemChange) {
      return <Bot className="h-4 w-4" />
    }
    return <ArrowLeftRight className="h-4 w-4" />
  }

  // Communication icons
  switch (entry.communicationType) {
    case "phone_call":
      return <Phone className="h-4 w-4" />
    case "whatsapp":
      return <MessageCircle className="h-4 w-4" />
    case "note":
      return <StickyNote className="h-4 w-4" />
    case "letter":
      return <Mail className="h-4 w-4" />
    default:
      return <MessageCircle className="h-4 w-4" />
  }
}

// Color classes for each entry type
function getEntryColors(entry: UnifiedHistoryEntry): string {
  if (entry.type === "status_change") {
    const isOffice = isOfficeStatus(entry.toStatus)
    return isOffice
      ? "bg-primary/10 text-primary"
      : "bg-muted text-muted-foreground"
  }

  // Communication colors
  switch (entry.communicationType) {
    case "phone_call":
      return "bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400"
    case "whatsapp":
      return "bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400"
    case "note":
      return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/50 dark:text-yellow-400"
    case "letter":
      return "bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400"
    default:
      return "bg-muted text-muted-foreground"
  }
}

// Entry content renderer
function EntryContent({ entry }: { entry: UnifiedHistoryEntry }) {
  if (entry.type === "status_change") {
    const fromLabel = entry.fromStatus
      ? DECLARATIONS.status[entry.fromStatus as keyof typeof DECLARATIONS.status] || entry.fromStatus
      : null
    const toLabel =
      DECLARATIONS.status[entry.toStatus as keyof typeof DECLARATIONS.status] || entry.toStatus

    return (
      <div className="space-y-1">
        <div className="font-medium text-sm">
          {fromLabel ? (
            <>
              {fromLabel} <span className="text-muted-foreground mx-1">←</span> {toLabel}
            </>
          ) : (
            <>{toLabel}</>
          )}
        </div>
        {entry.statusNotes && (
          <p className="text-xs text-muted-foreground">{entry.statusNotes}</p>
        )}
      </div>
    )
  }

  // Communication content
  const typeLabel =
    COMMUNICATION.types[entry.communicationType as keyof typeof COMMUNICATION.types] ||
    entry.communicationType
  const directionLabel =
    COMMUNICATION.directions[entry.direction as keyof typeof COMMUNICATION.directions] ||
    entry.direction

  return (
    <div className="space-y-1">
      <div className="font-medium text-sm">
        {typeLabel} ({directionLabel})
        {entry.subject && <span className="text-muted-foreground">: {entry.subject}</span>}
      </div>
      {entry.content && (
        <p className="text-xs text-muted-foreground line-clamp-2">{entry.content}</p>
      )}
      {entry.outcome && (
        <p className="text-xs text-primary/80">{entry.outcome}</p>
      )}
    </div>
  )
}

function TimelineSkeleton() {
  return (
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
  )
}

function EmptyState() {
  return (
    <div className="text-center py-6 text-muted-foreground">
      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
      <p>{STATUS_MANAGEMENT.timeline.empty}</p>
    </div>
  )
}

export function UnifiedTimeline({
  declarationId,
  initialLimit = 3,
}: UnifiedTimelineProps) {
  const [entries, setEntries] = useState<UnifiedHistoryEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    async function fetchHistory() {
      setIsLoading(true)
      const data = await getUnifiedHistory(declarationId)
      setEntries(data)
      setIsLoading(false)
    }
    fetchHistory()
  }, [declarationId])

  if (isLoading) {
    return <TimelineSkeleton />
  }

  if (entries.length === 0) {
    return <EmptyState />
  }

  const displayedEntries = showAll ? entries : entries.slice(0, initialLimit)
  const remaining = entries.length - initialLimit

  return (
    <div className="space-y-4">
      {/* Timeline entries */}
      <div className="space-y-3">
        {displayedEntries.map((entry) => (
          <div key={entry.id} className="flex gap-3">
            {/* Icon */}
            <div
              className={cn(
                "h-8 w-8 rounded-full flex items-center justify-center shrink-0",
                getEntryColors(entry)
              )}
            >
              {getEntryIcon(entry)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <EntryContent entry={entry} />
              <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                <span dir="ltr">{formatDateLong(entry.timestamp)}</span>
                {(entry.changedBy || entry.createdBy) && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      {entry.changedBy?.name || entry.createdBy?.name}
                    </span>
                  </>
                )}
                {entry.isSystemChange && (
                  <>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Bot className="h-3 w-3" />
                      {STATUS_MANAGEMENT.timeline.systemChange}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show more/less button */}
      {entries.length > initialLimit && (
        <Button
          variant="ghost"
          onClick={() => setShowAll(!showAll)}
          className="w-full transition-all"
        >
          {showAll ? "הצג פחות" : `הצג עוד ${remaining}`}
          <ChevronDown
            className={cn(
              "h-4 w-4 ms-2 transition-transform",
              showAll && "rotate-180"
            )}
          />
        </Button>
      )}
    </div>
  )
}
