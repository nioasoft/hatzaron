"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { CLIENTS, ACTIONS, VALIDATION } from "@/lib/constants/hebrew"

export interface ClientFormData {
  firstName: string
  lastName: string
  idNumber: string
  phone: string
  email?: string
  address?: string
  notes?: string
}

interface ClientFormProps {
  initialData?: ClientFormData
  onSubmit?: (data: ClientFormData) => Promise<void>
  isEdit?: boolean
}

export function ClientForm({
  initialData,
  onSubmit,
  isEdit = false,
}: ClientFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})

  const [formData, setFormData] = useState<ClientFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    idNumber: initialData?.idNumber || "",
    phone: initialData?.phone || "",
    email: initialData?.email || "",
    address: initialData?.address || "",
    notes: initialData?.notes || "",
  })

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = VALIDATION.required
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = VALIDATION.required
    }
    if (!formData.idNumber.trim()) {
      newErrors.idNumber = VALIDATION.required
    } else if (!/^\d{9}$/.test(formData.idNumber.replace(/\D/g, ""))) {
      newErrors.idNumber = VALIDATION.invalidIdNumber
    }
    if (!formData.phone.trim()) {
      newErrors.phone = VALIDATION.required
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = VALIDATION.invalidPhone
    }
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = VALIDATION.invalidEmail
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      if (onSubmit) {
        await onSubmit(formData)
      } else {
        // Mock submission for demo - would be replaced with actual API call
        await new Promise((resolve) => setTimeout(resolve, 1000))
        router.push("/dashboard/clients")
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    field: keyof ClientFormData,
    value: string
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "עריכת לקוח" : "הוספת לקוח חדש"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name fields */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">{CLIENTS.form.firstName} *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-sm text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">{CLIENTS.form.lastName} *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-sm text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* ID and Phone */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="idNumber">{CLIENTS.form.idNumber} *</Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleChange("idNumber", e.target.value)}
                className={errors.idNumber ? "border-destructive" : ""}
                placeholder="123456789"
                dir="ltr"
              />
              {errors.idNumber && (
                <p className="text-sm text-destructive">{errors.idNumber}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">{CLIENTS.form.phone} *</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                className={errors.phone ? "border-destructive" : ""}
                placeholder="0501234567"
                dir="ltr"
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Label htmlFor="email">{CLIENTS.form.email}</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
              placeholder="client@email.com"
              dir="ltr"
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>

          {/* Address */}
          <div className="space-y-2">
            <Label htmlFor="address">{CLIENTS.form.address}</Label>
            <Input
              id="address"
              value={formData.address}
              onChange={(e) => handleChange("address", e.target.value)}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">{CLIENTS.form.notes}</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              {ACTIONS.cancel}
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "שומר..." : CLIENTS.form.submit}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
