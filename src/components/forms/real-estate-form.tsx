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

interface RealEstateFormData {
  type: string
  value: number
  location: string
  description: string
}

interface RealEstateFormProps {
  onSubmit: (data: RealEstateFormData) => void
  onCancel: () => void
}

const REAL_ESTATE_TYPES = [
  { value: "apartment", label: "דירת מגורים" },
  { value: "house", label: "בית פרטי" },
  { value: "land", label: "מגרש" },
  { value: "commercial", label: "נכס מסחרי" },
  { value: "parking", label: "חניה" },
  { value: "storage", label: "מחסן" },
  { value: "other", label: "אחר" },
]

export function RealEstateForm({ onSubmit, onCancel }: RealEstateFormProps) {
  const [type, setType] = useState("")
  const [value, setValue] = useState("")
  const [location, setLocation] = useState("")
  const [description, setDescription] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const typeLabel =
      REAL_ESTATE_TYPES.find((t) => t.value === type)?.label || type
    onSubmit({
      type: typeLabel,
      value: Number(value) || 0,
      location,
      description,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">סוג נכס</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="בחר סוג נכס" />
            </SelectTrigger>
            <SelectContent>
              {REAL_ESTATE_TYPES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="value">שווי מוערך (₪)</Label>
          <Input
            id="value"
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="1,000,000"
            dir="ltr"
            className="text-start"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="location">מיקום</Label>
          <Input
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="כתובת מלאה או עיר"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="description">הערות (אופציונלי)</Label>
          <Textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="פרטים נוספים על הנכס"
            rows={2}
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {ACTIONS.cancel}
        </Button>
        <Button type="submit" disabled={!type || !value || !location}>
          {ACTIONS.save}
        </Button>
      </div>
    </form>
  )
}
