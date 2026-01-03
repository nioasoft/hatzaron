"use client"

import { useRouter } from "next/navigation"
import { MoreHorizontal, Eye, Edit, Trash2, AlertCircle, Clock } from "lucide-react"
import {
  DeclarationStatusBadge,
} from "@/components/declarations/declaration-status"
import { PenaltyStatusBadge, PenaltyStatus } from "@/components/declarations/penalty-status-badge"
import { LateSubmissionIndicator } from "@/components/declarations/late-submission-indicator"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DECLARATIONS, ACTIONS, DASHBOARD_ENHANCED } from "@/lib/constants/hebrew"
import { formatDate, calculateDaysRemaining, getDaysRemainingColor, cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { DeclarationWithClient, EnhancedDeclaration, Accountant, assignAccountant } from "@/app/dashboard/declarations/actions"
import { toast } from "sonner"
import { useTransition } from "react"

// Support both basic and enhanced declaration types
type DeclarationData = DeclarationWithClient | EnhancedDeclaration

// Type guard to check if declaration has enhanced fields
function isEnhanced(d: DeclarationData): d is EnhancedDeclaration {
  return 'clientEmail' in d && 'taxYear' in d
}

interface DeclarationTableProps {
  declarations: DeclarationData[]
  accountants?: Accountant[]
  isAdmin?: boolean
  /** Set to true to show enhanced columns (requires EnhancedDeclaration data) */
  enhanced?: boolean
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'critical') {
    return <Badge variant="destructive" className="flex w-fit items-center gap-1"><AlertCircle className="h-3 w-3" /> קריטי</Badge>
  }
  if (priority === 'urgent') {
    return <Badge variant="outline" className="flex w-fit items-center gap-1 border-orange-500 text-orange-500"><Clock className="h-3 w-3" /> דחוף</Badge>
  }
  return <span className="text-muted-foreground text-sm">רגיל</span>
}

function DaysRemainingCell({ deadline }: { deadline: Date | null }) {
  if (!deadline) return <span className="text-muted-foreground">-</span>

  const days = calculateDaysRemaining(deadline)
  const colorClass = getDaysRemainingColor(days)

  if (days === null) return <span className="text-muted-foreground">-</span>

  let label: string
  if (days < 0) {
    label = `${DASHBOARD_ENHANCED.daysRemaining.overdue} ${Math.abs(days)} ${DASHBOARD_ENHANCED.daysRemaining.days}`
  } else if (days === 0) {
    label = DASHBOARD_ENHANCED.daysRemaining.today
  } else {
    label = `${days} ${DASHBOARD_ENHANCED.daysRemaining.days}`
  }

  return (
    <div className="flex flex-col">
      <span className="text-muted-foreground text-xs" dir="ltr">
        {formatDate(deadline.toISOString())}
      </span>
      <span className={cn("text-xs", colorClass)}>{label}</span>
    </div>
  )
}

function DocumentProgress({ count }: { count: number }) {
  const total = 6 // Standard number of required documents
  const percentage = Math.min((count / total) * 100, 100)

  return (
    <div className="flex items-center gap-2">
      <div className="bg-muted h-2 w-16 overflow-hidden rounded-full">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            percentage >= 100 ? "bg-green-500" :
            percentage >= 50 ? "bg-yellow-500" : "bg-red-500"
          )}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-muted-foreground text-xs">{count}/{total}</span>
    </div>
  )
}

function AccountantCell({
  declarationId,
  assignedToId,
  assignedToName,
  accountants,
  isAdmin
}: {
  declarationId: string
  assignedToId: string | null
  assignedToName: string | null
  accountants?: Accountant[]
  isAdmin?: boolean
}) {
  const [isPending, startTransition] = useTransition()

  if (!isAdmin || !accountants || accountants.length === 0) {
    return <span className="text-muted-foreground text-sm">{assignedToName || "-"}</span>
  }

  const handleAssign = (accountantId: string) => {
    startTransition(async () => {
      const result = await assignAccountant({
        declarationId,
        accountantId: accountantId === "unassigned" ? null : accountantId,
      })
      if (result.success) {
        toast.success("רו״ח הוקצה בהצלחה")
      } else {
        toast.error(result.error || "שגיאה בהקצאת רו״ח")
      }
    })
  }

  return (
    <Select
      value={assignedToId || "unassigned"}
      onValueChange={handleAssign}
      disabled={isPending}
    >
      <SelectTrigger className="h-8 w-[130px]">
        <SelectValue placeholder="הקצה רו״ח" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="unassigned">ללא הקצאה</SelectItem>
        {accountants.map((acc) => (
          <SelectItem key={acc.id} value={acc.id}>
            {acc.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export function DeclarationTable({
  declarations,
  accountants = [],
  isAdmin = false,
  enhanced = false
}: DeclarationTableProps) {
  const router = useRouter()

  const handleRowClick = (id: string) => {
    router.push(`/dashboard/declarations/${id}`)
  }

  // Simple table for non-enhanced mode (backwards compatible)
  if (!enhanced) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{DECLARATIONS.tableHeaders.client}</TableHead>
              <TableHead>{DECLARATIONS.tableHeaders.createdAt}</TableHead>
              <TableHead>{DECLARATIONS.tableHeaders.deadline}</TableHead>
              <TableHead>{DECLARATIONS.tableHeaders.status}</TableHead>
              <TableHead>עדיפות</TableHead>
              <TableHead className="w-[70px]">
                {DECLARATIONS.tableHeaders.actions}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {declarations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-muted-foreground py-8 text-center"
                >
                  לא נמצאו הצהרות
                </TableCell>
              </TableRow>
            ) : (
              declarations.map((declaration) => (
                <TableRow
                  key={declaration.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(declaration.id)}
                >
                  <TableCell>
                    <span className="font-medium hover:underline">
                      {declaration.clientName}
                    </span>
                  </TableCell>
                  <TableCell className="text-muted-foreground" dir="ltr">
                    {formatDate(declaration.createdAt.toISOString())}
                  </TableCell>
                  <TableCell className="text-muted-foreground" dir="ltr">
                    {declaration.deadline ? formatDate(declaration.deadline.toISOString()) : "-"}
                  </TableCell>
                  <TableCell>
                    <DeclarationStatusBadge status={declaration.status} />
                  </TableCell>
                  <TableCell>
                    <PriorityBadge priority={declaration.priority} />
                  </TableCell>
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{ACTIONS.view}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/declarations/${declaration.id}`)}
                        >
                          <Eye className="me-2 h-4 w-4" />
                          {ACTIONS.view}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/declarations/${declaration.id}/edit`)}
                        >
                          <Edit className="me-2 h-4 w-4" />
                          {ACTIONS.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="me-2 h-4 w-4" />
                          {ACTIONS.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    )
  }

  // Enhanced table with all 12 columns
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            {isAdmin && <TableHead className="w-[100px]">עדיפות</TableHead>}
            <TableHead>{DECLARATIONS.tableHeaders.client}</TableHead>
            <TableHead>שנת מס</TableHead>
            <TableHead>{DECLARATIONS.tableHeaders.status}</TableHead>
            <TableHead>רו״ח מוקצה</TableHead>
            <TableHead>דדליין רשות</TableHead>
            <TableHead>דדליין פנימי</TableHead>
            <TableHead>מסמכים</TableHead>
            <TableHead className="w-[60px]">איחור</TableHead>
            <TableHead>קנס</TableHead>
            <TableHead className="w-[70px]">
              {DECLARATIONS.tableHeaders.actions}
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {declarations.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={isAdmin ? 11 : 10}
                className="text-muted-foreground py-8 text-center"
              >
                לא נמצאו הצהרות
              </TableCell>
            </TableRow>
          ) : (
            declarations.map((declaration) => {
              const enhanced = isEnhanced(declaration) ? declaration : null
              return (
                <TableRow
                  key={declaration.id}
                  className="cursor-pointer hover:bg-muted/50"
                  onClick={() => handleRowClick(declaration.id)}
                >
                  {/* Priority (admin only) */}
                  {isAdmin && (
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <PriorityBadge priority={declaration.priority} />
                    </TableCell>
                  )}

                  {/* Client */}
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {declaration.clientName}
                      </span>
                      {enhanced && (
                        <span className="text-muted-foreground text-xs">
                          {enhanced.clientEmail}
                        </span>
                      )}
                    </div>
                  </TableCell>

                  {/* Tax Year */}
                  <TableCell>
                    <span className="font-medium">{enhanced?.taxYear || "-"}</span>
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    <DeclarationStatusBadge status={declaration.status} />
                  </TableCell>

                  {/* Assigned Accountant */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <AccountantCell
                      declarationId={declaration.id}
                      assignedToId={declaration.assignedTo}
                      assignedToName={enhanced?.assignedToName || null}
                      accountants={accountants}
                      isAdmin={isAdmin}
                    />
                  </TableCell>

                  {/* Tax Authority Deadline */}
                  <TableCell>
                    <DaysRemainingCell deadline={enhanced?.taxAuthorityDueDate || null} />
                  </TableCell>

                  {/* Internal Deadline */}
                  <TableCell>
                    <DaysRemainingCell deadline={enhanced?.internalDueDate || null} />
                  </TableCell>

                  {/* Document Progress */}
                  <TableCell>
                    <DocumentProgress count={enhanced?.documentCount || 0} />
                  </TableCell>

                  {/* Late Indicator */}
                  <TableCell>
                    <LateSubmissionIndicator
                      wasSubmittedLate={enhanced?.wasSubmittedLate}
                      showText={false}
                    />
                  </TableCell>

                  {/* Penalty Status */}
                  <TableCell>
                    <PenaltyStatusBadge
                      status={enhanced?.penaltyStatus as PenaltyStatus | null}
                    />
                  </TableCell>

                  {/* Actions */}
                  <TableCell onClick={(e) => e.stopPropagation()}>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{ACTIONS.view}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/declarations/${declaration.id}`)}
                        >
                          <Eye className="me-2 h-4 w-4" />
                          {ACTIONS.view}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => router.push(`/dashboard/declarations/${declaration.id}/edit`)}
                        >
                          <Edit className="me-2 h-4 w-4" />
                          {ACTIONS.edit}
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="me-2 h-4 w-4" />
                          {ACTIONS.delete}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}
