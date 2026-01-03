"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useDebouncedCallback } from "use-debounce"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserCheck, UserPlus } from "lucide-react"
import {
  findClientByIdNumber,
  createDeclarationWithClient,
} from "@/app/dashboard/declarations/actions"
import { CLIENTS, VALIDATION } from "@/lib/constants/hebrew"

type ClientStatus = "idle" | "searching" | "found" | "new"

interface FormData {
  // Client fields
  firstName: string
  lastName: string
  idNumber: string
  phone: string
  email: string
  address: string
  clientNotes: string
  // Declaration fields
  year: number
  declarationDate: string
  taxAuthorityDueDate: string
  internalDueDate: string
  subject: string
  declarationNotes: string
}

interface FormErrors {
  [key: string]: string
}

export function CreateDeclarationForm() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [clientStatus, setClientStatus] = useState<ClientStatus>("idle")
  const [errors, setErrors] = useState<FormErrors>({})

  const [formData, setFormData] = useState<FormData>({
    // Client fields
    firstName: "",
    lastName: "",
    idNumber: "",
    phone: "",
    email: "",
    address: "",
    clientNotes: "",
    // Declaration fields
    year: new Date().getFullYear(),
    declarationDate: new Date().toISOString().split("T")[0]!,
    taxAuthorityDueDate: "",
    internalDueDate: "",
    subject: "הצהרת הון",
    declarationNotes: "",
  })

  // Debounced search for client by ID number
  const debouncedSearch = useDebouncedCallback(async (idNumber: string) => {
    const cleanId = idNumber.replace(/\D/g, "")
    if (cleanId.length !== 9) {
      setClientStatus("idle")
      return
    }

    setClientStatus("searching")
    const client = await findClientByIdNumber(cleanId)

    if (client) {
      setClientStatus("found")
      // Auto-fill form fields
      setFormData((prev) => ({
        ...prev,
        firstName: client.firstName,
        lastName: client.lastName,
        phone: client.phone,
        email: client.email,
        address: client.address || "",
        clientNotes: client.notes || "",
      }))
      toast.success("לקוח קיים נמצא - הפרטים מולאו אוטומטית")
    } else {
      setClientStatus("new")
      toast.info("לקוח חדש - מלא את הפרטים")
    }
  }, 500)

  const handleIdNumberChange = (value: string) => {
    // Allow only digits
    const cleanValue = value.replace(/\D/g, "").slice(0, 9)
    handleChange("idNumber", cleanValue)

    // Clear client fields if idNumber changes and a client was found before
    if (clientStatus === "found") {
      setFormData((prev) => ({
        ...prev,
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        address: "",
        clientNotes: "",
      }))
    }

    // Trigger debounced search
    debouncedSearch(cleanValue)
  }

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // ID Number validation (9 digits)
    if (!formData.idNumber) {
      newErrors.idNumber = VALIDATION.required
    } else if (!/^\d{9}$/.test(formData.idNumber)) {
      newErrors.idNumber = VALIDATION.invalidIdNumber
    }

    // Required fields
    if (!formData.firstName.trim()) {
      newErrors.firstName = VALIDATION.required
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = VALIDATION.required
    }

    // Phone validation (10 digits)
    if (!formData.phone) {
      newErrors.phone = VALIDATION.required
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = VALIDATION.invalidPhone
    }

    // Email validation (required and must be valid)
    if (!formData.email) {
      newErrors.email = VALIDATION.required
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = VALIDATION.invalidEmail
    }

    // Declaration date required
    if (!formData.declarationDate) {
      newErrors.declarationDate = VALIDATION.required
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      toast.error("יש לתקן את השגיאות בטופס")
      return
    }

    setIsSubmitting(true)

    try {
      // Build the data object, only including optional fields if they have values
      const submitData: Parameters<typeof createDeclarationWithClient>[0] = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        idNumber: formData.idNumber,
        phone: formData.phone.replace(/\D/g, ""),
        email: formData.email.trim(),
        year: Number(formData.year),
        declarationDate: new Date(formData.declarationDate),
        subject: formData.subject.trim(),
      }

      // Add optional client fields only if they have values
      if (formData.address.trim()) {
        submitData.address = formData.address.trim()
      }
      if (formData.clientNotes.trim()) {
        submitData.notes = formData.clientNotes.trim()
      }
      if (formData.declarationNotes.trim()) {
        submitData.declarationNotes = formData.declarationNotes.trim()
      }
      if (formData.taxAuthorityDueDate) {
        submitData.taxAuthorityDueDate = new Date(formData.taxAuthorityDueDate)
      }
      if (formData.internalDueDate) {
        submitData.internalDueDate = new Date(formData.internalDueDate)
      }

      const result = await createDeclarationWithClient(submitData)

      if (result.success && result.id) {
        toast.success("ההצהרה נוצרה בהצלחה")
        router.push(`/dashboard/declarations/${result.id}`)
      } else {
        toast.error(result.error || "שגיאה ביצירת ההצהרה")
      }
    } catch (error) {
      console.error(error)
      toast.error("שגיאה ביצירת ההצהרה")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }

  const handlePhoneChange = (value: string) => {
    // Allow only digits
    const cleanValue = value.replace(/\D/g, "").slice(0, 10)
    handleChange("phone", cleanValue)
  }

  const renderClientStatusBadge = () => {
    switch (clientStatus) {
      case "searching":
        return (
          <Badge variant="secondary" className="gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            מחפש...
          </Badge>
        )
      case "found":
        return (
          <Badge variant="default" className="gap-1 bg-green-600">
            <UserCheck className="h-3 w-3" />
            לקוח קיים
          </Badge>
        )
      case "new":
        return (
          <Badge variant="default" className="gap-1 bg-blue-600">
            <UserPlus className="h-3 w-3" />
            לקוח חדש
          </Badge>
        )
      default:
        return null
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 lg:grid-cols-2">
      {/* Client Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">פרטי לקוח</CardTitle>
            {renderClientStatusBadge()}
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Row 1: ID + First Name + Last Name (3 columns on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="idNumber" className="text-sm">
                {CLIENTS.form.idNumber} *
              </Label>
              <Input
                id="idNumber"
                value={formData.idNumber}
                onChange={(e) => handleIdNumberChange(e.target.value)}
                placeholder="9 ספרות"
                className={errors.idNumber ? "border-destructive" : ""}
                dir="ltr"
              />
              {errors.idNumber && (
                <p className="text-xs text-destructive">{errors.idNumber}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="firstName" className="text-sm">
                {CLIENTS.form.firstName} *
              </Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleChange("firstName", e.target.value)}
                className={errors.firstName ? "border-destructive" : ""}
              />
              {errors.firstName && (
                <p className="text-xs text-destructive">{errors.firstName}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="lastName" className="text-sm">
                {CLIENTS.form.lastName} *
              </Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleChange("lastName", e.target.value)}
                className={errors.lastName ? "border-destructive" : ""}
              />
              {errors.lastName && (
                <p className="text-xs text-destructive">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Row 2: Phone + Email (2 columns on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="phone" className="text-sm">
                {CLIENTS.form.phone} *
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                placeholder="0501234567"
                className={errors.phone ? "border-destructive" : ""}
                dir="ltr"
              />
              {errors.phone && (
                <p className="text-xs text-destructive">{errors.phone}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="email" className="text-sm">
                {CLIENTS.form.email} *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="example@email.com"
                className={errors.email ? "border-destructive" : ""}
                dir="ltr"
              />
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email}</p>
              )}
            </div>
          </div>

          {/* Row 3: Address + Notes (2 columns on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="address" className="text-sm">
                {CLIENTS.form.address}
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => handleChange("address", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="clientNotes" className="text-sm">
                {CLIENTS.form.notes}
              </Label>
              <Input
                id="clientNotes"
                value={formData.clientNotes}
                onChange={(e) => handleChange("clientNotes", e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Declaration Details Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">פרטי הצהרה</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* Row 1: Year + Date + Subject (3 columns on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="space-y-1">
              <Label htmlFor="year" className="text-sm">
                שנת מס *
              </Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="declarationDate" className="text-sm">
                תאריך הצהרה *
              </Label>
              <Input
                id="declarationDate"
                type="date"
                value={formData.declarationDate}
                onChange={(e) => handleChange("declarationDate", e.target.value)}
                className={errors.declarationDate ? "border-destructive" : ""}
              />
              {errors.declarationDate && (
                <p className="text-xs text-destructive">{errors.declarationDate}</p>
              )}
            </div>
            <div className="space-y-1">
              <Label htmlFor="subject" className="text-sm">
                נושא
              </Label>
              <Input
                id="subject"
                value={formData.subject}
                onChange={(e) => handleChange("subject", e.target.value)}
              />
            </div>
          </div>

          {/* Row 2: Due Dates (2 columns on desktop, stacked on mobile) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="taxAuthorityDueDate" className="text-sm">
                דד-ליין רשות המסים
              </Label>
              <Input
                id="taxAuthorityDueDate"
                type="date"
                value={formData.taxAuthorityDueDate}
                onChange={(e) =>
                  handleChange("taxAuthorityDueDate", e.target.value)
                }
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="internalDueDate" className="text-sm">
                דד-ליין פנימי
              </Label>
              <Input
                id="internalDueDate"
                type="date"
                value={formData.internalDueDate}
                onChange={(e) => handleChange("internalDueDate", e.target.value)}
              />
            </div>
          </div>

          {/* Row 3: Declaration Notes (full width) */}
          <div className="space-y-1">
            <Label htmlFor="declarationNotes" className="text-sm">
              הערות להצהרה
            </Label>
            <Input
              id="declarationNotes"
              value={formData.declarationNotes}
              onChange={(e) => handleChange("declarationNotes", e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Submit Button - spans both columns */}
      <div className="lg:col-span-2 flex justify-end">
        <Button type="submit" disabled={isSubmitting} size="lg">
          {isSubmitting ? (
            <>
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
              יוצר הצהרה...
            </>
          ) : (
            "צור הצהרה"
          )}
        </Button>
      </div>
    </form>
  )
}
