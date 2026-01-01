"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ACTIONS, SETTINGS } from "@/lib/constants/hebrew"

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
          <CardTitle>{SETTINGS.profile.accountDetails}</CardTitle>
          <CardDescription>{SETTINGS.profile.updateDetails}</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">{SETTINGS.profile.fullName}</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="firmName">{SETTINGS.profile.firmName}</Label>
                <Input
                  id="firmName"
                  value={formData.firmName}
                  onChange={(e) => handleChange("firmName", e.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="email">{SETTINGS.profile.email}</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  dir="ltr"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">{SETTINGS.profile.phone}</Label>
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
                {isSubmitting ? SETTINGS.profile.saving : ACTIONS.save}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{SETTINGS.profile.changePassword}</CardTitle>
          <CardDescription>{SETTINGS.profile.changePasswordDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">{SETTINGS.profile.currentPassword}</Label>
              <Input id="currentPassword" type="password" dir="ltr" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="newPassword">{SETTINGS.profile.newPassword}</Label>
                <Input id="newPassword" type="password" dir="ltr" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{SETTINGS.profile.confirmPassword}</Label>
                <Input id="confirmPassword" type="password" dir="ltr" />
              </div>
            </div>
            <div className="flex justify-end pt-4 border-t">
              <Button type="submit">{SETTINGS.profile.updatePassword}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
