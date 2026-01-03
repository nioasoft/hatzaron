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
import { Card, CardContent } from "@/components/ui/card"
import { sendEmailReminder } from "@/app/dashboard/declarations/actions"
import { EMAIL_REMINDER } from "@/lib/constants/hebrew"
import { toast } from "sonner"
import { Loader2, Mail, Send } from "lucide-react"

type ReminderType = "documents_request" | "status_update" | "general"

interface SendReminderDialogProps {
  declarationId: string
  clientName: string
  clientEmail: string
  year: number
  portalUrl: string | null
  children?: React.ReactNode
}

export function SendReminderDialog({
  declarationId,
  clientName,
  clientEmail,
  year,
  portalUrl,
  children,
}: SendReminderDialogProps) {
  const [open, setOpen] = useState(false)
  const [reminderType, setReminderType] = useState<ReminderType>("documents_request")
  const [customMessage, setCustomMessage] = useState("")
  const [isPending, startTransition] = useTransition()

  const getPreviewMessage = () => {
    const template = EMAIL_REMINDER.templates[reminderType]
    return template
      .replace("{name}", clientName)
      .replace("{year}", year.toString())
      .replace("{link}", portalUrl || "[קישור לפורטל]")
  }

  const handleSubmit = () => {
    startTransition(async () => {
      const result = await sendEmailReminder({
        declarationId,
        reminderType,
        ...(customMessage.trim() ? { customMessage: customMessage.trim() } : {}),
      })

      if (result.success) {
        toast.success(EMAIL_REMINDER.toast.success)
        setOpen(false)
        setCustomMessage("")
        setReminderType("documents_request")
      } else {
        toast.error(result.error || EMAIL_REMINDER.toast.error)
      }
    })
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (!isOpen) {
      setCustomMessage("")
      setReminderType("documents_request")
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="outline" size="sm">
            <Mail className="me-2 h-4 w-4" />
            {EMAIL_REMINDER.title}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            {EMAIL_REMINDER.title}
          </DialogTitle>
          <DialogDescription>
            {clientEmail}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="reminderType">{EMAIL_REMINDER.form.selectType}</Label>
            <Select
              value={reminderType}
              onValueChange={(value) => setReminderType(value as ReminderType)}
            >
              <SelectTrigger id="reminderType" className="w-full">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(EMAIL_REMINDER.types).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-2">
            <Label>{EMAIL_REMINDER.form.preview}</Label>
            <Card className="bg-muted/50">
              <CardContent className="p-3">
                <p className="text-sm whitespace-pre-wrap" dir="rtl">
                  {getPreviewMessage()}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-2">
            <Label htmlFor="customMessage">{EMAIL_REMINDER.form.customMessage}</Label>
            <Textarea
              id="customMessage"
              placeholder={EMAIL_REMINDER.form.customMessagePlaceholder}
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
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
            ביטול
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="me-2 h-4 w-4 animate-spin" />
                {EMAIL_REMINDER.form.sending}
              </>
            ) : (
              <>
                <Send className="me-2 h-4 w-4" />
                {EMAIL_REMINDER.form.send}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
