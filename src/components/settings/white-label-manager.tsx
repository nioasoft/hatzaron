"use client"

import { useState } from "react"
import { toast } from "sonner"
import {
  WhiteLabelForm,
  type WhiteLabelSettings,
} from "@/components/settings/white-label-form"
import { WhiteLabelPreview } from "@/components/settings/white-label-preview"
import { updateFirmSettings } from "@/app/dashboard/settings/actions"

interface WhiteLabelManagerProps {
  initialSettings: WhiteLabelSettings
}

export function WhiteLabelManager({ initialSettings }: WhiteLabelManagerProps) {
  const [settings, setSettings] = useState<WhiteLabelSettings>(initialSettings)

  const handleChange = (data: WhiteLabelSettings) => {
    setSettings(data)
  }

  const handleSubmit = async (data: WhiteLabelSettings) => {
    try {
      await updateFirmSettings(data)
      toast.success("הגדרות המיתוג עודכנו בהצלחה")
    } catch (error) {
      console.error(error)
      toast.error("אירעה שגיאה בעת שמירת ההגדרות")
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Form */}
      <WhiteLabelForm
        initialData={settings}
        onChange={handleChange}
        onSubmit={handleSubmit}
      />

      {/* Live Preview */}
      <div className="lg:sticky lg:top-6 lg:self-start">
        <WhiteLabelPreview
          logo={settings.logo}
          primaryColor={settings.primaryColor}
          firmName={settings.firmName}
          contactEmail={settings.contactEmail}
        />
      </div>
    </div>
  )
}
