"use server"

import { headers } from "next/headers"
import { eq, desc } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { declaration, client, firm, document } from "@/lib/schema"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { sendDeclarationLink } from "@/lib/email"

export type DeclarationWithClient = {
  id: string
  clientName: string
  createdAt: Date
  deadline: Date | null
  status: string
  netWorth: number // We might need to calculate this from 'data' jsonb or keep it 0 for now
  priority: string
  assignedTo: string | null
}

export async function getDeclarations(): Promise<DeclarationWithClient[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const firmId = (session.user as any).firmId
  if (!firmId) return []

  const results = await db
    .select({
      id: declaration.id,
      createdAt: declaration.createdAt,
      status: declaration.status,
      taxAuthorityDueDate: declaration.taxAuthorityDueDate,
      priority: declaration.priority,
      assignedTo: declaration.assignedTo,
      firstName: client.firstName,
      lastName: client.lastName,
      data: declaration.data,
    })
    .from(declaration)
    .innerJoin(client, eq(declaration.clientId, client.id))
    .where(eq(declaration.firmId, firmId))
    .orderBy(desc(declaration.createdAt))

  return results.map((row) => ({
    id: row.id,
    clientName: `${row.firstName} ${row.lastName}`,
    createdAt: row.createdAt,
    deadline: row.taxAuthorityDueDate ? new Date(row.taxAuthorityDueDate) : null,
    status: row.status || "draft",
    netWorth: 0, // Placeholder, logic to calculate from 'data' would go here
    priority: row.priority || "normal",
    assignedTo: row.assignedTo
  }))
}

export interface CreateDeclarationData {
  clientId: string
  year: number
  declarationDate: Date
  taxAuthorityDueDate?: Date
  internalDueDate?: Date
  subject: string
  notes?: string
}

export async function createDeclaration(data: CreateDeclarationData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")

  const firmId = (session.user as any).firmId
  if (!firmId) throw new Error("No firm associated with user")

  // Generate public token
  const publicToken = randomBytes(24).toString("hex")

  const newDeclaration = await db
    .insert(declaration)
    .values({
      firmId: firmId,
      clientId: data.clientId,
      year: data.year,
      declarationDate: data.declarationDate,
      taxAuthorityDueDate: data.taxAuthorityDueDate ? data.taxAuthorityDueDate.toISOString() : null,
      internalDueDate: data.internalDueDate ? data.internalDueDate.toISOString() : null,
      subject: data.subject,
      notes: data.notes,
      publicToken: publicToken,
      status: "sent", // Assuming creating means we generated the link to send
      data: {}, // Empty initial data
    })
    .returning({ id: declaration.id })

  // Send Email
  try {
    const clientData = await db.query.client.findFirst({
      where: eq(client.id, data.clientId),
    })
    const firmData = await db.query.firm.findFirst({
      where: eq(firm.id, firmId),
    })

    if (clientData && firmData && clientData.email) {
      const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
      const portalLink = `${appUrl}/portal/${publicToken}`
      
      await sendDeclarationLink({
        to: clientData.email,
        clientName: `${clientData.firstName} ${clientData.lastName}`,
        firmName: firmData.name,
        ...(firmData.contactEmail ? { firmEmail: firmData.contactEmail } : {}),
        portalLink,
        year: data.year,
      })
    }
  } catch (error) {
    console.error("Failed to send declaration email:", error)
    // We don't fail the request if email fails, but we should log it or notify
  }

  revalidatePath("/dashboard/declarations")
  return { success: true, id: newDeclaration[0]!.id }
}

export type DeclarationDetails = {
  id: string
  client: {
    name: string
    idNumber: string
    phone: string
    email: string
  }
  year: number
  declarationDate: Date
  createdAt: Date
  deadline: Date | null
  status: string
  priority: string
  assignedTo: string | null
  publicToken: string | null
  documents: {
    id: string
    fileName: string
    category: string
    fileUrl: string
    createdAt: Date
  }[]
}

export async function getDeclarationDetails(id: string): Promise<DeclarationDetails | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const firmId = (session.user as any).firmId
  if (!firmId) return null

  // Fetch declaration with client
  const result = await db
    .select({
      declaration: declaration,
      client: client,
    })
    .from(declaration)
    .innerJoin(client, eq(declaration.clientId, client.id))
    .where(eq(declaration.id, id))
    .limit(1)

  if (result.length === 0) return null
  
  const data = result[0]
  if (!data) return null
  
  // Ensure firm ownership
  if (data.declaration.firmId !== firmId) return null

  // Fetch documents
  const docs = await db
    .select()
    .from(document) // This refers to the imported 'document' schema table, not the global document object
    .where(eq(document.declarationId, id))
    .orderBy(desc(document.createdAt))

  return {
    id: data.declaration.id,
    client: {
      name: `${data.client.firstName} ${data.client.lastName}`,
      idNumber: data.client.idNumber || "",
      phone: data.client.phone || "",
      email: data.client.email,
    },
    year: data.declaration.year || new Date().getFullYear(),
    declarationDate: data.declaration.declarationDate || new Date(),
    createdAt: data.declaration.createdAt,
    deadline: data.declaration.taxAuthorityDueDate ? new Date(data.declaration.taxAuthorityDueDate) : null,
    status: data.declaration.status || "draft",
    priority: data.declaration.priority || "normal",
    assignedTo: data.declaration.assignedTo,
    publicToken: data.declaration.publicToken,
    documents: docs.map(doc => ({
      id: doc.id,
      fileName: doc.fileName,
      category: doc.category,
      fileUrl: doc.fileUrl,
      createdAt: doc.createdAt
    }))
  }
}
