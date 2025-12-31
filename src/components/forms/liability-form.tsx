"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { ACTIONS } from "@/lib/constants/hebrew"

interface LiabilityFormData {
  type: string
  amount: number
  institution: string
  description: string
}

interface LiabilityFormProps {
  onSubmit: (data: LiabilityFormData) => void
  onCancel: () => void
}

const LIABILITY_TYPES = [
  { value: "mortgage", label: "משכנתא" },
  { value: "car_loan", label: "הלוואת רכב" },
  { value: "personal_loan", label: "הלוואה אישית" },
  { value: "credit_card", label: "חוב כרטיס אשראי" },
  { value: "business_loan", label: "הלוואה עסקית" },
  { value: "student_loan", label: "הלוואת סטודנטים" },
  { value: "tax_debt", label: "חוב מס" },
  { value: "other", label: "אחר" },
]

const INSTITUTIONS = [
  { value: "leumi", label: "בנק לאומי" },
  { value: "hapoalim", label: "בנק הפועלים" },
  { value: "discount", label: "בנק דיסקונט" },
  { value: "mizrahi", label: "בנק מזרחי-טפחות" },
  { value: "benleumi", label: "הבנק הבינלאומי" },
  { value: "cal", label: "כאל" },
  { value: "isracard", label: "ישראכרט" },
  { value: "max", label: "מקס" },
  { value: "tax_authority", label: "רשות המסים" },
  { value: "other", label: "אחר" },
]

export function LiabilityForm({ onSubmit, onCancel }: LiabilityFormProps) {
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const [institution, setInstitution] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const typeLabel =
      LIABILITY_TYPES.find((t) => t.value === type)?.label || type
    const institutionLabel =
      INSTITUTIONS.find((i) => i.value === institution)?.label || institution
    onSubmit({
      type: typeLabel,
      amount: Number(amount) || 0,
      institution: institutionLabel,
      description,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">סוג התחייבות</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="בחר סוג" />
            </SelectTrigger>
            <SelectContent>
              {LIABILITY_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">גורם מלווה</Label>
          <Select value={institution} onValueChange={setInstitution}>
            <SelectTrigger>
              <SelectValue placeholder="בחר גורם" />
            </SelectTrigger>
            <SelectContent>
              {INSTITUTIONS.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="amount">סכום יתרה (₪)</Label>
          <Input
            id="amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="500,000"
            dir="ltr"
            className="text-start"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">הערות (אופציונלי)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="פרטים נוספים"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {ACTIONS.cancel}
        </Button>
        <Button type="submit" disabled={!type || !institution || !amount}>
          {ACTIONS.save}
        </Button>
      </div>
    </form>
  )
}
