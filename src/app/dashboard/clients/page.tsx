import Link from "next/link"
import { Plus, Search, Filter, Users } from "lucide-react"
import { ClientTable } from "@/components/clients/client-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { CLIENTS, ACTIONS } from "@/lib/constants/hebrew"
import { getClients } from "@/app/dashboard/clients/actions"

export const dynamic = "force-dynamic"

export default async function ClientsPage() {
  const clients = await getClients()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{CLIENTS.title}</h1>
          <p className="text-muted-foreground">ניהול הלקוחות שלך</p>
        </div>
        <Button asChild>
          <Link href="/dashboard/clients/new">
            <Plus className="h-4 w-4 me-2" />
            {CLIENTS.addClient}
          </Link>
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-4 sm:flex-row" role="search">
        <div className="relative flex-1">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
          <Input
            placeholder={`${ACTIONS.search}...`}
            className="ps-9"
            aria-label="חיפוש לקוחות"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 me-2" aria-hidden="true" />
          {ACTIONS.filter}
        </Button>
      </div>

      {/* Clients Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>כל הלקוחות</span>
            <span className="text-sm font-normal text-muted-foreground">
              {clients.length} לקוחות
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length > 0 ? (
            <ClientTable clients={clients} />
          ) : (
            <EmptyState
              icon={Users}
              title="אין לקוחות עדיין"
              description="הוסף את הלקוח הראשון שלך כדי להתחיל לנהל הצהרות הון."
              action={
                <Button asChild>
                  <Link href="/dashboard/clients/new">
                    <Plus className="h-4 w-4 me-2" />
                    {CLIENTS.addClient}
                  </Link>
                </Button>
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}