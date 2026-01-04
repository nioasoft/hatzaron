import { headers } from "next/headers"
import Link from "next/link"
import {
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Plus,
} from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { declaration, client } from "@/lib/schema"
import { eq, desc, sql } from "drizzle-orm"
import { DASHBOARD, DECLARATIONS } from "@/lib/constants/hebrew"
import { formatDate } from "@/lib/utils"

async function getDashboardStats(firmId: string) {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const nearDeadlineDate = new Date()
  nearDeadlineDate.setDate(nearDeadlineDate.getDate() + 14) // 14 days from now

  const [stats] = await db
    .select({
      total: sql<number>`count(*)::int`,
      active: sql<number>`count(*) filter (where ${declaration.status} not in ('submitted', 'completed', 'draft'))::int`,
      pending: sql<number>`count(*) filter (where ${declaration.status} in ('waiting_documents', 'documents_received'))::int`,
      completedMonth: sql<number>`count(*) filter (where ${declaration.status} = 'submitted' and ${declaration.updatedAt} >= ${startOfMonth})::int`,
      nearDeadline: sql<number>`count(*) filter (where ${declaration.taxAuthorityDueDate} <= ${nearDeadlineDate.toISOString().split('T')[0]} and ${declaration.taxAuthorityDueDate} >= ${now.toISOString().split('T')[0]} and ${declaration.status} not in ('submitted', 'completed'))::int`,
    })
    .from(declaration)
    .where(eq(declaration.firmId, firmId))

  return stats || { total: 0, active: 0, pending: 0, completedMonth: 0, nearDeadline: 0 }
}

async function getRecentDeclarations(firmId: string, limit = 5) {
  const results = await db
    .select({
      id: declaration.id,
      createdAt: declaration.createdAt,
      taxAuthorityDueDate: declaration.taxAuthorityDueDate,
      status: declaration.status,
      clientFirstName: client.firstName,
      clientLastName: client.lastName,
    })
    .from(declaration)
    .innerJoin(client, eq(declaration.clientId, client.id))
    .where(eq(declaration.firmId, firmId))
    .orderBy(desc(declaration.createdAt))
    .limit(limit)

  return results.map((r) => ({
    id: r.id,
    clientName: `${r.clientFirstName} ${r.clientLastName}`,
    createdAt: r.createdAt,
    deadline: r.taxAuthorityDueDate,
    status: r.status || "draft",
  }))
}

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  waiting_documents: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  reviewing: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  submitted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userName = session?.user?.name?.split(" ")[0] || "משתמש"
  const firmId = (session?.user as { firmId?: string })?.firmId

  // Get real data from database
  const stats = firmId
    ? await getDashboardStats(firmId)
    : { active: 0, pending: 0, completedMonth: 0, nearDeadline: 0 }
  const recentDeclarations = firmId ? await getRecentDeclarations(firmId) : []

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {DASHBOARD.welcome}, {userName}
          </h1>
          <p className="text-muted-foreground">
            {DASHBOARD.title} - סקירה כללית
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/declarations/new">
            <Plus className="h-4 w-4 me-2" />
            {DECLARATIONS.newDeclaration}
          </Link>
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 animate-stagger">
        <StatCard
          title={DASHBOARD.stats.active}
          value={stats.active}
          icon={FileText}
        />
        <StatCard
          title={DASHBOARD.stats.pending}
          value={stats.pending}
          icon={Clock}
        />
        <StatCard
          title={DASHBOARD.stats.completedMonth}
          value={stats.completedMonth}
          icon={CheckCircle}
        />
        <StatCard
          title={DASHBOARD.stats.nearDeadline}
          value={stats.nearDeadline}
          icon={AlertTriangle}
          className={stats.nearDeadline > 0 ? "border-orange-500/50" : ""}
        />
      </div>

      {/* Recent Declarations */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{DASHBOARD.recentDeclarations}</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/dashboard/declarations">{DASHBOARD.viewAll}</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentDeclarations.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>אין הצהרות עדיין</p>
              <Button asChild variant="link" className="mt-2">
                <Link href="/dashboard/declarations/new">
                  צור הצהרה ראשונה
                </Link>
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="pb-3 text-start font-medium">
                      {DECLARATIONS.tableHeaders.client}
                    </th>
                    <th className="pb-3 text-start font-medium">
                      {DECLARATIONS.tableHeaders.createdAt}
                    </th>
                    <th className="pb-3 text-start font-medium">
                      {DECLARATIONS.tableHeaders.deadline}
                    </th>
                    <th className="pb-3 text-start font-medium">
                      {DECLARATIONS.tableHeaders.status}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentDeclarations.map((decl) => (
                    <tr
                      key={decl.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3">
                        <Link
                          href={`/dashboard/declarations/${decl.id}`}
                          className="font-medium hover:underline"
                        >
                          {decl.clientName}
                        </Link>
                      </td>
                      <td className="py-3 text-muted-foreground" dir="ltr">
                        {formatDate(decl.createdAt)}
                      </td>
                      <td className="py-3 text-muted-foreground" dir="ltr">
                        {decl.deadline ? formatDate(decl.deadline) : "-"}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="secondary"
                          className={STATUS_COLORS[decl.status]}
                        >
                          {DECLARATIONS.status[decl.status as keyof typeof DECLARATIONS.status]}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
