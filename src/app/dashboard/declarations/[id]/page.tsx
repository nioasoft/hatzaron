import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  Edit,
  FileText,
  Calendar,
  Clock,
  AlertCircle,
  ExternalLink,
  Phone,
  Mail,
} from "lucide-react"

import { getDeclarationDetails, getFirmAccountants } from "@/app/dashboard/declarations/actions"
import { DeclarationStatusBadge } from "@/components/declarations/declaration-status"
import { LogCommunicationDialog } from "@/components/declarations/log-communication-dialog"
import { OfficeStatusCard } from "@/components/declarations/office-status-card"
import { PortalLinkButton } from "@/components/declarations/portal-link-button"
import { SendReminderDialog } from "@/components/declarations/send-reminder-dialog"
import { StatusChangeDialog } from "@/components/declarations/status-change-dialog"
import { UnifiedTimeline } from "@/components/declarations/unified-timeline"
import { WhatsAppReminderButton } from "@/components/declarations/whatsapp-reminder-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"
import { getSession } from "@/lib/session"
import { formatDateLong } from "@/lib/utils"

interface DeclarationDetailPageParams {
  id: string
}

function PriorityIndicator({ priority }: { priority: string }) {
  if (priority === "critical") {
    return (
      <div className="flex items-center gap-2 text-destructive">
        <AlertCircle className="h-4 w-4" />
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

          {/* Office Status Card (NEW) */}
          <OfficeStatusCard
            declarationId={declaration.id}
            taxAuthorityDueDate={declaration.taxAuthorityDueDate}
            internalDueDate={declaration.internalDueDate}
            assignedTo={declaration.assignedTo}
            accountants={accountants}
            isAdmin={isAdmin}
            wasSubmittedLate={declaration.wasSubmittedLate}
            penaltyAmount={declaration.penaltyAmount}
            penaltyStatus={declaration.penaltyStatus}
          />

          {/* Unified Timeline (NEW) */}
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
