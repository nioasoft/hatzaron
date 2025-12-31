"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACTIONS } from "@/lib/constants/hebrew"

interface ProfileFormData {
  name: string
  email: string
  phone: string
  firmName: string
}

export default function ProfileSettingsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "ישראל ישראלי",
    email: "israel@accounting.co.il",
    phone: "0501234567",
    firmName: "משרד רואי חשבון ישראלי",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Mock submission
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setIsSubmitting(false)
  }

  const handleChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>פרטי חשבון</CardTitle>
          <CardDescription>עדכן את פרטי החשבון שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">שם מלא</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firmName">שם המשרד</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => handleChange("firmName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">אימייל</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">טלפון</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  dir="ltr"
                />
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "שומר..." : ACTIONS.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>שינוי סיסמה</CardTitle>
          <CardDescription>עדכן את סיסמת החשבון שלך</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">סיסמה נוכחית</Label>
              <Input id="currentPassword" type="password" dir="ltr" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">סיסמה חדשה</Label>
                <Input id="newPassword" type="password" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">אימות סיסמה</Label>
                <Input id="confirmPassword" type="password" dir="ltr" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit">עדכן סיסמה</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
