import { notFound } from "next/navigation"
import { PortalHeader } from "@/components/portal/header"
import { getPortalData } from "@/app/portal/actions"

interface PublicPortalLayoutProps {
  children: React.ReactNode
  params: Promise<{ token: string }>
}

export default async function PublicPortalLayout({
  children,
  params,
}: PublicPortalLayoutProps) {
  const { token } = await params
  const data = await getPortalData(token)

  if (!data) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Inject custom CSS variables for white-label branding */}
      <style
        dangerouslySetInnerHTML={{
          __html: `
            :root {
              --portal-primary: ${data.firm.primaryColor};
            }
          `,
        }}
      />

      <PortalHeader
        {...(data.firm.logoUrl ? { logo: data.firm.logoUrl } : {})}
        firmName={data.firm.name}
        clientName={`${data.client.firstName} ${data.client.lastName}`}
        navItems={[]} // No navigation in wizard mode for now
      />

      <main className="container mx-auto px-4 py-6">{children}</main>

      {/* Footer with accountant contact info */}
      <footer className="border-t bg-muted/30 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-sm text-muted-foreground">
            <p>{data.firm.name}</p>
            {data.firm.contactEmail && (
              <a
                href={`mailto:${data.firm.contactEmail}`}
                className="hover:text-foreground transition-colors"
                dir="ltr"
              >
                {data.firm.contactEmail}
              </a>
            )}
          </div>
        </div>
      </footer>
    </div>
  )
}
