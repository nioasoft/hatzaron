import { differenceInDays } from "date-fns"
import Link from "next/link"
import { notFound } from "next/navigation"
import {
  AlertTriangle,
  ArrowRight,
  Calendar,
  Clock,
  Edit,
  ExternalLink,
  FileText,
  Mail,
  Phone,
  UserCheck,
} from "lucide-react"
import { getDeclarationDetails, getFirmAccountants } from "@/app/dashboard/declarations/actions"
import { AssignAccountantSelect } from "@/components/declarations/assign-accountant-select"
import { DeclarationStatusBadge } from "@/components/declarations/declaration-status"
import { LogCommunicationDialog } from "@/components/declarations/log-communication-dialog"
import { PortalLinkButton } from "@/components/declarations/portal-link-button"
import { SendReminderDialog } from "@/components/declarations/send-reminder-dialog"
import { StatusChangeDialog } from "@/components/declarations/status-change-dialog"
import { UnifiedTimeline } from "@/components/declarations/unified-timeline"
import { WhatsAppReminderButton } from "@/components/declarations/whatsapp-reminder-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DECLARATIONS, ACTIONS, PENALTY } from "@/lib/constants/hebrew"
import { getSession } from "@/lib/session"
import { cn, formatDateLong } from "@/lib/utils"

interface DeclarationDetailPageParams {
  id: string
}

function PriorityIndicator({ priority }: { priority: string }) {
  if (priority === "critical") {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertTriangle className="h-4 w-4" />
        <span className="font-medium">קריטי</span>
      </div>
    )
  }
  if (priority === "urgent") {
    return (
      <div className="flex items-center gap-2 text-orange-600 dark:text-orange-400">
        <Clock className="h-4 w-4" />
        <span className="font-medium">דחוף</span>
      </div>
    )
  }
  return <span className="text-muted-foreground">רגיל</span>
}

function getDaysRemaining(deadline: Date | string | null) {
  if (!deadline) return null
  const deadlineDate = typeof deadline === "string" ? new Date(deadline) : deadline
  const days = differenceInDays(deadlineDate, new Date())
  return {
    days,
    isOverdue: days < 0,
    isUrgent: days <= 7 && days >= 0,
    label: days < 0 ? `איחור של ${Math.abs(days)} ימים` : days === 0 ? "היום" : `עוד ${days} ימים`,
  }
}

function DeadlineDisplay({ label, date }: { label: string; date: Date | string | null }) {
  const daysInfo = getDaysRemaining(date)
  return (
    <div className="rounded-lg border bg-background/50 p-3">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        <Calendar className="h-3.5 w-3.5" />
        {label}
      </div>
      {date ? (
        <>
          <div className="font-medium text-sm" dir="ltr">{formatDateLong(date)}</div>
          {daysInfo && (
            <div className={cn(
              "flex items-center gap-1 text-xs mt-1",
              daysInfo.isOverdue && "text-destructive",
              daysInfo.isUrgent && !daysInfo.isOverdue && "text-orange-600 dark:text-orange-400",
              !daysInfo.isOverdue && !daysInfo.isUrgent && "text-green-600 dark:text-green-400"
            )}>
              <Clock className={cn("h-3 w-3", daysInfo.isOverdue && "animate-pulse")} />
              {daysInfo.label}
            </div>
          )}
        </>
      ) : (
        <div className="text-muted-foreground text-sm">לא הוגדר</div>
      )}
    </div>
  )
}

export default async function DeclarationDetailPage({
  params,
}: {
  params: Promise<DeclarationDetailPageParams>
}) {
  const { id } = await params

  const session = await getSession()
  const userRole = (session?.user as { role?: string })?.role
  const isAdmin = userRole === "firm_admin" || userRole === "super_admin"

  const [declaration, accountants] = await Promise.all([
    getDeclarationDetails(id),
    getFirmAccountants(),
  ])

  if (!declaration) {
    notFound()
  }

  const sortedDocuments = [...declaration.documents].sort((a, b) =>
    a.category.localeCompare(b.category)
  )

  const documentsByCategory: Record<string, typeof declaration.documents> = {}
  sortedDocuments.forEach((doc) => {
    if (!documentsByCategory[doc.category]) {
      documentsByCategory[doc.category] = []
    }
    documentsByCategory[doc.category]!.push(doc)
  })

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const portalUrl = declaration.publicToken
    ? `${appUrl}/portal/${declaration.publicToken}`
    : null
  const documentCount = declaration.documents.length
  const categoryCount = Object.keys(documentsByCategory).length

  return (
    <div className="space-y-6">
      {/* Breadcrumb & Actions Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2 text-sm">
          <Button variant="ghost" size="sm" asChild className="gap-2">
            <Link href="/dashboard/declarations">
              <ArrowRight className="h-4 w-4" />
              {DECLARATIONS.title}
            </Link>
          </Button>
          <span className="text-muted-foreground">/</span>
          <span className="text-muted-foreground truncate max-w-[200px]">
            {declaration.client.name}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/dashboard/declarations/${declaration.id}/edit`}>
              <Edit className="h-4 w-4 me-2" />
              {ACTIONS.edit}
            </Link>
          </Button>
          <LogCommunicationDialog declarationId={declaration.id} />
        </div>
      </div>

      {/* Main Header Card */}
      <Card className="overflow-hidden">
        <div className="bg-gradient-to-l from-primary/5 to-transparent p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-3 flex-1">
              {/* Client name and status */}
              <div className="flex items-center gap-3 flex-wrap">
                <h1 className="text-2xl font-bold">{declaration.client.name}</h1>
                <StatusChangeDialog
                  declarationId={declaration.id}
                  currentStatus={declaration.status}
                >
                  <button
                    type="button"
                    className="cursor-pointer transition-transform hover:scale-105"
                  >
                    <DeclarationStatusBadge status={declaration.status as any} />
                  </button>
                </StatusChangeDialog>
              </div>

              {/* Meta info row */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>הצהרת הון {declaration.year}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div className="flex items-center gap-1.5">
                  <FileText className="h-4 w-4" />
                  <span>{documentCount} מסמכים</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <PriorityIndicator priority={declaration.priority} />
              </div>

              {/* Contact info */}
              <div className="flex flex-wrap items-center gap-4 text-sm">
                {declaration.client.phone && (
                  <a
                    href={`tel:${declaration.client.phone}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    dir="ltr"
                  >
                    <Phone className="h-4 w-4" />
                    {declaration.client.phone}
                  </a>
                )}
                {declaration.client.email && (
                  <a
                    href={`mailto:${declaration.client.email}`}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors"
                    dir="ltr"
                  >
                    <Mail className="h-4 w-4" />
                    {declaration.client.email}
                  </a>
                )}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
              <WhatsAppReminderButton
                declarationId={declaration.id}
                clientPhone={declaration.client.phone}
                clientName={declaration.client.name}
                year={declaration.year}
                publicToken={declaration.publicToken}
              />
              <SendReminderDialog
                declarationId={declaration.id}
                clientName={declaration.client.name}
                clientEmail={declaration.client.email}
                year={declaration.year}
                portalUrl={portalUrl}
              />
            </div>
          </div>
        </div>

        {/* Office Status Section - Always visible */}
        <div className="border-t bg-muted/30 p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {/* Deadlines */}
            <DeadlineDisplay label="דדליין רשות המסים" date={declaration.taxAuthorityDueDate} />
            <DeadlineDisplay label="דדליין פנימי" date={declaration.internalDueDate} />

            {/* Assigned Accountant */}
            <div className="rounded-lg border bg-background/50 p-3">
              <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                <UserCheck className="h-3.5 w-3.5" />
                רו״ח אחראי
              </div>
              <AssignAccountantSelect
                declarationId={declaration.id}
                currentAssignee={declaration.assignedTo}
                accountants={accountants}
                isAdmin={isAdmin}
              />
            </div>

            {/* Penalty Alert */}
            {(declaration.wasSubmittedLate || declaration.penaltyAmount || declaration.penaltyStatus) ? (
              <div className="rounded-lg border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/20 p-3">
                <div className="flex items-center gap-2 text-destructive mb-2">
                  <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
                  <span className="text-xs font-medium">{PENALTY.title}</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {declaration.wasSubmittedLate && (
                    <Badge variant="destructive" className="text-xs">
                      {PENALTY.lateSubmission.indicator}
                    </Badge>
                  )}
                  {declaration.penaltyAmount && (
                    <Badge variant="outline" className="text-xs border-red-200 dark:border-red-800">
                      ₪{Number(declaration.penaltyAmount).toLocaleString()}
                    </Badge>
                  )}
                  {declaration.penaltyStatus && (
                    <Badge variant="secondary" className="text-xs">
                      {PENALTY.status[declaration.penaltyStatus as keyof typeof PENALTY.status] || declaration.penaltyStatus}
                    </Badge>
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border bg-background/50 p-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                  <AlertTriangle className="h-3.5 w-3.5" />
                  קנסות
                </div>
                <div className="text-sm text-green-600 dark:text-green-400">ללא קנסות</div>
              </div>
            )}
          </div>
        </div>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content - 2/3 */}
        <div className="space-y-6 lg:col-span-2">
          {/* Documents Card */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  מסמכים
                </CardTitle>
                {documentCount > 0 && (
                  <Badge variant="secondary">
                    {documentCount} מסמכים ב-{categoryCount} קטגוריות
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {Object.keys(documentsByCategory).length > 0 ? (
                <div className="space-y-6">
                  {Object.entries(documentsByCategory).map(([categoryKey, docs]) => {
                    const categoryLabel =
                      DECLARATIONS.categories?.[
                        categoryKey as keyof typeof DECLARATIONS.categories
                      ] || categoryKey
                    return (
                      <div key={categoryKey} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground">
                            {categoryLabel}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {docs.length}
                          </Badge>
                        </div>
                        <div className="rounded-lg border bg-muted/30">
                          {docs.map((doc, idx) => (
                            <div
                              key={doc.id}
                              className={`flex items-center justify-between p-3 gap-3 ${
                                idx !== docs.length - 1 ? "border-b" : ""
                              }`}
                            >
                              <div className="flex items-center gap-3 min-w-0 flex-1">
                                <div className="h-8 w-8 rounded bg-primary/10 flex items-center justify-center shrink-0">
                                  <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <p className="font-medium text-sm truncate">
                                    {doc.fileName}
                                  </p>
                                  <p className="text-xs text-muted-foreground">
                                    {formatDateLong(doc.createdAt)}
                                  </p>
                                </div>
                              </div>
                              <Button variant="ghost" size="sm" asChild className="shrink-0">
                                <Link
                                  href={doc.fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Link>
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  <div className="mx-auto h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-3">
                    <FileText className="h-6 w-6" />
                  </div>
                  <p className="font-medium">אין מסמכים</p>
                  <p className="text-sm mt-1">עדיין לא הועלו מסמכים להצהרה זו</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Unified Timeline */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">היסטוריה</CardTitle>
            </CardHeader>
            <CardContent>
              <UnifiedTimeline declarationId={declaration.id} />
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - 1/3 (Simplified) */}
        <div className="space-y-6">
          {/* Portal Link */}
          {declaration.publicToken && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">פורטל לקוח</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border bg-gradient-to-l from-primary/5 to-transparent p-3">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-sm">
                      <ExternalLink className="h-4 w-4 text-primary" />
                      <span className="font-medium">קישור לפורטל</span>
                    </div>
                    <PortalLinkButton token={declaration.publicToken} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Client ID */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">פרטי לקוח</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">ת.ז.</span>
                <span className="font-medium" dir="ltr">
                  {declaration.client.idNumber || "-"}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
