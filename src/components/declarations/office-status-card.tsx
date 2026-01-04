"use client"

import { differenceInDays } from "date-fns"
import { AlertTriangle, Calendar, Clock, UserCheck } from "lucide-react"

import { AssignAccountantSelect } from "@/components/declarations/assign-accountant-select"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { PENALTY } from "@/lib/constants/hebrew"
import { cn, formatDateLong } from "@/lib/utils"

interface OfficeStatusCardProps {
  declarationId: string
  taxAuthorityDueDate: Date | string | null
  internalDueDate: Date | string | null
  assignedTo: string | null
  accountants: Array<{ id: string; name: string }>
  isAdmin: boolean
  wasSubmittedLate?: boolean
  penaltyAmount?: string | number | null
  penaltyStatus?: string | null
}

interface DaysInfo {
  days: number
  isOverdue: boolean
  isUrgent: boolean
  label: string
}

function getDaysRemaining(deadline: Date | string | null): DaysInfo | null {
  if (!deadline) return null

  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline
  const days = differenceInDays(deadlineDate, new Date())

  return {
    days,
    isOverdue: days < 0,
    isUrgent: days <= 7 && days >= 0,
    label: days < 0 ? `איחור של ${Math.abs(days)} ימים` : days === 0 ? "היום" : `עוד ${days} ימים`,
  }
}

function DeadlineDisplay({
  label,
  date,
}: {
  label: string
  date: Date | string | null
}) {
  const daysInfo = getDaysRemaining(date)

  return (
    <div className="rounded-lg border bg-muted/30 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <Calendar className="h-3.5 w-3.5" />
        {label}
      </div>
      {date ? (
        <>
          <div className="font-medium" dir="ltr">
            {formatDateLong(date)}
          </div>
          {daysInfo && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs mt-1",
                daysInfo.isOverdue && "text-destructive",
                daysInfo.isUrgent && !daysInfo.isOverdue && "text-orange-600 dark:text-orange-400",
                !daysInfo.isOverdue && !daysInfo.isUrgent && "text-green-600 dark:text-green-400"
              )}
            >
              <Clock className="h-3 w-3" />
              {daysInfo.label}
            </div>
          )}
        </>
      ) : (
        <div className="text-muted-foreground text-sm">לא הוגדר</div>
      )}
    </div>
  )
}

export function OfficeStatusCard({
  declarationId,
  taxAuthorityDueDate,
  internalDueDate,
  assignedTo,
  accountants,
  isAdmin,
  wasSubmittedLate,
  penaltyAmount,
  penaltyStatus,
}: OfficeStatusCardProps) {
  const hasPenalty = wasSubmittedLate || penaltyAmount || penaltyStatus

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <UserCheck className="h-4 w-4" />
          סטטוס וניהול
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Deadlines */}
        <div className="grid gap-3 sm:grid-cols-2">
          <DeadlineDisplay
            label="דדליין רשות המסים"
            date={taxAuthorityDueDate}
          />
          <DeadlineDisplay
            label="דדליין פנימי"
            date={internalDueDate}
          />
        </div>

        <Separator />

        {/* Assigned Accountant */}
        <div className="space-y-2">
          <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <UserCheck className="h-3.5 w-3.5" />
            רו״ח אחראי
          </h4>
          <AssignAccountantSelect
            declarationId={declarationId}
            currentAssignee={assignedTo}
            accountants={accountants}
            isAdmin={isAdmin}
          />
        </div>

        {/* Penalty Section - Conditional */}
        {hasPenalty && (
          <>
            <Separator />
            <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-3">
              <div className="flex items-center gap-2 text-destructive mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium text-sm">{PENALTY.title}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {wasSubmittedLate && (
                  <Badge variant="destructive" className="text-xs">
                    {PENALTY.lateSubmission.indicator}
                  </Badge>
                )}
                {penaltyAmount && (
                  <Badge variant="outline" className="text-xs border-red-200 dark:border-red-800">
                    סכום: ₪{Number(penaltyAmount).toLocaleString()}
                  </Badge>
                )}
                {penaltyStatus && (
                  <Badge variant="secondary" className="text-xs">
                    {PENALTY.status[penaltyStatus as keyof typeof PENALTY.status] || penaltyStatus}
                  </Badge>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
