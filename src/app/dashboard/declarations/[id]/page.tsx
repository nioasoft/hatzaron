import Link from "next/link"
import { notFound } from "next/navigation"
import {
  ArrowRight,
  Edit,
  FileText,
  Users,
  Clock,
  AlertCircle,
} from "lucide-react"

import { getDeclarationDetails, getFirmAccountants } from "@/app/dashboard/declarations/actions"
import { AssignAccountantSelect } from "@/components/declarations/assign-accountant-select"
import { CommunicationHistoryCard } from "@/components/declarations/communication-history-card"
import { DeclarationStatusBadge } from "@/components/declarations/declaration-status"
import { LogCommunicationDialog } from "@/components/declarations/log-communication-dialog"
import { PenaltyManagementCard } from "@/components/declarations/penalty-management-card"
import { PortalLinkButton } from "@/components/declarations/portal-link-button"
import { SendReminderDialog } from "@/components/declarations/send-reminder-dialog"
import { StatusChangeDialog } from "@/components/declarations/status-change-dialog"
import { StatusHistoryTimeline } from "@/components/declarations/status-history-timeline"
import { WhatsAppReminderButton } from "@/components/declarations/whatsapp-reminder-button"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getSession } from "@/lib/session"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"
import { formatDateLong } from "@/lib/utils"

interface DeclarationDetailPageParams {
  id: string
}

function PriorityBadge({ priority }: { priority: string }) {
  if (priority === 'critical') {
    return <Badge variant="destructive" className="flex w-fit items-center gap-1"><AlertCircle className="h-3 w-3" /> קריטי</Badge>
  }
  if (priority === 'urgent') {
    return <Badge variant="outline" className="flex w-fit items-center gap-1 border-orange-500 text-orange-500"><Clock className="h-3 w-3" /> דחוף</Badge>
  }
  return <span className="text-muted-foreground text-sm">רגיל</span>
}



export default async function DeclarationDetailPage({
  params,
}: {
  params: Promise<DeclarationDetailPageParams>
}) {
  const { id } = await params

  // Get session and check if user is admin (uses cached session)
  const session = await getSession()
  const userRole = (session?.user as { role?: string })?.role
  const isAdmin = userRole === "firm_admin" || userRole === "super_admin"

  // Fetch declaration and accountants in parallel
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

  // Group documents by category for display
  const documentsByCategory: Record<string, typeof declaration.documents> = {}
  sortedDocuments.forEach(doc => {
    if (!documentsByCategory[doc.category]) {
      documentsByCategory[doc.category] = []
    }
    documentsByCategory[doc.category]!.push(doc)
  })

  // Generate portal URL for reminder dialog
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  const portalUrl = declaration.publicToken ? `${appUrl}/portal/${declaration.publicToken}` : null

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/dashboard/declarations">
              <ArrowRight className="h-4 w-4" />
              <span className="sr-only">{ACTIONS.back}</span>
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">{declaration.client.name}</h1>
              {/* Status badge wrapped in StatusChangeDialog */}
              <StatusChangeDialog
                declarationId={declaration.id}
                currentStatus={declaration.status}
              >
                <button type="button" className="cursor-pointer">
                  <DeclarationStatusBadge status={declaration.status as any} />
                </button>
              </StatusChangeDialog>
            </div>
            <p className="text-muted-foreground">
              הצהרת הון {declaration.year} - נוצרה ב-{formatDateLong(declaration.createdAt)}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild>
            <Link href={`/dashboard/declarations/${declaration.id}/edit`}>
              <Edit className="h-4 w-4 me-2" />
              {ACTIONS.edit}
            </Link>
          </Button>
          {/* Log Communication Dialog */}
          <LogCommunicationDialog declarationId={declaration.id} />
          {/* WhatsApp Reminder Button */}
          <WhatsAppReminderButton
            declarationId={declaration.id}
            clientPhone={declaration.client.phone}
            clientName={declaration.client.name}
            year={declaration.year}
            publicToken={declaration.publicToken}
          />
          {/* Send Email Reminder Dialog */}
          <SendReminderDialog
            declarationId={declaration.id}
            clientName={declaration.client.name}
            clientEmail={declaration.client.email}
            year={declaration.year}
            portalUrl={portalUrl}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          {/* Client Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                פרטי לקוח
              </CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">שם מלא</p>
                <p className="font-medium">{declaration.client.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">תעודת זהות</p>
                <p className="font-medium" dir="ltr">
                  {declaration.client.idNumber || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">טלפון</p>
                <p className="font-medium" dir="ltr">
                  {declaration.client.phone || "-"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">אימייל</p>
                <p className="font-medium" dir="ltr">
                  {declaration.client.email || "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Documents List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                מסמכים שהועלו
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(documentsByCategory).length > 0 ? (
                <div className="space-y-4">
                  {Object.entries(documentsByCategory).map(([categoryKey, docs]) => {
                    const categoryLabel = DECLARATIONS.categories?.[categoryKey as keyof typeof DECLARATIONS.categories] || categoryKey
                    return (
                      <div key={categoryKey}>
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                          <FileText className="h-4 w-4" />
                          {categoryLabel}
                        </div>
                        {docs.map((doc) => (
                          <div
                            key={doc.id}
                            className="flex items-center justify-between border-b py-2 last:border-0"
                          >
                            <div>
                              <p className="font-medium">{doc.fileName}</p>
                              <p className="text-sm text-muted-foreground">{formatDateLong(doc.createdAt)}</p>
                            </div>
                            <Button variant="ghost" size="sm" asChild>
                              <Link href={doc.fileUrl} target="_blank" rel="noopener noreferrer">
                                <ArrowRight className="h-4 w-4 me-2" />
                                צפה
                              </Link>
                            </Button>
                          </div>
                        ))}
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-6">
                  עדיין לא הועלו מסמכים להצהרה זו.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Penalty Management Card - shown conditionally based on late submission */}
          <PenaltyManagementCard declarationId={declaration.id} />
        </div>

        {/* Sidebar */}
        <div className="space-y-6">

          {/* Portal Link */}
          {declaration.publicToken && (
            <Card>
              <CardHeader>
                <CardTitle>פורטל לקוח</CardTitle>
                <CardDescription>שתף קישור זה עם הלקוח</CardDescription>
              </CardHeader>
              <CardContent className="flex justify-between items-center bg-muted/30 p-3 m-6 mt-0 rounded-lg">
                <span className="text-sm text-muted-foreground truncate flex-1">
                  קישור לפורטל
                </span>
                <PortalLinkButton token={declaration.publicToken} />
              </CardContent>
            </Card>
          )}

          {/* Key Dates */}
          <Card>
            <CardHeader>
              <CardTitle>תאריכים חשובים</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">תאריך יצירה</p>
                <p className="font-medium" dir="ltr">
                  {formatDateLong(declaration.createdAt)}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">דדליין להגשה</p>
                <p className="font-medium" dir="ltr">
                  {declaration.deadline ? formatDateLong(declaration.deadline) : "-"}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Assigned Accountant */}
          <Card>
            <CardHeader>
              <CardTitle>רו״ח אחראי</CardTitle>
            </CardHeader>
            <CardContent>
              <AssignAccountantSelect
                declarationId={declaration.id}
                currentAssignee={declaration.assignedTo}
                accountants={accountants}
                isAdmin={isAdmin}
              />
            </CardContent>
          </Card>

          {/* Priority */}
          <Card>
            <CardHeader>
              <CardTitle>עדיפות</CardTitle>
            </CardHeader>
            <CardContent>
              <PriorityBadge priority={declaration.priority} />
            </CardContent>
          </Card>

          {/* Status History Timeline */}
          <StatusHistoryTimeline declarationId={declaration.id} />

          {/* Communication History */}
          <CommunicationHistoryCard declarationId={declaration.id} />
        </div>
      </div>
    </div>
  )
}
