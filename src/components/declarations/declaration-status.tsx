import { Badge } from "@/components/ui/badge"
import { DECLARATIONS } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

export type DeclarationStatus =
  | "draft"
  | "pending_documents"
  | "in_review"
  | "submitted"
  | "completed"

const STATUS_COLORS: Record<DeclarationStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  pending_documents:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_review:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  submitted:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

interface DeclarationStatusBadgeProps {
  status: DeclarationStatus
  className?: string
}

export function DeclarationStatusBadge({
  status,
  className,
}: DeclarationStatusBadgeProps) {
  return (
    <Badge
      variant="secondary"
      className={cn(STATUS_COLORS[status], className)}
    >
      {DECLARATIONS.status[status]}
    </Badge>
  )
}
