"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
import { createDeclaration } from "@/app/dashboard/declarations/actions"
import { Client } from "@/app/dashboard/clients/actions"

interface CreateDeclarationFormProps {
  clients: Client[]
}

interface FormData {
  clientId: string
  year: string | number
  declarationDate: string
  taxAuthorityDueDate: string
  internalDueDate: string
  subject: string
  notes: string
}

export function CreateDeclarationForm({ clients }: CreateDeclarationFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<FormData>({
    clientId: "",
    year: new Date().getFullYear(),
    declarationDate: new Date().toISOString().split("T")[0]!,
    taxAuthorityDueDate: "",
    internalDueDate: "",
    subject: "הצהרת הון",
    notes: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.clientId) {
      toast.error("אנא בחר לקוח")
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createDeclaration({
        clientId: formData.clientId,
        year: Number(formData.year),
        declarationDate: new Date(formData.declarationDate),
        subject: formData.subject,
        notes: formData.notes,
        ...(formData.taxAuthorityDueDate ? { taxAuthorityDueDate: new Date(formData.taxAuthorityDueDate) } : {}),
        ...(formData.internalDueDate ? { internalDueDate: new Date(formData.internalDueDate) } : {}),
      })

      toast.success("ההצהרה נוצרה בהצלחה")
      router.push(`/dashboard/declarations/${result.id}`)
    } catch (error) {
      console.error(error)
      toast.error("שגיאה ביצירת ההצהרה")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Client Selection */}
          <div className="space-y-2">
            <Label htmlFor="client">לקוח *</Label>
            <Select
              value={formData.clientId}
              onValueChange={(value) => handleChange("clientId", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר לקוח" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName} ({client.idNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            {/* Tax Year */}
            <div className="space-y-2">
              <Label htmlFor="year">שנת מס *</Label>
              <Input
                id="year"
                type="number"
                value={formData.year}
                onChange={(e) => handleChange("year", e.target.value)}
                required
              />
            </div>

            {/* Declaration Date */}
            <div className="space-y-2">
              <Label htmlFor="declarationDate">תאריך הצהרה (יום קובע) *</Label>
              <Input
                id="declarationDate"
                type="date"
                value={formData.declarationDate}
                onChange={(e) => handleChange("declarationDate", e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
             {/* Tax Authority Due Date */}
             <div className="space-y-2">
              <Label htmlFor="taxAuthorityDueDate">דד-ליין רשות המסים</Label>
              <Input
                id="taxAuthorityDueDate"
                type="date"
                value={formData.taxAuthorityDueDate}
                onChange={(e) => handleChange("taxAuthorityDueDate", e.target.value)}
              />
            </div>

             {/* Internal Due Date */}
             <div className="space-y-2">
              <Label htmlFor="internalDueDate">דד-ליין פנימי</Label>
              <Input
                id="internalDueDate"
                type="date"
                value={formData.internalDueDate}
                onChange={(e) => handleChange("internalDueDate", e.target.value)}
              />
            </div>
          </div>

          {/* Subject */}
          <div className="space-y-2">
            <Label htmlFor="subject">נושא *</Label>
            <Input
              id="subject"
              value={formData.subject}
              onChange={(e) => handleChange("subject", e.target.value)}
              required
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">הערות</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "יוצר..." : "צור הצהרה"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
