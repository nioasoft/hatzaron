"use client"

import { useTransition, useOptimistic } from "react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { assignAccountant } from "@/app/dashboard/declarations/actions"
import { ASSIGNMENT } from "@/lib/constants/hebrew"
import { toast } from "sonner"
import { Loader2, User } from "lucide-react"

interface AssignAccountantSelectProps {
  declarationId: string
  currentAssignee: string | null
  accountants: Array<{ id: string; name: string }>
  isAdmin: boolean
}

export function AssignAccountantSelect({
  declarationId,
  currentAssignee,
  accountants,
  isAdmin,
}: AssignAccountantSelectProps) {
  const [isPending, startTransition] = useTransition()
  const [optimisticAssignee, setOptimisticAssignee] = useOptimistic(currentAssignee)

  // If not admin, show read-only display
  if (!isAdmin) {
    const assigneeName = accountants.find((a) => a.id === currentAssignee)?.name
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <User className="h-4 w-4" />
        <span>{assigneeName || ASSIGNMENT.unassigned}</span>
      </div>
    )
  }

  const handleChange = (value: string) => {
    const newAssignee = value === "unassigned" ? null : value

    startTransition(async () => {
      // Optimistic update
      setOptimisticAssignee(newAssignee)

      const result = await assignAccountant({
        declarationId,
        accountantId: newAssignee,
      })

      if (result.success) {
        toast.success(ASSIGNMENT.toast.success)
      } else {
        // Revert on error
        setOptimisticAssignee(currentAssignee)
        toast.error(result.error || ASSIGNMENT.toast.error)
      }
    })
  }

  return (
    <div className="relative">
      <Select
        value={optimisticAssignee || "unassigned"}
        onValueChange={handleChange}
        disabled={isPending}
      >
        <SelectTrigger className="w-full min-w-[180px]">
          {isPending ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-muted-foreground">...</span>
            </div>
          ) : (
            <SelectValue placeholder={ASSIGNMENT.placeholder} />
          )}
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unassigned">
            <span className="text-muted-foreground">{ASSIGNMENT.unassigned}</span>
          </SelectItem>
          {accountants.map((accountant) => (
            <SelectItem key={accountant.id} value={accountant.id}>
              {accountant.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
