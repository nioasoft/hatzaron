"use client"

import { useState } from "react"
import {
  WhiteLabelForm,
  type WhiteLabelSettings,
} from "@/components/settings/white-label-form"
import { WhiteLabelPreview } from "@/components/settings/white-label-preview"

const defaultSettings: WhiteLabelSettings = {
  logo: "",
  primaryColor: "oklch(0.7 0.15 50)", // Orange default
  firmName: "משרד רואי חשבון",
  contactEmail: "contact@accounting.co.il",
  emailSignature: "",
}

export default function WhiteLabelSettingsPage() {
  const [settings, setSettings] = useState<WhiteLabelSettings>(defaultSettings)

  const handleChange = (data: WhiteLabelSettings) => {
    setSettings(data)
  }

  const handleSubmit = async (_data: WhiteLabelSettings) => {
    // Mock submission - would be replaced with actual API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
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
