"use server"

import { eq, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { declaration, firm, client, document, declarationStatusHistory } from "@/lib/schema"

export type PortalData = {
  declaration: {
    id: string
    year: number
    declarationDate: Date
    status: string
    publicToken: string
  }
  firm: {
    name: string
    logoUrl: string | null
    primaryColor: string
    contactEmail: string | null
    contactPhone: string | null
  }
  client: {
    firstName: string
    lastName: string
  }
  uploadedFiles: Record<string, boolean>
  isValid: boolean
}

export async function getPortalData(token: string): Promise<PortalData | null> {
  if (!token) return null

  const result = await db
    .select({
      declaration: declaration,
      firm: firm,
      client: client,
    })
    .from(declaration)
    .innerJoin(firm, eq(declaration.firmId, firm.id))
    .innerJoin(client, eq(declaration.clientId, client.id))
    .where(eq(declaration.publicToken, token))
    .limit(1)

  if (result.length === 0) return null

  const data = result[0]
  if (!data) return null

  // Check if this is first access and status is "sent" - transition to "in_progress"
  const currentStatus = data.declaration.status
  const isFirstAccess = !data.declaration.portalAccessedAt

  if (isFirstAccess && currentStatus === "sent") {
    // Update declaration with first access info and new status
    await db.update(declaration)
      .set({
        portalAccessedAt: new Date(),
        portalAccessCount: 1,
        status: "in_progress"
      })
      .where(eq(declaration.id, data.declaration.id))

    // Log the automatic transition to history
    await db.insert(declarationStatusHistory).values({
      declarationId: data.declaration.id,
      firmId: data.declaration.firmId,
      fromStatus: "sent",
      toStatus: "in_progress",
      notes: "הלקוח צפה בפורטל לראשונה",
      changedBy: null, // System/automatic change
    })
  } else if (!isFirstAccess) {
    // Increment access count for subsequent visits
    await db.update(declaration)
      .set({
        portalAccessCount: (data.declaration.portalAccessCount || 0) + 1
      })
      .where(eq(declaration.id, data.declaration.id))
  }

  // Fetch uploaded documents
  const docs = await db
    .select({ type: document.type })
    .from(document)
    .where(eq(document.declarationId, data.declaration.id))

  const uploadedFiles: Record<string, boolean> = {}
  docs.forEach((doc) => {
    if (doc.type) {
      uploadedFiles[doc.type] = true
    }
  })

  return {
    declaration: {
      id: data.declaration.id,
      year: data.declaration.year || new Date().getFullYear(),
      declarationDate: data.declaration.declarationDate || new Date(),
      // Return the potentially updated status
      status: isFirstAccess && currentStatus === "sent" ? "in_progress" : (currentStatus || "draft"),
      publicToken: data.declaration.publicToken!,
    },
    firm: {
      name: data.firm.name,
      logoUrl: data.firm.logoUrl,
      primaryColor: data.firm.primaryColor || "#2563eb",
      contactEmail: data.firm.contactEmail,
      contactPhone: data.firm.contactPhone,
    },
    client: {
      firstName: data.client.firstName,
      lastName: data.client.lastName,
    },
    uploadedFiles,
    isValid: true,
  }
}

export async function uploadDocument(declarationId: string, fileType: string, formData: FormData) {
  const file = formData.get("file") as File
  
  if (!file) {
    throw new Error("No file provided")
  }

  // Determine category based on fileType (this is a simplified mapping for MVP)
  // In a real app we'd look up the category from the fileType definition
  let category = "general"
  if (["bank_il", "bank_foreign", "investments"].includes(fileType)) category = "bank"
  if (["tabu", "purchase_contract"].includes(fileType)) category = "real_estate"
  if (["mortgage", "loans"].includes(fileType)) category = "liabilities"
  if (["vehicle", "other_assets"].includes(fileType)) category = "other"

  // Simulate file upload (would be Vercel Blob here)
  const fileUrl = `https://fake-storage.com/${file.name}`

  await db.insert(document).values({
    declarationId,
    type: fileType, // storing the specific wizard item ID as 'type'
    category,
    fileName: file.name,
    fileUrl,
    fileSize: file.size,
    status: "pending",
  })

  // Update declaration status if it was sent/viewed
  await db
    .update(declaration)
    .set({ status: "waiting_documents" })
    .where(eq(declaration.id, declarationId))

  revalidatePath("/portal/[token]")

  return { success: true }
}

/**
 * Mark documents as complete when client finishes the wizard.
 * Transitions status to "documents_received" and logs to history.
 */
export async function markDocumentsComplete(
  declarationId: string,
  publicToken: string
): Promise<{ success: boolean; error?: string }> {
  if (!declarationId || !publicToken) {
    return { success: false, error: "Missing required parameters" }
  }

  // Verify the token matches the declaration (security check)
  const result = await db
    .select({
      id: declaration.id,
      firmId: declaration.firmId,
      status: declaration.status,
      publicToken: declaration.publicToken,
    })
    .from(declaration)
    .where(
      and(
        eq(declaration.id, declarationId),
        eq(declaration.publicToken, publicToken)
      )
    )
    .limit(1)

  if (result.length === 0) {
    return { success: false, error: "Declaration not found" }
  }

  const decl = result[0]
  if (!decl) {
    return { success: false, error: "Declaration not found" }
  }

  const currentStatus = decl.status

  // Only transition if status makes sense (in_progress or waiting_documents)
  if (currentStatus !== "in_progress" && currentStatus !== "waiting_documents") {
    // Already in a later status, no need to transition
    return { success: true }
  }

  // Update status to documents_received
  await db.update(declaration)
    .set({ status: "documents_received" })
    .where(eq(declaration.id, declarationId))

  // Log the automatic transition to history
  await db.insert(declarationStatusHistory).values({
    declarationId: decl.id,
    firmId: decl.firmId,
    fromStatus: currentStatus,
    toStatus: "documents_received",
    notes: "הלקוח סיים להעלות מסמכים",
    changedBy: null, // System/automatic change from portal
  })

  revalidatePath("/portal/[token]")
  revalidatePath(`/dashboard/declarations/${declarationId}`)

  return { success: true }
}
