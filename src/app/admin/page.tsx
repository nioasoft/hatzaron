import Link from "next/link"
import { desc, ne } from "drizzle-orm"
import { Building2, Users, TrendingUp, CreditCard } from "lucide-react"
import { StatCard } from "@/components/dashboard/stat-card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN } from "@/lib/constants/hebrew"
import { db } from "@/lib/db"
import { user } from "@/lib/schema"

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date)
}

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount)
}

export default async function AdminPage() {
  // Query firms (non-admin users)
  const firms = await db
    .select()
    .from(user)
    .where(ne(user.role, "admin"))
    .orderBy(desc(user.createdAt))

  const totalFirms = firms.length
  const recentFirms = firms.slice(0, 5)

  // Mock data for subscriptions/revenue (will be real when subscription system is added)
  const mockStats = {
    activeSubscriptions: 45,
    monthlyRevenue: 11205,
    trialUsers: 8,
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">{ADMIN.nav.dashboard}</h1>
        <p className="text-muted-foreground">{ADMIN.title}</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title={ADMIN.stats.totalFirms}
          value={totalFirms}
          icon={Building2}
        />
        <StatCard
          title={ADMIN.stats.activeSubscriptions}
          value={mockStats.activeSubscriptions}
          icon={Users}
        />
        <StatCard
          title={ADMIN.stats.monthlyRevenue}
          value={formatCurrency(mockStats.monthlyRevenue)}
          icon={TrendingUp}
        />
        <StatCard
          title={ADMIN.stats.trialUsers}
          value={mockStats.trialUsers}
          icon={CreditCard}
        />
      </div>

      {/* Recent Firms Table */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>משרדים אחרונים</CardTitle>
          <Button variant="ghost" size="sm" asChild>
            <Link href="/admin/firms">הצג הכל</Link>
          </Button>
        </CardHeader>
        <CardContent>
          {recentFirms.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              אין משרדים רשומים עדיין
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b text-sm text-muted-foreground">
                    <th className="pb-3 text-start font-medium">
                      {ADMIN.firms.tableHeaders.firm}
                    </th>
                    <th className="pb-3 text-start font-medium">
                      {ADMIN.firms.tableHeaders.email}
                    </th>
                    <th className="pb-3 text-start font-medium">
                      {ADMIN.firms.tableHeaders.status}
                    </th>
                    <th className="pb-3 text-start font-medium">
                      {ADMIN.firms.tableHeaders.registeredAt}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentFirms.map((firm) => (
                    <tr
                      key={firm.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="py-3">
                        <Link
                          href={`/admin/firms/${firm.id}`}
                          className="flex items-center gap-2 font-medium hover:underline"
                        >
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          {firm.name}
                        </Link>
                      </td>
                      <td className="py-3 text-muted-foreground" dir="ltr">
                        {firm.email}
                      </td>
                      <td className="py-3">
                        <Badge
                          variant="secondary"
                          className={
                            firm.banned
                              ? "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
                              : "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          }
                        >
                          {firm.banned
                            ? ADMIN.firms.status.suspended
                            : ADMIN.firms.status.active}
                        </Badge>
                      </td>
                      <td className="py-3 text-muted-foreground" dir="ltr">
                        {formatDate(firm.createdAt)}
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
