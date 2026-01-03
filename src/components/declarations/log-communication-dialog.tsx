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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { logCommunication, type CommunicationType, type CommunicationDirection } from "@/app/dashboard/declarations/actions"
import { COMMUNICATION } from "@/lib/constants/hebrew"
import { toast } from "sonner"
import { Loader2, MessageSquarePlus } from "lucide-react"

interface LogCommunicationDialogProps {
  declarationId: string
  onCommunicationLogged?: () => void
  children?: React.ReactNode
}

const COMMUNICATION_TYPES: { value: CommunicationType; label: string }[] = [
  { value: "phone_call", label: COMMUNICATION.types.phone_call },
  { value: "whatsapp", label: COMMUNICATION.types.whatsapp },
  { value: "note", label: COMMUNICATION.types.note },
  { value: "letter", label: COMMUNICATION.types.letter },
]

const DIRECTION_OPTIONS: { value: CommunicationDirection; label: string }[] = [
  { value: "outbound", label: COMMUNICATION.directions.outbound },
  { value: "inbound", label: COMMUNICATION.directions.inbound },
]

export function LogCommunicationDialog({
  declarationId,
  onCommunicationLogged,
  children,
}: LogCommunicationDialogProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [formData, setFormData] = useState({
    type: "phone_call" as CommunicationType,
    direction: "outbound" as CommunicationDirection,
    subject: "",
    content: "",
    outcome: "",
    communicatedAt: new Date().toISOString().slice(0, 16),
  })

  const handleSubmit = () => {
    startTransition(async () => {
      const trimmedSubject = formData.subject.trim()
      const trimmedContent = formData.content.trim()
      const trimmedOutcome = formData.outcome.trim()

      const result = await logCommunication({
        declarationId,
        type: formData.type,
        direction: formData.direction,
        ...(trimmedSubject ? { subject: trimmedSubject } : {}),
        ...(trimmedContent ? { content: trimmedContent } : {}),
        ...(trimmedOutcome ? { outcome: trimmedOutcome } : {}),
        ...(formData.communicatedAt ? { communicatedAt: new Date(formData.communicatedAt) } : {}),
      })

      if (result.success) {
        toast.success("התקשורת נרשמה בהצלחה")
        setOpen(false)
        resetForm()
        onCommunicationLogged?.()
      } else {
        toast.error(result.error || "שגיאה ברישום התקשורת")
      }
    })
  }

  const resetForm = () => {
    setFormData({
      type: "phone_call",
      direction: "outbound",
      subject: "",
      content: "",
      outcome: "",
      communicatedAt: new Date().toISOString().slice(0, 16),
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      resetForm()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <MessageSquarePlus className="me-2 h-4 w-4" />
            {COMMUNICATION.title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>רישום תקשורת</DialogTitle>
          <DialogDescription>
            תעד שיחה, הודעה או הערה עם הלקוח
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Type and Direction row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="type">{COMMUNICATION.form.type}</Label>
              <Select
                value={formData.type}
                onValueChange={(value: CommunicationType) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {COMMUNICATION_TYPES.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="direction">{COMMUNICATION.form.direction}</Label>
              <Select
                value={formData.direction}
                onValueChange={(value: CommunicationDirection) =>
                  setFormData((prev) => ({ ...prev, direction: value }))
                }
              >
                <SelectTrigger id="direction">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {DIRECTION_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* DateTime picker */}
          <div className="grid gap-2">
            <Label htmlFor="communicatedAt">{COMMUNICATION.form.date}</Label>
            <Input
              id="communicatedAt"
              type="datetime-local"
              value={formData.communicatedAt}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, communicatedAt: e.target.value }))
              }
              dir="ltr"
            />
          </div>

          {/* Subject */}
          <div className="grid gap-2">
            <Label htmlFor="subject">{COMMUNICATION.form.subject}</Label>
            <Input
              id="subject"
              placeholder="נושא התקשורת..."
              value={formData.subject}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, subject: e.target.value }))
              }
              dir="rtl"
            />
          </div>

          {/* Content */}
          <div className="grid gap-2">
            <Label htmlFor="content">{COMMUNICATION.form.content}</Label>
            <Textarea
              id="content"
              placeholder="תוכן השיחה/ההודעה..."
              value={formData.content}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, content: e.target.value }))
              }
              rows={3}
              dir="rtl"
            />
          </div>

          {/* Outcome */}
          <div className="grid gap-2">
            <Label htmlFor="outcome">{COMMUNICATION.form.outcome}</Label>
            <Textarea
              id="outcome"
              placeholder="תוצאה או סיכום..."
              value={formData.outcome}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, outcome: e.target.value }))
              }
              rows={2}
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
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="me-2 h-4 w-4 animate-spin" />}
            {COMMUNICATION.form.save}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
