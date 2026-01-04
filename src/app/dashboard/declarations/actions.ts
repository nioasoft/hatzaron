"use server"

import { headers } from "next/headers"
import { eq, desc, and, or, sql, count } from "drizzle-orm"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { declaration, client, firm, document, user, declarationStatusHistory, declarationCommunication } from "@/lib/schema"
import { revalidatePath } from "next/cache"
import { randomBytes } from "crypto"
import { sendDeclarationLink, sendReminderEmail } from "@/lib/email"

// ============================================================
// Types
// ============================================================

export type DeclarationStatus =
  | "draft" | "sent" | "in_progress" | "waiting_documents"
  | "documents_received" | "reviewing" | "in_preparation"
  | "pending_approval" | "submitted" | "waiting" | "completed"

export type StatusHistoryEntry = {
  id: string
  fromStatus: string | null
  toStatus: string
  notes: string | null
  changedBy: { id: string; name: string } | null
  changedAt: Date
}

export type CommunicationType = "letter" | "phone_call" | "whatsapp" | "note"
export type CommunicationDirection = "outbound" | "inbound"

export type CommunicationEntry = {
  id: string
  type: CommunicationType
  direction: CommunicationDirection
  subject: string | null
  content: string | null
  outcome: string | null
  communicatedAt: Date
  createdBy: { id: string; name: string } | null
  createdAt: Date
}

export type DeclarationFilters = {
  search?: string
  status?: string
  taxYear?: number
  priority?: string
  assignedTo?: string
}

export type DeclarationStats = {
  total: number
  critical: number
  urgent: number
  waiting: number
  sent: number
  inProgress: number
  submitted: number
}

export type PenaltyDetails = {
  penaltyAmount: string | null
  penaltyStatus: string | null
  penaltyReceivedDate: string | null
  penaltyNotes: string | null
  appealDate: string | null
  appealNotes: string | null
  penaltyPaidDate: string | null
  penaltyPaidAmount: string | null
  penaltyPaidBy: string | null
  wasSubmittedLate: boolean
}

export type Accountant = {
  id: string
  name: string
}

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

  // Generate public token with 90-day expiration
  const publicToken = randomBytes(24).toString("hex")
  const tokenExpiresAt = new Date()
  tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 90)

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
      publicTokenExpiresAt: tokenExpiresAt,
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

  // Fetch declaration with client - include firmId in query for security
  const result = await db
    .select({
      declaration: declaration,
      client: client,
    })
    .from(declaration)
    .innerJoin(client, eq(declaration.clientId, client.id))
    .where(and(
      eq(declaration.id, id),
      eq(declaration.firmId, firmId) // Security: verify ownership in query
    ))
    .limit(1)

  if (result.length === 0) return null

  const data = result[0]
  if (!data) return null

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

// ============================================================
// Status Management Actions
// ============================================================

export async function updateDeclarationStatus(data: {
  declarationId: string
  newStatus: string
  notes?: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return { success: false, error: "No firm associated" }

  // Verify declaration belongs to firm
  const current = await db
    .select({
      status: declaration.status,
      firmId: declaration.firmId
    })
    .from(declaration)
    .where(eq(declaration.id, data.declarationId))
    .limit(1)

  const currentRow = current[0]
  if (!currentRow) return { success: false, error: "Declaration not found" }
  if (currentRow.firmId !== firmId) return { success: false, error: "Unauthorized" }

  // Insert history record
  await db.insert(declarationStatusHistory).values({
    declarationId: data.declarationId,
    firmId,
    fromStatus: currentRow.status,
    toStatus: data.newStatus,
    notes: data.notes || null,
    changedBy: session.user.id,
  })

  // Update declaration
  await db
    .update(declaration)
    .set({ status: data.newStatus })
    .where(eq(declaration.id, data.declarationId))

  revalidatePath(`/dashboard/declarations/${data.declarationId}`)
  revalidatePath("/dashboard/declarations")
  return { success: true }
}

export async function getDeclarationStatusHistory(
  declarationId: string
): Promise<StatusHistoryEntry[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return []

  // Verify declaration belongs to firm
  const decl = await db
    .select({ firmId: declaration.firmId })
    .from(declaration)
    .where(eq(declaration.id, declarationId))
    .limit(1)

  const declRow = decl[0]
  if (!declRow || declRow.firmId !== firmId) return []

  const history = await db
    .select({
      id: declarationStatusHistory.id,
      fromStatus: declarationStatusHistory.fromStatus,
      toStatus: declarationStatusHistory.toStatus,
      notes: declarationStatusHistory.notes,
      changedBy: declarationStatusHistory.changedBy,
      changedAt: declarationStatusHistory.changedAt,
      userName: user.name,
    })
    .from(declarationStatusHistory)
    .leftJoin(user, eq(declarationStatusHistory.changedBy, user.id))
    .where(eq(declarationStatusHistory.declarationId, declarationId))
    .orderBy(desc(declarationStatusHistory.changedAt))

  return history.map((h) => ({
    id: h.id,
    fromStatus: h.fromStatus,
    toStatus: h.toStatus,
    notes: h.notes,
    changedBy: h.changedBy && h.userName
      ? { id: h.changedBy, name: h.userName }
      : null,
    changedAt: h.changedAt,
  }))
}

// ============================================================
// Communication Actions
// ============================================================

export async function logCommunication(data: {
  declarationId: string
  type: CommunicationType
  direction: CommunicationDirection
  subject?: string
  content?: string
  outcome?: string
  communicatedAt?: Date
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return { success: false, error: "No firm associated" }

  // Verify declaration belongs to firm
  const declResult = await db
    .select({ firmId: declaration.firmId })
    .from(declaration)
    .where(eq(declaration.id, data.declarationId))
    .limit(1)

  const declData = declResult[0]
  if (!declData || declData.firmId !== firmId) {
    return { success: false, error: "Declaration not found or unauthorized" }
  }

  await db.insert(declarationCommunication).values({
    declarationId: data.declarationId,
    firmId,
    type: data.type,
    direction: data.direction,
    subject: data.subject || null,
    content: data.content || null,
    outcome: data.outcome || null,
    communicatedAt: data.communicatedAt || new Date(),
    createdBy: session.user.id,
  })

  revalidatePath(`/dashboard/declarations/${data.declarationId}`)
  return { success: true }
}

export async function getCommunications(
  declarationId: string
): Promise<CommunicationEntry[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return []

  // Verify declaration belongs to firm
  const declCheck = await db
    .select({ firmId: declaration.firmId })
    .from(declaration)
    .where(eq(declaration.id, declarationId))
    .limit(1)

  const declCheckRow = declCheck[0]
  if (!declCheckRow || declCheckRow.firmId !== firmId) return []

  const communications = await db
    .select({
      id: declarationCommunication.id,
      type: declarationCommunication.type,
      direction: declarationCommunication.direction,
      subject: declarationCommunication.subject,
      content: declarationCommunication.content,
      outcome: declarationCommunication.outcome,
      communicatedAt: declarationCommunication.communicatedAt,
      createdBy: declarationCommunication.createdBy,
      createdAt: declarationCommunication.createdAt,
      userName: user.name,
    })
    .from(declarationCommunication)
    .leftJoin(user, eq(declarationCommunication.createdBy, user.id))
    .where(eq(declarationCommunication.declarationId, declarationId))
    .orderBy(desc(declarationCommunication.communicatedAt))

  return communications.map((c) => ({
    id: c.id,
    type: c.type as CommunicationType,
    direction: c.direction as CommunicationDirection,
    subject: c.subject,
    content: c.content,
    outcome: c.outcome,
    communicatedAt: c.communicatedAt,
    createdBy: c.createdBy && c.userName
      ? { id: c.createdBy, name: c.userName }
      : null,
    createdAt: c.createdAt,
  }))
}

// ============================================================
// Penalty Management Actions
// ============================================================

export async function updatePenalty(data: {
  declarationId: string
  penaltyAmount?: string
  penaltyStatus?: string
  penaltyReceivedDate?: string
  penaltyNotes?: string
  appealDate?: string
  appealNotes?: string
  penaltyPaidDate?: string
  penaltyPaidAmount?: string
  penaltyPaidBy?: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return { success: false, error: "No firm associated" }

  // Verify declaration belongs to firm
  const penaltyDecl = await db
    .select({ firmId: declaration.firmId })
    .from(declaration)
    .where(eq(declaration.id, data.declarationId))
    .limit(1)

  const penaltyDeclRow = penaltyDecl[0]
  if (!penaltyDeclRow || penaltyDeclRow.firmId !== firmId) {
    return { success: false, error: "Declaration not found or unauthorized" }
  }

  await db
    .update(declaration)
    .set({
      penaltyAmount: data.penaltyAmount ?? undefined,
      penaltyStatus: data.penaltyStatus ?? undefined,
      penaltyReceivedDate: data.penaltyReceivedDate ?? undefined,
      penaltyNotes: data.penaltyNotes ?? undefined,
      appealDate: data.appealDate ?? undefined,
      appealNotes: data.appealNotes ?? undefined,
      penaltyPaidDate: data.penaltyPaidDate ?? undefined,
      penaltyPaidAmount: data.penaltyPaidAmount ?? undefined,
      penaltyPaidBy: data.penaltyPaidBy ?? undefined,
    })
    .where(eq(declaration.id, data.declarationId))

  revalidatePath(`/dashboard/declarations/${data.declarationId}`)
  return { success: true }
}

export async function getPenaltyDetails(
  declarationId: string
): Promise<PenaltyDetails | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return null

  const result = await db
    .select({
      firmId: declaration.firmId,
      penaltyAmount: declaration.penaltyAmount,
      penaltyStatus: declaration.penaltyStatus,
      penaltyReceivedDate: declaration.penaltyReceivedDate,
      penaltyNotes: declaration.penaltyNotes,
      appealDate: declaration.appealDate,
      appealNotes: declaration.appealNotes,
      penaltyPaidDate: declaration.penaltyPaidDate,
      penaltyPaidAmount: declaration.penaltyPaidAmount,
      penaltyPaidBy: declaration.penaltyPaidBy,
      wasSubmittedLate: declaration.wasSubmittedLate,
    })
    .from(declaration)
    .where(eq(declaration.id, declarationId))
    .limit(1)

  const penaltyRow = result[0]
  if (!penaltyRow || penaltyRow.firmId !== firmId) return null

  return {
    penaltyAmount: penaltyRow.penaltyAmount,
    penaltyStatus: penaltyRow.penaltyStatus,
    penaltyReceivedDate: penaltyRow.penaltyReceivedDate,
    penaltyNotes: penaltyRow.penaltyNotes,
    appealDate: penaltyRow.appealDate,
    appealNotes: penaltyRow.appealNotes,
    penaltyPaidDate: penaltyRow.penaltyPaidDate,
    penaltyPaidAmount: penaltyRow.penaltyPaidAmount,
    penaltyPaidBy: penaltyRow.penaltyPaidBy,
    wasSubmittedLate: penaltyRow.wasSubmittedLate ?? false,
  }
}

// ============================================================
// Dashboard Statistics Actions
// ============================================================

export async function getDeclarationStats(): Promise<DeclarationStats> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return { total: 0, critical: 0, urgent: 0, waiting: 0, sent: 0, inProgress: 0, submitted: 0 }
  }

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) {
    return { total: 0, critical: 0, urgent: 0, waiting: 0, sent: 0, inProgress: 0, submitted: 0 }
  }

  // Use SQL aggregates for better performance
  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      critical: sql<number>`count(*) filter (where ${declaration.priority} = 'critical')::int`,
      urgent: sql<number>`count(*) filter (where ${declaration.priority} = 'urgent')::int`,
      waiting: sql<number>`count(*) filter (where ${declaration.status} in ('waiting', 'waiting_documents'))::int`,
      sent: sql<number>`count(*) filter (where ${declaration.status} = 'sent')::int`,
      inProgress: sql<number>`count(*) filter (where ${declaration.status} in ('in_progress', 'documents_received', 'reviewing', 'in_preparation', 'pending_approval'))::int`,
      submitted: sql<number>`count(*) filter (where ${declaration.status} = 'submitted')::int`,
    })
    .from(declaration)
    .where(eq(declaration.firmId, firmId))

  return stats || { total: 0, critical: 0, urgent: 0, waiting: 0, sent: 0, inProgress: 0, submitted: 0 }
}

// ============================================================
// Assignment Actions
// ============================================================

export async function assignAccountant(data: {
  declarationId: string
  accountantId: string | null
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const firmId = (session.user as { firmId?: string }).firmId
  const role = (session.user as { role?: string }).role

  if (!firmId) return { success: false, error: "No firm associated" }

  // Only admins can assign accountants
  if (role !== "firm_admin" && role !== "super_admin") {
    return { success: false, error: "Only admins can assign accountants" }
  }

  // Verify declaration belongs to firm
  const assignDecl = await db
    .select({ firmId: declaration.firmId })
    .from(declaration)
    .where(eq(declaration.id, data.declarationId))
    .limit(1)

  const assignDeclRow = assignDecl[0]
  if (!assignDeclRow || assignDeclRow.firmId !== firmId) {
    return { success: false, error: "Declaration not found or unauthorized" }
  }

  // If assigning someone, verify they belong to the same firm
  if (data.accountantId) {
    const assignee = await db
      .select({ firmId: user.firmId })
      .from(user)
      .where(eq(user.id, data.accountantId))
      .limit(1)

    const assigneeRow = assignee[0]
    if (!assigneeRow || assigneeRow.firmId !== firmId) {
      return { success: false, error: "Accountant not found in this firm" }
    }
  }

  await db
    .update(declaration)
    .set({
      assignedTo: data.accountantId,
      assignedAt: data.accountantId ? new Date() : null,
    })
    .where(eq(declaration.id, data.declarationId))

  revalidatePath(`/dashboard/declarations/${data.declarationId}`)
  revalidatePath("/dashboard/declarations")
  return { success: true }
}

export async function getFirmAccountants(): Promise<Accountant[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return []

  const accountants = await db
    .select({
      id: user.id,
      name: user.name,
    })
    .from(user)
    .where(
      and(
        eq(user.firmId, firmId),
        or(
          eq(user.role, "firm_admin"),
          eq(user.role, "firm_employee")
        )
      )
    )
    .orderBy(user.name)

  return accountants
}

// ============================================================
// Email Reminder Actions
// ============================================================

export async function sendEmailReminder(data: {
  declarationId: string
  reminderType: "documents_request" | "status_update" | "general"
  customMessage?: string
}): Promise<{ success: boolean; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return { success: false, error: "No firm associated" }

  // Get declaration with client and firm details
  const result = await db
    .select({
      declaration: declaration,
      client: client,
      firm: firm,
    })
    .from(declaration)
    .innerJoin(client, eq(declaration.clientId, client.id))
    .innerJoin(firm, eq(declaration.firmId, firm.id))
    .where(eq(declaration.id, data.declarationId))
    .limit(1)

  const emailRow = result[0]
  if (!emailRow) return { success: false, error: "Declaration not found" }
  if (emailRow.declaration.firmId !== firmId) return { success: false, error: "Unauthorized" }

  const { declaration: decl, client: clientData, firm: firmData } = emailRow

  if (!clientData.email) return { success: false, error: "Client has no email address" }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const portalLink = decl.publicToken ? `${appUrl}/portal/${decl.publicToken}` : null

  try {
    await sendReminderEmail({
      to: clientData.email,
      clientName: `${clientData.firstName} ${clientData.lastName}`,
      firmName: firmData.name,
      firmEmail: firmData.contactEmail ?? undefined,
      portalLink: portalLink || "",
      year: decl.year || new Date().getFullYear(),
      reminderType: data.reminderType,
      customMessage: data.customMessage ?? undefined,
    })

    // Log the communication
    await db.insert(declarationCommunication).values({
      declarationId: data.declarationId,
      firmId,
      type: "letter",
      direction: "outbound",
      subject: getReminderSubject(data.reminderType),
      content: data.customMessage || getReminderContent(data.reminderType),
      outcome: "נשלח באימייל",
      communicatedAt: new Date(),
      createdBy: session.user.id,
    })

    revalidatePath(`/dashboard/declarations/${data.declarationId}`)
    return { success: true }
  } catch (error) {
    console.error("Failed to send reminder email:", error)
    return { success: false, error: "Failed to send email" }
  }
}

function getReminderSubject(type: string): string {
  switch (type) {
    case "documents_request":
      return "בקשה להעלאת מסמכים"
    case "status_update":
      return "עדכון סטטוס"
    default:
      return "הודעה כללית"
  }
}

function getReminderContent(type: string): string {
  switch (type) {
    case "documents_request":
      return "תזכורת להעלאת מסמכים חסרים לצורך הגשת הצהרת ההון"
    case "status_update":
      return "עדכון לגבי סטטוס הצהרת ההון שלך"
    default:
      return "הודעה לגבי הצהרת ההון שלך"
  }
}

// ============================================================
// Enhanced getDeclarations with Filters
// ============================================================

export type EnhancedDeclaration = DeclarationWithClient & {
  clientEmail: string
  clientPhone: string | null
  taxYear: number | null
  taxAuthorityDueDate: Date | null
  internalDueDate: Date | null
  wasSubmittedLate: boolean
  penaltyStatus: string | null
  assignedToName: string | null
  documentCount: number
}

// ============================================================
// Client Search and Declaration Creation Actions
// ============================================================

export type ClientSearchResult = {
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

export async function findClientByIdNumber(idNumber: string): Promise<ClientSearchResult | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return null

  const clientData = await db.query.client.findFirst({
    where: and(eq(client.idNumber, idNumber), eq(client.firmId, firmId)),
  })

  if (!clientData) return null

  return {
    id: clientData.id,
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    idNumber: clientData.idNumber || "",
    phone: clientData.phone || "",
    email: clientData.email,
    address: clientData.address || null,
    notes: clientData.notes || null,
    activeDeclarations: 0,
  }
}

export interface CreateDeclarationWithClientData {
  // Client fields
  firstName: string
  lastName: string
  idNumber: string
  phone: string
  email: string
  address?: string
  notes?: string

  // Declaration fields
  year: number
  declarationDate: Date
  taxAuthorityDueDate?: Date
  internalDueDate?: Date
  subject: string
  declarationNotes?: string
}

export async function createDeclarationWithClient(
  data: CreateDeclarationWithClientData
): Promise<{ success: boolean; id?: string; error?: string }> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return { success: false, error: "No firm associated with user" }

  try {
    // Check if client exists by idNumber + firmId
    let clientId: string
    const existingClient = await db.query.client.findFirst({
      where: and(eq(client.idNumber, data.idNumber), eq(client.firmId, firmId)),
    })

    if (existingClient) {
      // Update existing client with new data
      await db
        .update(client)
        .set({
          firstName: data.firstName,
          lastName: data.lastName,
          phone: data.phone,
          email: data.email,
          address: data.address || null,
          notes: data.notes || null,
        })
        .where(eq(client.id, existingClient.id))
      clientId = existingClient.id
    } else {
      // Create new client
      const newClient = await db
        .insert(client)
        .values({
          firmId: firmId,
          firstName: data.firstName,
          lastName: data.lastName,
          idNumber: data.idNumber,
          phone: data.phone,
          email: data.email,
          address: data.address || null,
          notes: data.notes || null,
          status: "active",
        })
        .returning({ id: client.id })

      clientId = newClient[0]!.id
    }

    // Generate public token with 90-day expiration
    const publicToken = randomBytes(24).toString("hex")
    const tokenExpiresAt = new Date()
    tokenExpiresAt.setDate(tokenExpiresAt.getDate() + 90)

    // Create declaration
    const newDeclaration = await db
      .insert(declaration)
      .values({
        firmId: firmId,
        clientId: clientId,
        year: data.year,
        declarationDate: data.declarationDate,
        taxAuthorityDueDate: data.taxAuthorityDueDate ? data.taxAuthorityDueDate.toISOString() : null,
        internalDueDate: data.internalDueDate ? data.internalDueDate.toISOString() : null,
        subject: data.subject,
        notes: data.declarationNotes || null,
        publicToken: publicToken,
        publicTokenExpiresAt: tokenExpiresAt,
        status: "sent",
        data: {},
      })
      .returning({ id: declaration.id })

    // Send Email
    try {
      const firmData = await db.query.firm.findFirst({
        where: eq(firm.id, firmId),
      })

      if (firmData && data.email) {
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
        const portalLink = `${appUrl}/portal/${publicToken}`

        await sendDeclarationLink({
          to: data.email,
          clientName: `${data.firstName} ${data.lastName}`,
          firmName: firmData.name,
          ...(firmData.contactEmail ? { firmEmail: firmData.contactEmail } : {}),
          portalLink,
          year: data.year,
        })
      }
    } catch (emailError) {
      console.error("Failed to send declaration email:", emailError)
      // Don't fail the request if email fails
    }

    revalidatePath("/dashboard/declarations")
    return { success: true, id: newDeclaration[0]!.id }
  } catch (error) {
    console.error("Failed to create declaration with client:", error)
    return { success: false, error: "Failed to create declaration" }
  }
}

// ============================================================
// Enhanced getDeclarations with Filters
// ============================================================

export async function getDeclarationsWithFilters(
  filters?: DeclarationFilters
): Promise<EnhancedDeclaration[]> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return []

  const firmId = (session.user as { firmId?: string }).firmId
  if (!firmId) return []

  // Build where conditions
  const conditions = [eq(declaration.firmId, firmId)]

  if (filters?.status) {
    conditions.push(eq(declaration.status, filters.status))
  }

  if (filters?.taxYear) {
    conditions.push(eq(declaration.year, filters.taxYear))
  }

  if (filters?.priority) {
    conditions.push(eq(declaration.priority, filters.priority))
  }

  if (filters?.assignedTo) {
    conditions.push(eq(declaration.assignedTo, filters.assignedTo))
  }

  // Apply search filter in SQL for better performance
  if (filters?.search) {
    const searchPattern = `%${filters.search.toLowerCase()}%`
    conditions.push(
      or(
        sql`lower(${client.firstName} || ' ' || ${client.lastName}) like ${searchPattern}`,
        sql`lower(${client.email}) like ${searchPattern}`
      )!
    )
  }

  // Subquery for document counts (filtered by firmId to avoid scanning entire table)
  const docCountSubquery = db
    .select({
      declarationId: document.declarationId,
      docCount: count().as('doc_count'),
    })
    .from(document)
    .where(eq(document.firmId, firmId))
    .groupBy(document.declarationId)
    .as('doc_counts')

  // Build main query with document counts joined
  const results = await db
    .select({
      id: declaration.id,
      createdAt: declaration.createdAt,
      status: declaration.status,
      taxAuthorityDueDate: declaration.taxAuthorityDueDate,
      internalDueDate: declaration.internalDueDate,
      priority: declaration.priority,
      assignedTo: declaration.assignedTo,
      year: declaration.year,
      wasSubmittedLate: declaration.wasSubmittedLate,
      penaltyStatus: declaration.penaltyStatus,
      firstName: client.firstName,
      lastName: client.lastName,
      clientEmail: client.email,
      clientPhone: client.phone,
      assignedToName: user.name,
      documentCount: sql<number>`coalesce(${docCountSubquery.docCount}, 0)::int`,
    })
    .from(declaration)
    .innerJoin(client, eq(declaration.clientId, client.id))
    .leftJoin(user, eq(declaration.assignedTo, user.id))
    .leftJoin(docCountSubquery, eq(declaration.id, docCountSubquery.declarationId))
    .where(and(...conditions))
    .orderBy(desc(declaration.createdAt))

  return results.map((row) => ({
    id: row.id,
    clientName: `${row.firstName} ${row.lastName}`,
    clientEmail: row.clientEmail,
    clientPhone: row.clientPhone,
    createdAt: row.createdAt,
    deadline: row.taxAuthorityDueDate ? new Date(row.taxAuthorityDueDate) : null,
    taxAuthorityDueDate: row.taxAuthorityDueDate ? new Date(row.taxAuthorityDueDate) : null,
    internalDueDate: row.internalDueDate ? new Date(row.internalDueDate) : null,
    status: row.status || "draft",
    netWorth: 0,
    priority: row.priority || "normal",
    assignedTo: row.assignedTo,
    assignedToName: row.assignedToName,
    taxYear: row.year,
    wasSubmittedLate: row.wasSubmittedLate ?? false,
    penaltyStatus: row.penaltyStatus,
    documentCount: row.documentCount || 0,
  }))
}
