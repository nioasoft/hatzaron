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

interface VehicleFormData {
  type: string
  value: number
  model: string
  year: string
  licensePlate: string
}

interface VehicleFormProps {
  onSubmit: (data: VehicleFormData) => void
  onCancel: () => void
}

const VEHICLE_TYPES = [
  { value: "car", label: "רכב פרטי" },
  { value: "suv", label: "ג'יפ" },
  { value: "motorcycle", label: "אופנוע" },
  { value: "truck", label: "משאית" },
  { value: "van", label: "רכב מסחרי" },
  { value: "other", label: "אחר" },
]

const currentYear = new Date().getFullYear()
const years = Array.from({ length: 30 }, (_, i) =>
  (currentYear - i).toString()
)

export function VehicleForm({ onSubmit, onCancel }: VehicleFormProps) {
  const [type, setType] = useState("")
  const [value, setValue] = useState("")
  const [model, setModel] = useState("")
  const [year, setYear] = useState("")
  const [licensePlate, setLicensePlate] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const typeLabel =
      VEHICLE_TYPES.find((t) => t.value === type)?.label || type
    onSubmit({
      type: typeLabel,
      value: Number(value) || 0,
      model,
      year,
      licensePlate,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="type">סוג רכב</Label>
          <Select value={type} onValueChange={setType}>
            <SelectTrigger>
              <SelectValue placeholder="בחר סוג רכב" />
            </SelectTrigger>
            <SelectContent>
              {VEHICLE_TYPES.map((t) => (
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
            placeholder="150,000"
            dir="ltr"
            className="text-start"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="model">דגם</Label>
          <Input
            id="model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            placeholder='לדוגמה: טויוטה קורולה'
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="year">שנת יצור</Label>
          <Select value={year} onValueChange={setYear}>
            <SelectTrigger>
              <SelectValue placeholder="בחר שנה" />
            </SelectTrigger>
            <SelectContent>
              {years.map((y) => (
                <SelectItem key={y} value={y}>
                  {y}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="licensePlate">מספר רישוי</Label>
          <Input
            id="licensePlate"
            value={licensePlate}
            onChange={(e) => setLicensePlate(e.target.value)}
            placeholder="12-345-67"
            dir="ltr"
            className="text-start"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          {ACTIONS.cancel}
        </Button>
        <Button type="submit" disabled={!type || !value || !model || !year}>
          {ACTIONS.save}
        </Button>
      </div>
    </form>
  )
}
