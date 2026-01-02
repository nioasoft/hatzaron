import Link from "next/link"
import { Plus, Search, Filter, FileText } from "lucide-react"
import { DeclarationTable } from "@/components/declarations/declaration-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { Input } from "@/components/ui/input"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"
import { getDeclarations } from "./actions"

export const dynamic = "force-dynamic"

export default async function DeclarationsPage() {
  const declarations = await getDeclarations()

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">{DECLARATIONS.title}</h1>
          <p className="text-muted-foreground">
            ניהול הצהרות הון של הלקוחות שלך
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/declarations/new">
            <Plus className="h-4 w-4 me-2" />
            {DECLARATIONS.newDeclaration}
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
            aria-label="חיפוש הצהרות"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 me-2" aria-hidden="true" />
          {ACTIONS.filter}
        </Button>
      </div>

      {/* Declarations Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>כל ההצהרות</span>
            <span className="text-sm font-normal text-muted-foreground">
              {declarations.length} הצהרות
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {declarations.length > 0 ? (
            <DeclarationTable declarations={declarations} />
          ) : (
            <EmptyState
              icon={FileText}
              title="אין הצהרות עדיין"
              description="צור את ההצהרה הראשונה שלך כדי להתחיל לנהל הצהרות הון עבור הלקוחות שלך."
              action={
                <Button asChild>
                  <Link href="/dashboard/declarations/new">
                    <Plus className="h-4 w-4 me-2" />
                    {DECLARATIONS.newDeclaration}
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