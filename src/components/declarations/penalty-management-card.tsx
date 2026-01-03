"use client"

import { useEffect, useState, useTransition } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertTriangle, Loader2 } from "lucide-react"
import { PENALTY, ACTIONS } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import {
  getPenaltyDetails,
  updatePenalty,
  type PenaltyDetails,
} from "@/app/dashboard/declarations/actions"
import { PenaltyStatus } from "./penalty-status-badge"

interface PenaltyManagementCardProps {
  declarationId: string
  className?: string
}

const PENALTY_STATUSES: PenaltyStatus[] = [
  "received",
  "appeal_submitted",
  "cancelled",
  "paid_by_client",
  "paid_by_office",
]

const PAID_BY_OPTIONS = [
  { value: "client", label: PENALTY.form.paidByOptions.client },
  { value: "office", label: PENALTY.form.paidByOptions.office },
]

export function PenaltyManagementCard({
  declarationId,
  className,
}: PenaltyManagementCardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isPending, startTransition] = useTransition()
  const [penalty, setPenalty] = useState<PenaltyDetails | null>(null)

  // Form state
  const [amount, setAmount] = useState("")
  const [status, setStatus] = useState<string>("")
  const [receivedDate, setReceivedDate] = useState("")
  const [notes, setNotes] = useState("")
  const [appealDate, setAppealDate] = useState("")
  const [appealNotes, setAppealNotes] = useState("")
  const [paidDate, setPaidDate] = useState("")
  const [paidAmount, setPaidAmount] = useState("")
  const [paidBy, setPaidBy] = useState("")

  useEffect(() => {
    async function fetchPenalty() {
      setIsLoading(true)
      const data = await getPenaltyDetails(declarationId)
      setPenalty(data)
      if (data) {
        setAmount(data.penaltyAmount || "")
        setStatus(data.penaltyStatus || "")
        setReceivedDate(data.penaltyReceivedDate || "")
        setNotes(data.penaltyNotes || "")
        setAppealDate(data.appealDate || "")
        setAppealNotes(data.appealNotes || "")
        setPaidDate(data.penaltyPaidDate || "")
        setPaidAmount(data.penaltyPaidAmount || "")
        setPaidBy(data.penaltyPaidBy || "")
      }
      setIsLoading(false)
    }
    fetchPenalty()
  }, [declarationId])

  const handleSave = () => {
    startTransition(async () => {
      const payload: Parameters<typeof updatePenalty>[0] = {
        declarationId,
      }
      if (amount) payload.penaltyAmount = amount
      if (status) payload.penaltyStatus = status
      if (receivedDate) payload.penaltyReceivedDate = receivedDate
      if (notes) payload.penaltyNotes = notes
      if (appealDate) payload.appealDate = appealDate
      if (appealNotes) payload.appealNotes = appealNotes
      if (paidDate) payload.penaltyPaidDate = paidDate
      if (paidAmount) payload.penaltyPaidAmount = paidAmount
      if (paidBy) payload.penaltyPaidBy = paidBy

      const result = await updatePenalty(payload)

      if (result.success) {
        toast.success("פרטי הקנס נשמרו בהצלחה")
      } else {
        toast.error(result.error || "שגיאה בשמירת פרטי הקנס")
      }
    })
  }

  // Show card only if submitted late or has penalty data
  const shouldShow =
    penalty?.wasSubmittedLate || penalty?.penaltyAmount || penalty?.penaltyStatus

  if (isLoading) {
    return (
      <Card
        className={cn(
          "border-red-200 dark:border-red-900",
          className
        )}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            {PENALTY.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!shouldShow) {
    return null
  }

  const showAppealSection = status === "appeal_submitted"
  const showPaymentSection =
    status === "paid_by_client" || status === "paid_by_office"

  return (
    <Card
      className={cn(
        "border-red-200 dark:border-red-900",
        className
      )}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          {PENALTY.title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Info Section */}
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="penalty-amount">{PENALTY.form.amount}</Label>
              <Input
                id="penalty-amount"
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0"
                dir="ltr"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="penalty-status">סטטוס</Label>
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger id="penalty-status">
                  <SelectValue placeholder="בחר סטטוס" />
                </SelectTrigger>
                <SelectContent>
                  {PENALTY_STATUSES.map((s) => (
                    <SelectItem key={s} value={s}>
                      {PENALTY.status[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="penalty-received-date">
              {PENALTY.form.receivedDate}
            </Label>
            <Input
              id="penalty-received-date"
              type="date"
              value={receivedDate}
              onChange={(e) => setReceivedDate(e.target.value)}
              dir="ltr"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="penalty-notes">{PENALTY.form.notes}</Label>
            <Textarea
              id="penalty-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="הערות לגבי הקנס..."
              rows={2}
            />
          </div>
        </div>

        {/* Appeal Section - Conditional */}
        {showAppealSection && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              פרטי ערעור
            </h4>
            <div className="space-y-2">
              <Label htmlFor="appeal-date">{PENALTY.form.appealDate}</Label>
              <Input
                id="appeal-date"
                type="date"
                value={appealDate}
                onChange={(e) => setAppealDate(e.target.value)}
                dir="ltr"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="appeal-notes">{PENALTY.form.appealNotes}</Label>
              <Textarea
                id="appeal-notes"
                value={appealNotes}
                onChange={(e) => setAppealNotes(e.target.value)}
                placeholder="פרטי הערעור..."
                rows={2}
              />
            </div>
          </div>
        )}

        {/* Payment Section - Conditional */}
        {showPaymentSection && (
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium text-sm text-muted-foreground">
              פרטי תשלום
            </h4>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="paid-date">{PENALTY.form.paidDate}</Label>
                <Input
                  id="paid-date"
                  type="date"
                  value={paidDate}
                  onChange={(e) => setPaidDate(e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="paid-amount">{PENALTY.form.paidAmount}</Label>
                <Input
                  id="paid-amount"
                  type="number"
                  value={paidAmount}
                  onChange={(e) => setPaidAmount(e.target.value)}
                  placeholder="0"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="paid-by">{PENALTY.form.paidBy}</Label>
              <Select value={paidBy} onValueChange={setPaidBy}>
                <SelectTrigger id="paid-by">
                  <SelectValue placeholder="בחר" />
                </SelectTrigger>
                <SelectContent>
                  {PAID_BY_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end pt-2">
          <Button onClick={handleSave} disabled={isPending}>
            {isPending && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
            {ACTIONS.save}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
