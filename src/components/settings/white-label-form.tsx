"use client"

import { useState, useRef } from "react"
import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { SETTINGS, ACTIONS } from "@/lib/constants/hebrew"

export interface WhiteLabelSettings {
  logo?: string
  primaryColor: string
  firmName: string
  contactEmail: string
  emailSignature?: string
}

interface WhiteLabelFormProps {
  initialData: WhiteLabelSettings
  onChange: (data: WhiteLabelSettings) => void
  onSubmit: (data: WhiteLabelSettings) => Promise<void>
}

// Preset colors for easy selection
const COLOR_PRESETS = [
  { name: "כתום", value: "oklch(0.7 0.15 50)" },
  { name: "כחול", value: "oklch(0.6 0.15 250)" },
  { name: "ירוק", value: "oklch(0.65 0.15 150)" },
  { name: "סגול", value: "oklch(0.6 0.15 300)" },
  { name: "אדום", value: "oklch(0.6 0.2 25)" },
  { name: "טורקיז", value: "oklch(0.7 0.12 200)" },
]

export function WhiteLabelForm({
  initialData,
  onChange,
  onSubmit,
}: WhiteLabelFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<WhiteLabelSettings>(initialData)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (field: keyof WhiteLabelSettings, value: string) => {
    const newData = { ...formData, [field]: value }
    setFormData(newData)
    onChange(newData)
  }

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Create a preview URL for the uploaded file
      const url = URL.createObjectURL(file)
      handleChange("logo", url)
    }
  }

  const handleRemoveLogo = () => {
    handleChange("logo", "")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await onSubmit(formData)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{SETTINGS.whiteLabel.title}</CardTitle>
        <CardDescription>התאם את המראה של פורטל הלקוח שלך</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Logo Upload */}
          <div className="space-y-2">
            <Label>{SETTINGS.whiteLabel.logo}</Label>
            <div className="flex items-center gap-4">
              {formData.logo ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={formData.logo}
                    alt="Logo preview"
                    className="h-16 w-auto rounded border bg-muted p-2"
                  />
                  <button
                    type="button"
                    onClick={handleRemoveLogo}
                    className="absolute -top-2 -end-2 h-6 w-6 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-16 w-32 border-2 border-dashed rounded flex items-center justify-center cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
              >
                {SETTINGS.whiteLabel.uploadLogo}
              </Button>
            </div>
          </div>

          {/* Primary Color */}
          <div className="space-y-2">
            <Label>{SETTINGS.whiteLabel.primaryColor}</Label>
            <div className="flex flex-wrap gap-2">
              {COLOR_PRESETS.map((color) => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => handleChange("primaryColor", color.value)}
                  className={`h-10 w-10 rounded-full border-2 transition-all ${
                    formData.primaryColor === color.value
                      ? "border-foreground scale-110"
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              בחר צבע ראשי לפורטל הלקוח שלך
            </p>
          </div>

          {/* Firm Name */}
          <div className="space-y-2">
            <Label htmlFor="firmName">{SETTINGS.whiteLabel.firmName}</Label>
            <Input
              id="firmName"
              value={formData.firmName}
              onChange={(e) => handleChange("firmName", e.target.value)}
              placeholder="שם המשרד שלך"
            />
          </div>

          {/* Contact Email */}
          <div className="space-y-2">
            <Label htmlFor="contactEmail">
              {SETTINGS.whiteLabel.contactEmail}
            </Label>
            <Input
              id="contactEmail"
              type="email"
              value={formData.contactEmail}
              onChange={(e) => handleChange("contactEmail", e.target.value)}
              placeholder="contact@firm.co.il"
              dir="ltr"
            />
          </div>

          {/* Email Signature */}
          <div className="space-y-2">
            <Label htmlFor="emailSignature">
              {SETTINGS.whiteLabel.emailSignature}
            </Label>
            <Textarea
              id="emailSignature"
              value={formData.emailSignature || ""}
              onChange={(e) => handleChange("emailSignature", e.target.value)}
              placeholder="חתימה שתופיע בתחתית האימיילים ללקוחות"
              rows={3}
            />
          </div>

          {/* Submit */}
          <div className="flex justify-end pt-4 border-t">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "שומר..." : ACTIONS.save}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
