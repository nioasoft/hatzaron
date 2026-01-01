import { PortalHeader } from "@/components/portal/header"
import { PORTAL } from "@/lib/constants/hebrew"

// Mock function to get accountant branding - would be replaced with actual DB query
async function getAccountantBranding(_accountantId: string) {
  // In production, this would fetch from database based on accountantId
  // For now, return default branding
  return {
    logo: "",
    primaryColor: "oklch(0.7 0.15 50)", // Orange default
    firmName: "משרד רואי חשבון",
    contactEmail: "contact@accounting.co.il",
  }
}

// Mock function to get client data
async function getClientData() {
  // In production, this would fetch from database based on session
  return {
    firstName: "ישראל",
    lastName: "ישראלי",
  }
}

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // In a real app, accountantId would come from the URL or session
  const accountantId = "default"
  const branding = await getAccountantBranding(accountantId)
  const client = await getClientData()

  // Portal navigation items
  const navItems = [
    { href: "/portal", label: PORTAL.tabs.status },
    { href: "/portal/documents", label: PORTAL.tabs.documents },
    { href: "/portal/data", label: PORTAL.tabs.data },
    { href: "/portal/messages", label: PORTAL.tabs.messages },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Inject custom CSS variables for white-label branding */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --portal-primary: ${branding.primaryColor};
            }
          `,
        }}
      />

      <PortalHeader
        logo={branding.logo}
        firmName={branding.firmName}
        clientName={`${client.firstName} ${client.lastName}`}
        navItems={navItems}
      />

      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Footer with accountant contact info */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>{branding.firmName}</p>
            <a
              href={`mailto:${branding.contactEmail}`}
              className="hover:text-foreground transition-colors"
              dir="ltr"
            >
              {branding.contactEmail}
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
