import Link from "next/link"
import { notFound } from "next/navigation"
import { eq } from "drizzle-orm"
import { ArrowRight, Building2, Mail, Calendar, CreditCard } from "lucide-react"
import { BanUserButton } from "@/components/admin/ban-user-button"
import { FirmStatusBadge } from "@/components/admin/firms/firm-status-badge"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ADMIN } from "@/lib/constants/hebrew"
import { db } from "@/lib/db"
import { user } from "@/lib/schema"

interface PageProps {
  params: Promise<{ userId: string }>
}

const PLAN_COLORS = {
  basic: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  professional: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  enterprise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
} as const

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date)
}

// Mock function to get plan - will be replaced when subscription system is added
function getMockPlan(): keyof typeof PLAN_COLORS {
  return "professional"
}

// Mock function for next billing date
function getMockNextBilling(): string {
  const nextMonth = new Date()
  nextMonth.setMonth(nextMonth.getMonth() + 1)
  return formatDate(nextMonth)
}

export default async function FirmDetailPage({ params }: PageProps) {
  const { userId } = await params

  const firms = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      banned: user.banned,
      banReason: user.banReason,
      createdAt: user.createdAt,
    })
    .from(user)
    .where(eq(user.id, userId))
    .limit(1)

  const firm = firms[0]

  if (!firm) {
    notFound()
  }

  const plan = getMockPlan()

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <div>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/firms" className="flex items-center gap-2">
            <ArrowRight className="h-4 w-4" />
            {ADMIN.firms.detail.backToList}
          </Link>
        </Button>
      </div>

      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Building2 className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{firm.name}</h1>
            <p className="text-muted-foreground" dir="ltr">
              {firm.email}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <BanUserButton userId={firm.id} isBanned={firm.banned ?? false} />
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Firm Info Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {ADMIN.firms.detail.firmInfo}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground flex items-center gap-2">
                <Mail className="h-4 w-4" />
                {ADMIN.firms.tableHeaders.email}
              </span>
              <span dir="ltr">{firm.email}</span>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {ADMIN.firms.detail.registeredAt}
              </span>
              <span dir="ltr">{formatDate(firm.createdAt)}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">
                {ADMIN.firms.detail.status}
              </span>
              <FirmStatusBadge isBanned={firm.banned} />
            </div>
            {firm.banned && firm.banReason && (
              <div className="mt-4 p-3 bg-red-50 dark:bg-red-950 rounded-lg border border-red-200 dark:border-red-900">
                <p className="text-sm text-red-800 dark:text-red-200">
                  <strong>סיבת ההשעיה:</strong> {firm.banReason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Subscription Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {ADMIN.firms.detail.subscription}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">
                {ADMIN.firms.detail.plan}
              </span>
              <Badge variant="secondary" className={PLAN_COLORS[plan]}>
                {ADMIN.firms.plans[plan]}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2 border-b">
              <span className="text-muted-foreground">
                {ADMIN.firms.detail.status}
              </span>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {ADMIN.firms.status.active}
              </Badge>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-muted-foreground">
                {ADMIN.firms.detail.nextBilling}
              </span>
              <span dir="ltr">{getMockNextBilling()}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
