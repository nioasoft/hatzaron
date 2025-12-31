import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Plus } from "lucide-react"
import { ClientCard } from "@/components/clients/client-card"
import type { Client } from "@/components/clients/client-table"
import {
  DeclarationTable,
  type Declaration,
} from "@/components/declarations/declaration-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTIONS, DECLARATIONS } from "@/lib/constants/hebrew"

// Mock data - will be replaced with real data from database
const mockClients: Record<string, Client> = {
  "1": {
    id: "1",
    firstName: "יוסי",
    lastName: "כהן",
    idNumber: "012345678",
    phone: "0501234567",
    email: "yossi@email.com",
    address: "רחוב הרצל 12, תל אביב",
    notes: "לקוח ותיק, מעדיף תקשורת בטלפון",
    activeDeclarations: 2,
  },
  "2": {
    id: "2",
    firstName: "שרה",
    lastName: "לוי",
    idNumber: "023456789",
    phone: "0521234567",
    email: "sara@email.com",
    address: "רחוב בן גוריון 45, חיפה",
    activeDeclarations: 1,
  },
}

const mockDeclarations: Record<string, Declaration[]> = {
  "1": [
    {
      id: "1",
      clientName: "יוסי כהן",
      createdAt: "2024-12-15",
      deadline: "2025-04-15",
      status: "pending_documents",
      netWorth: 2500000,
    },
    {
      id: "2",
      clientName: "יוסי כהן",
      createdAt: "2024-11-10",
      deadline: "2025-03-10",
      status: "in_review",
      netWorth: 2450000,
    },
  ],
  "2": [
    {
      id: "3",
      clientName: "שרה לוי",
      createdAt: "2024-12-10",
      deadline: "2025-04-10",
      status: "in_review",
      netWorth: 1800000,
    },
  ],
}

interface ClientPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params
  const client = mockClients[id]

  if (!client) {
    notFound()
  }

  const declarations = mockDeclarations[id] || []

  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/clients">
            <ArrowRight className="h-4 w-4 me-2" />
            {ACTIONS.back}
          </Link>
        </Button>
      </div>

      {/* Client Card */}
      <ClientCard client={client} />

      {/* Client's Declarations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="flex items-center gap-2">
            <span>{DECLARATIONS.title}</span>
            <span className="text-sm font-normal text-muted-foreground">
              ({declarations.length})
            </span>
          </CardTitle>
          <Button size="sm" asChild>
            <Link href={`/dashboard/declarations/new?clientId=${id}`}>
              <Plus className="h-4 w-4 me-2" />
              {DECLARATIONS.newDeclaration}
            </Link>
          </Button>
        </CardHeader>
        <CardContent>
          {declarations.length > 0 ? (
            <DeclarationTable declarations={declarations} />
          ) : (
            <div className="py-8 text-center text-muted-foreground">
              אין הצהרות עדיין עבור לקוח זה
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
