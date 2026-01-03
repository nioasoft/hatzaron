import { headers } from "next/headers"
import Link from "next/link"
import { Plus, FileText } from "lucide-react"

import {
  getDeclarationsWithFilters,
  getDeclarationStats,
  getFirmAccountants,
  type DeclarationFilters as FiltersType,
} from "@/app/dashboard/declarations/actions"
import { DeclarationFilters } from "@/components/declarations/declaration-filters"
import { DeclarationStatsCards } from "@/components/declarations/declaration-stats-cards"
import { DeclarationTable } from "@/components/declarations/declaration-table"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui/empty-state"
import { auth } from "@/lib/auth"
import { DECLARATIONS } from "@/lib/constants/hebrew"

export const dynamic = "force-dynamic"

interface PageProps {
  searchParams: Promise<{
    search?: string
    status?: string
    year?: string
    priority?: string
    assignedTo?: string
  }>
}

export default async function DeclarationsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams

  // Get session and check if user is admin
  const session = await auth.api.getSession({ headers: await headers() })
  const userRole = (session?.user as { role?: string })?.role
  const isAdmin = userRole === "firm_admin" || userRole === "super_admin"

  // Build filters from search params
  const filters: FiltersType = {}
  if (resolvedParams.search) filters.search = resolvedParams.search
  if (resolvedParams.status && resolvedParams.status !== "all") filters.status = resolvedParams.status
  if (resolvedParams.year && resolvedParams.year !== "all") filters.taxYear = parseInt(resolvedParams.year)
  if (resolvedParams.priority && resolvedParams.priority !== "all") filters.priority = resolvedParams.priority
  if (resolvedParams.assignedTo && resolvedParams.assignedTo !== "all") filters.assignedTo = resolvedParams.assignedTo

  // Fetch declarations, stats, and accountants in parallel
  const [declarations, stats, accountants] = await Promise.all([
    getDeclarationsWithFilters(filters),
    getDeclarationStats(),
    getFirmAccountants(),
  ])

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

      {/* Stats Cards */}
      <DeclarationStatsCards stats={stats} />

      {/* Filters */}
      <DeclarationFilters
        accountants={accountants}
        isAdmin={isAdmin}
      />

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
            <DeclarationTable
              declarations={declarations}
              accountants={accountants}
              isAdmin={isAdmin}
              enhanced={true}
            />
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
