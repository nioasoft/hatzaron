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
import { DASHBOARD, DECLARATIONS } from "@/lib/constants/hebrew"
import { formatDate, formatCurrency } from "@/lib/utils"

// Mock data - will be replaced with real data from database
const mockStats = {
  active: 12,
  pending: 5,
  completedMonth: 8,
  nearDeadline: 3,
}

const mockRecentDeclarations = [
  {
    id: "1",
    clientName: "יוסי כהן",
    createdAt: "2024-12-15",
    deadline: "2025-04-15",
    status: "pending_documents" as const,
    netWorth: 2500000,
  },
  {
    id: "2",
    clientName: "שרה לוי",
    createdAt: "2024-12-10",
    deadline: "2025-04-10",
    status: "in_review" as const,
    netWorth: 1800000,
  },
  {
    id: "3",
    clientName: "דוד אברהמי",
    createdAt: "2024-12-05",
    deadline: "2025-04-05",
    status: "draft" as const,
    netWorth: 3200000,
  },
  {
    id: "4",
    clientName: "רחל מזרחי",
    createdAt: "2024-11-28",
    deadline: "2025-03-28",
    status: "submitted" as const,
    netWorth: 950000,
  },
]

const STATUS_COLORS: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  pending_documents: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  in_review: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  submitted: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
}

export default async function DashboardPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  const userName = session?.user?.name?.split(" ")[0] || "משתמש"

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
          value={mockStats.active}
          icon={FileText}
        />
        <StatCard
          title={DASHBOARD.stats.pending}
          value={mockStats.pending}
          icon={Clock}
        />
        <StatCard
          title={DASHBOARD.stats.completedMonth}
          value={mockStats.completedMonth}
          icon={CheckCircle}
        />
        <StatCard
          title={DASHBOARD.stats.nearDeadline}
          value={mockStats.nearDeadline}
          icon={AlertTriangle}
          className={mockStats.nearDeadline > 0 ? "border-orange-500/50" : ""}
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
                  <th className="pb-3 text-start font-medium">
                    {DECLARATIONS.tableHeaders.netWorth}
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockRecentDeclarations.map((declaration) => (
                  <tr
                    key={declaration.id}
                    className="border-b last:border-0 hover:bg-muted/50"
                  >
                    <td className="py-3">
                      <Link
                        href={`/dashboard/declarations/${declaration.id}`}
                        className="font-medium hover:underline"
                      >
                        {declaration.clientName}
                      </Link>
                    </td>
                    <td className="py-3 text-muted-foreground" dir="ltr">
                      {formatDate(declaration.createdAt)}
                    </td>
                    <td className="py-3 text-muted-foreground" dir="ltr">
                      {formatDate(declaration.deadline)}
                    </td>
                    <td className="py-3">
                      <Badge
                        variant="secondary"
                        className={STATUS_COLORS[declaration.status]}
                      >
                        {DECLARATIONS.status[declaration.status]}
                      </Badge>
                    </td>
                    <td className="py-3 font-medium" dir="ltr">
                      {formatCurrency(declaration.netWorth)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
