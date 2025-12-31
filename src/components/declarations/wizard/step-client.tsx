"use client"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CLIENTS, VALIDATION } from "@/lib/constants/hebrew"
import type { ClientData } from "./index"

interface StepClientProps {
  data: ClientData
  onUpdate: (data: Partial<ClientData>) => void
}

export function StepClient({ data, onUpdate }: StepClientProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">פרטי לקוח</h2>
        <p className="text-sm text-muted-foreground">
          הזן את פרטי הלקוח עבור הצהרת ההון
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName">
            {CLIENTS.form.firstName} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="firstName"
            value={data.firstName}
            onChange={(e) => onUpdate({ firstName: e.target.value })}
            placeholder="ישראל"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            {CLIENTS.form.lastName} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="lastName"
            value={data.lastName}
            onChange={(e) => onUpdate({ lastName: e.target.value })}
            placeholder="ישראלי"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="idNumber">
            {CLIENTS.form.idNumber} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="idNumber"
            value={data.idNumber}
            onChange={(e) => onUpdate({ idNumber: e.target.value })}
            placeholder="123456789"
            dir="ltr"
            className="text-start"
          />
          <p className="text-xs text-muted-foreground">{VALIDATION.required}</p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            {CLIENTS.form.phone} <span className="text-destructive">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            value={data.phone}
            onChange={(e) => onUpdate({ phone: e.target.value })}
            placeholder="050-1234567"
            dir="ltr"
            className="text-start"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="email">{CLIENTS.form.email}</Label>
          <Input
            id="email"
            type="email"
            value={data.email}
            onChange={(e) => onUpdate({ email: e.target.value })}
            placeholder="email@example.com"
            dir="ltr"
            className="text-start"
          />
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">{CLIENTS.form.address}</Label>
          <Textarea
            id="address"
            value={data.address}
            onChange={(e) => onUpdate({ address: e.target.value })}
            placeholder="רחוב, עיר, מיקוד"
            rows={2}
          />
        </div>
      </div>
    </div>
  )
}
