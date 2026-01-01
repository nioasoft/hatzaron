import { headers } from "next/headers"
import { auth } from "./auth"

export async function isAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return false
  const user = session.user as { role?: string }
  return user.role === "admin"
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) throw new Error("Unauthorized: Admin access required")
}

export async function getImpersonationState() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const sessionData = session.session as { impersonatedBy?: string }
  return {
    isImpersonating: !!sessionData.impersonatedBy,
    originalAdminId: sessionData.impersonatedBy,
  }
}
