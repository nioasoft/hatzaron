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
import { ACTIONS } from "@/lib/constants/hebrew"

interface InvestmentFormData {
  type: string
  institution: string
  value: number
}

interface InvestmentFormProps {
  onSubmit: (data: InvestmentFormData) => void
  onCancel: () => void
}

const INVESTMENT_TYPES = [
  { value: "pension", label: "קופת גמל" },
  { value: "provident", label: "קרן השתלמות" },
  { value: "stocks", label: "מניות" },
  { value: "bonds", label: 'אג"ח' },
  { value: "mutual_fund", label: "קרן נאמנות" },
  { value: "etf", label: "תעודות סל" },
  { value: "life_insurance", label: "ביטוח חיים" },
  { value: "crypto", label: "מטבעות דיגיטליים" },
  { value: "other", label: "אחר" },
]

const INSTITUTIONS = [
  { value: "migdal", label: "מגדל" },
  { value: "clal", label: "כלל" },
  { value: "harel", label: "הראל" },
  { value: "phoenix", label: "הפניקס" },
  { value: "menora", label: "מנורה מבטחים" },
  { value: "altshuler", label: "אלטשולר שחם" },
  { value: "psagot", label: "פסגות" },
  { value: "meitav", label: "מיטב דש" },
  { value: "more", label: "מור" },
  { value: "ira", label: "אי.בי.אי" },
  { value: "other", label: "אחר" },
]

export function InvestmentForm({ onSubmit, onCancel }: InvestmentFormProps) {
  const [type, setType] = useState("")
  const [institution, setInstitution] = useState("")
  const [value, setValue] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const typeLabel =
      INVESTMENT_TYPES.find((t) => t.value === type)?.label || type
    const institutionLabel =
      INSTITUTIONS.find((i) => i.value === institution)?.label || institution
    onSubmit({
      type: typeLabel,
      institution: institutionLabel,
      value: Number(value) || 0,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">סוג השקעה</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="בחר סוג" />
            </SelectTrigger>
            <SelectContent>
              {INVESTMENT_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="institution">גוף מנהל</Label>
          <Select value={institution} onValueChange={setInstitution}>
            <SelectTrigger>
              <SelectValue placeholder="בחר גוף" />
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
          <Label htmlFor="value">שווי נוכחי (₪)</Label>
          <Input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="250,000"
            dir="ltr"
            className="text-start"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {ACTIONS.cancel}
        </Button>
        <Button type="submit" disabled={!type || !institution || !value}>
          {ACTIONS.save}
        </Button>
      </div>
    </form>
  )
}
