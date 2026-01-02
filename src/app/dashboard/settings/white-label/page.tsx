import { getFirmSettings } from "@/app/dashboard/settings/actions"
import { WhiteLabelManager } from "@/components/settings/white-label-manager"
import { WhiteLabelSettings } from "@/components/settings/white-label-form"

const defaultSettings: WhiteLabelSettings = {
  logo: "",
  primaryColor: "oklch(0.6 0.15 250)", // Professional Blue default
  firmName: "",
  contactEmail: "",
  emailSignature: "",
}

export default async function WhiteLabelSettingsPage() {
  const settings = await getFirmSettings()

  return (
    <WhiteLabelManager initialSettings={settings || defaultSettings} />
  )
}