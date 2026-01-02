import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowRight, Plus } from "lucide-react"
import { ClientCard } from "@/components/clients/client-card"
import { DeclarationTable } from "@/components/declarations/declaration-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ACTIONS, DECLARATIONS } from "@/lib/constants/hebrew"
import { getClientDetails } from "@/app/dashboard/clients/actions"

interface ClientPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function ClientPage({ params }: ClientPageProps) {
  const { id } = await params
  const details = await getClientDetails(id)

  if (!details) {
    notFound()
  }

  const { client, declarations } = details

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