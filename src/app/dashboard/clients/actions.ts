"use server"

import { headers } from "next/headers"
import { eq, desc, and } from "drizzle-orm"
import { revalidatePath } from "next/cache"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { client, declaration } from "@/lib/schema"
import { ClientFormData } from "@/components/clients/client-form"
import { DeclarationWithClient } from "@/app/dashboard/declarations/actions"

// Types matching the UI component
export type Client = {
  id: string
  firstName: string
  lastName: string
  idNumber: string
  phone: string
  email: string
  address: string | null
  notes: string | null
  activeDeclarations: number
}

export async function getClients(): Promise<Client[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const firmId = (session.user as any).firmId
  if (!firmId) return []

  // Fetch clients for the firm
  const clientsData = await db.query.client.findMany({
    where: eq(client.firmId, firmId),
    orderBy: desc(client.createdAt),
    with: {
      // Assuming we might have relations later, but for now we count manually or join
    }
  })

  // To get active declarations count, we ideally join or aggregate.
  // For MVP, we'll do a separate query or basic mapping if performance allows.
  // Let's optimize by fetching counts.
  
  // Actually, drizzle doesn't support easy count aggregations in query builder yet without sql.
  // We'll iterate for now as N is small per firm.
  
  const clientsWithCounts = await Promise.all(
    clientsData.map(async (c) => {
      // Mock count or fetch real count if we had declarations
      // Let's check declarations table
      const declarations = await db.select().from(declaration).where(eq(declaration.clientId, c.id))
      const activeCount = declarations.filter(d => d.status !== 'completed').length

      return {
        id: c.id,
        firstName: c.firstName,
        lastName: c.lastName,
        idNumber: c.idNumber || "",
        phone: c.phone || "",
        email: c.email,
        address: c.address || null,
        notes: c.notes || null,
        activeDeclarations: activeCount,
      }
    })
  )

  return clientsWithCounts
}

export async function getClientDetails(clientId: string): Promise<{ client: Client, declarations: DeclarationWithClient[] } | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const firmId = (session.user as any).firmId
  if (!firmId) return null

  // Fetch client
  const clientData = await db.query.client.findFirst({
    where: and(eq(client.id, clientId), eq(client.firmId, firmId)),
  })

  if (!clientData) return null

  // Fetch declarations
  const declarationsData = await db
    .select()
    .from(declaration)
    .where(eq(declaration.clientId, clientId))
    .orderBy(desc(declaration.createdAt))

  // Map declarations
  const declarations: DeclarationWithClient[] = declarationsData.map(d => ({
    id: d.id,
    clientName: `${clientData.firstName} ${clientData.lastName}`,
    createdAt: d.createdAt,
    deadline: d.taxAuthorityDueDate ? new Date(d.taxAuthorityDueDate) : null,
    status: d.status || "draft",
    netWorth: 0, 
    priority: d.priority || "normal",
    assignedTo: d.assignedTo
  }))

  const activeDeclarations = declarations.filter(d => d.status !== 'completed').length

  const clientFormatted: Client = {
    id: clientData.id,
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    idNumber: clientData.idNumber || "",
    phone: clientData.phone || "",
    email: clientData.email,
    address: clientData.address || null,
    notes: clientData.notes || null,
    activeDeclarations,
  }

  return { client: clientFormatted, declarations }
}

export async function createClient(data: ClientFormData) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")

  const firmId = (session.user as any).firmId
  if (!firmId) throw new Error("No firm associated with user")

  await db.insert(client).values({
    firmId: firmId,
    firstName: data.firstName,
    lastName: data.lastName,
    idNumber: data.idNumber,
    phone: data.phone,
    email: data.email || "", // Schema says not null
    address: data.address,
    notes: data.notes,
    status: "active",
  })

  revalidatePath("/dashboard/clients")
  
  return { success: true }
}
