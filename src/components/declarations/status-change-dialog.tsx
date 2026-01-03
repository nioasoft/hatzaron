"use client"

import { useState, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DeclarationStatusBadge } from "@/components/declarations/declaration-status"
import { updateDeclarationStatus } from "@/app/dashboard/declarations/actions"
import { DECLARATIONS, STATUS_MANAGEMENT } from "@/lib/constants/hebrew"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface StatusChangeDialogProps {
  declarationId: string
  currentStatus: string
  onStatusChanged?: () => void
  children?: React.ReactNode
}

const STATUS_OPTIONS = Object.entries(DECLARATIONS.status).map(([value, label]) => ({
  value,
  label,
}))

export function StatusChangeDialog({
  declarationId,
  currentStatus,
  onStatusChanged,
  children,
}: StatusChangeDialogProps) {
  const [open, setOpen] = useState(false)
  const [newStatus, setNewStatus] = useState(currentStatus)
  const [notes, setNotes] = useState("")
  const [isPending, startTransition] = useTransition()

  const handleSubmit = () => {
    if (newStatus === currentStatus) {
      toast.error("יש לבחור סטטוס שונה מהסטטוס הנוכחי")
      return
    }

    startTransition(async () => {
      const trimmedNotes = notes.trim()
      const result = await updateDeclarationStatus({
        declarationId,
        newStatus,
        ...(trimmedNotes ? { notes: trimmedNotes } : {}),
      })

      if (result.success) {
        toast.success(STATUS_MANAGEMENT.toast.success)
        setOpen(false)
        setNotes("")
        onStatusChanged?.()
      } else {
        toast.error(result.error || STATUS_MANAGEMENT.toast.error)
      }
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      // Reset form when closing
      setNewStatus(currentStatus)
      setNotes("")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <button type="button" className="cursor-pointer">
            <DeclarationStatusBadge status={currentStatus} />
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{STATUS_MANAGEMENT.dialog.title}</DialogTitle>
          <DialogDescription>
            {STATUS_MANAGEMENT.dialog.currentStatus}:{" "}
            <DeclarationStatusBadge status={currentStatus} className="ms-1 inline-flex" />
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="status">{STATUS_MANAGEMENT.dialog.newStatus}</Label>
            <Select value={newStatus} onValueChange={setNewStatus}>
              <SelectTrigger id="status" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {STATUS_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="notes">{STATUS_MANAGEMENT.dialog.notes}</Label>
            <Textarea
              id="notes"
              placeholder={STATUS_MANAGEMENT.dialog.notesPlaceholder}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              dir="rtl"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            {STATUS_MANAGEMENT.dialog.cancel}
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {STATUS_MANAGEMENT.dialog.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
