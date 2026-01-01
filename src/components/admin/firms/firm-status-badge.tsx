import { Badge } from "@/components/ui/badge"
import { ADMIN } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
} as const

interface FirmStatusBadgeProps {
  isBanned: boolean | null
  className?: string
}

export function FirmStatusBadge({ isBanned, className }: FirmStatusBadgeProps) {
  const status = isBanned ? "suspended" : "active"

  return (
    <Badge
      variant="secondary"
      className={cn(STATUS_COLORS[status], className)}
    >
      {isBanned ? ADMIN.firms.status.suspended : ADMIN.firms.status.active}
    </Badge>
  )
}
