"use server"

import { eq } from "drizzle-orm"
import { db } from "@/lib/db"
import { firm, user } from "@/lib/schema"
import { revalidatePath } from "next/cache"
import { WhiteLabelSettings } from "@/components/settings/white-label-form"
import { getSession } from "@/lib/session"

export async function getFirmSettings() {
  const session = await getSession()
  if (!session?.user) return null

  // If user has a firmId, fetch the firm
  // We need to cast session.user to any because typescript might not know about firmId yet from the library types
  const firmId = (session.user as any).firmId

  if (!firmId) return null

  const existingFirm = await db.query.firm.findFirst({
    where: eq(firm.id, firmId),
  })

  if (!existingFirm) return null

  // Map database fields to WhiteLabelSettings interface
  return {
    logo: existingFirm.logoUrl || "",
    primaryColor: existingFirm.primaryColor || "#2563eb",
    firmName: existingFirm.name,
    contactEmail: existingFirm.contactEmail || "",
    emailSignature: (existingFirm.settings as any)?.emailSignature || "",
  } as WhiteLabelSettings
}

export async function updateFirmSettings(data: WhiteLabelSettings) {
  const session = await getSession()
  if (!session?.user) throw new Error("Unauthorized")

  let firmId = (session.user as any).firmId

  if (firmId) {
    // Update existing firm
    await db
      .update(firm)
      .set({
        name: data.firmName,
        logoUrl: data.logo,
        primaryColor: data.primaryColor,
        contactEmail: data.contactEmail,
        settings: {
          emailSignature: data.emailSignature,
        },
        updatedAt: new Date(),
      })
      .where(eq(firm.id, firmId))
  } else {
    // Create new firm (Onboarding flow)
    const newFirm = await db
      .insert(firm)
      .values({
        name: data.firmName,
        logoUrl: data.logo,
        primaryColor: data.primaryColor,
        contactEmail: data.contactEmail,
        settings: {
          emailSignature: data.emailSignature,
        },
      })
      .returning({ id: firm.id })

    firmId = newFirm[0]!.id

    // Link user to new firm and set as firm_admin
    await db
      .update(user)
      .set({
        firmId: firmId,
        role: "firm_admin",
      })
      .where(eq(user.id, session.user.id))
  }

  revalidatePath("/dashboard")
  revalidatePath("/dashboard/settings/white-label")
  
  return { success: true }
}
