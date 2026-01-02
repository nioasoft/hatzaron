import { Badge } from "@/components/ui/badge"
import { DECLARATIONS } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

export type DeclarationStatus = keyof typeof DECLARATIONS.status

const STATUS_COLORS: Record<DeclarationStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200",
  in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  waiting_documents: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  documents_received: "bg-teal-100 text-teal-800 dark:bg-teal-900 dark:text-teal-200",
  reviewing: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  in_preparation: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200",
  pending_approval: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
  submitted: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  waiting: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  completed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200",
}

interface DeclarationStatusBadgeProps {
  status: string
  className?: string
}

export function DeclarationStatusBadge({
  status,
  className,
}: DeclarationStatusBadgeProps) {
  // Safe fallback if status is unknown
  const colorClass = STATUS_COLORS[status as DeclarationStatus] || "bg-gray-100 text-gray-800"
  const label = DECLARATIONS.status[status as DeclarationStatus] || status

  return (
    <Badge
      variant="secondary"
      className={cn(colorClass, className)}
    >
      {label}
    </Badge>
  )
}