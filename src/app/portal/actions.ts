"use server"

import { eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { declaration, firm, client, document } from "@/lib/schema"

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
      status: data.declaration.status || "draft",
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
