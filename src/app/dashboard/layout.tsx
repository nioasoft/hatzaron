import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ImpersonationBanner } from "@/components/admin/impersonation-banner"
import { DashboardHeader } from "@/components/dashboard/header"
import { Sidebar } from "@/components/dashboard/sidebar"
import { getImpersonationState } from "@/lib/admin"
import { auth } from "@/lib/auth"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    redirect("/login")
  }

  const impersonation = await getImpersonationState()

  return (
    <div className="min-h-screen bg-background">
      {/* Impersonation Banner */}
      {impersonation?.isImpersonating && (
        <ImpersonationBanner
          firmName={session.user.name || "Unknown"}
          firmEmail={session.user.email}
        />
      )}

      {/* Sidebar - fixed on desktop */}
      <Sidebar />

      {/* Main content area */}
      <div className={`lg:ps-64 ${impersonation?.isImpersonating ? "pt-10" : ""}`}>
        <DashboardHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
