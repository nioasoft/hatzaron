import Link from "next/link"
import {
  FileText,
  Upload,
  ClipboardList,
  MessageSquare,
  CheckCircle2,
  Clock,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PORTAL } from "@/lib/constants/hebrew"

// Calculate days until deadline at module load time
const DEADLINE = "2024-03-15"
const DAYS_UNTIL_DEADLINE = Math.ceil(
  (new Date(DEADLINE).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
)

// Mock data - would come from database
const declarationData = {
  status: "pending_documents" as const,
  deadline: DEADLINE,
  daysUntilDeadline: DAYS_UNTIL_DEADLINE,
  progress: 45,
  documentsUploaded: 2,
  documentsRequired: 6,
  dataCompleted: 3,
  dataRequired: 5,
  unreadMessages: 2,
}

const STATUS_CONFIG = {
  draft: {
    label: "טיוטה",
    color: "bg-muted text-muted-foreground",
    icon: Clock,
  },
  pending_documents: {
    label: "ממתין למסמכים",
    color: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400",
    icon: AlertCircle,
  },
  in_review: {
    label: "בבדיקה",
    color: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    icon: Clock,
  },
  submitted: {
    label: "הוגש",
    color: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400",
    icon: CheckCircle2,
  },
  completed: {
    label: "הושלם",
    color: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
    icon: CheckCircle2,
  },
}

export default function PortalDashboard() {
  const status = STATUS_CONFIG[declarationData.status]
  const StatusIcon = status.icon
  const daysUntilDeadline = declarationData.daysUntilDeadline

  return (
    <div id="main-content" className="space-y-6">
      {/* Welcome Section */}
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">{PORTAL.welcome}, ישראל!</h1>
        <p className="text-muted-foreground">
          כאן תוכל לעקוב אחרי הצהרת ההון שלך, להעלות מסמכים ולמלא נתונים.
        </p>
      </div>

      {/* Status Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                הצהרת הון 2024
              </CardTitle>
              <CardDescription>
                דדליין להגשה: {new Date(declarationData.deadline).toLocaleDateString("he-IL")}
              </CardDescription>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={status.color}>
                <StatusIcon className="h-3 w-3 me-1" />
                {status.label}
              </Badge>
              {daysUntilDeadline > 0 && daysUntilDeadline <= 30 && (
                <Badge variant="outline" className="border-orange-500 text-orange-600">
                  {daysUntilDeadline} ימים נותרו
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>התקדמות כללית</span>
              <span className="font-medium">{declarationData.progress}%</span>
            </div>
            <Progress value={declarationData.progress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Documents */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <Link href="/portal/documents" className="block space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--portal-primary, var(--primary)) 15%, transparent)",
                    color: "var(--portal-primary, var(--primary))",
                  }}
                >
                  <Upload className="h-6 w-6" />
                </div>
                <Badge variant="outline">
                  {declarationData.documentsUploaded}/{declarationData.documentsRequired}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">{PORTAL.tabs.documents}</h3>
                <p className="text-sm text-muted-foreground">העלה מסמכים נדרשים</p>
              </div>
              <Progress
                value={(declarationData.documentsUploaded / declarationData.documentsRequired) * 100}
                className="h-1"
              />
            </Link>
          </CardContent>
        </Card>

        {/* Data Entry */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <Link href="/portal/data" className="block space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--portal-primary, var(--primary)) 15%, transparent)",
                    color: "var(--portal-primary, var(--primary))",
                  }}
                >
                  <ClipboardList className="h-6 w-6" />
                </div>
                <Badge variant="outline">
                  {declarationData.dataCompleted}/{declarationData.dataRequired}
                </Badge>
              </div>
              <div>
                <h3 className="font-medium">{PORTAL.tabs.data}</h3>
                <p className="text-sm text-muted-foreground">מלא פרטים פיננסיים</p>
              </div>
              <Progress
                value={(declarationData.dataCompleted / declarationData.dataRequired) * 100}
                className="h-1"
              />
            </Link>
          </CardContent>
        </Card>

        {/* Status */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <Link href="/portal/status" className="block space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--portal-primary, var(--primary)) 15%, transparent)",
                    color: "var(--portal-primary, var(--primary))",
                  }}
                >
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
              <div>
                <h3 className="font-medium">{PORTAL.tabs.status}</h3>
                <p className="text-sm text-muted-foreground">צפה בהתקדמות מפורטת</p>
              </div>
            </Link>
          </CardContent>
        </Card>

        {/* Messages */}
        <Card className="hover:border-primary/50 transition-colors">
          <CardContent className="pt-6">
            <Link href="/portal/messages" className="block space-y-4">
              <div className="flex items-center justify-between">
                <div
                  className="p-3 rounded-lg"
                  style={{
                    backgroundColor: "color-mix(in oklch, var(--portal-primary, var(--primary)) 15%, transparent)",
                    color: "var(--portal-primary, var(--primary))",
                  }}
                >
                  <MessageSquare className="h-6 w-6" />
                </div>
                {declarationData.unreadMessages > 0 && (
                  <Badge
                    className="text-white"
                    style={{ backgroundColor: "var(--portal-primary, var(--primary))" }}
                  >
                    {declarationData.unreadMessages} חדשות
                  </Badge>
                )}
              </div>
              <div>
                <h3 className="font-medium">{PORTAL.tabs.messages}</h3>
                <p className="text-sm text-muted-foreground">תקשורת עם המשרד</p>
              </div>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">הצעדים הבאים</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center">
                <span className="text-yellow-600 dark:text-yellow-400 text-xs font-bold">1</span>
              </div>
              <div>
                <p className="font-medium">העלה צילום תעודת זהות</p>
                <p className="text-sm text-muted-foreground">
                  נדרש צילום ברור משני הצדדים
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs font-bold">2</span>
              </div>
              <div>
                <p className="font-medium">העלה דפי בנק</p>
                <p className="text-sm text-muted-foreground">
                  דפי חשבון מ-3 החודשים האחרונים
                </p>
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div className="mt-0.5 h-5 w-5 rounded-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-xs font-bold">3</span>
              </div>
              <div>
                <p className="font-medium">מלא פרטי נדל&quot;ן</p>
                <p className="text-sm text-muted-foreground">
                  פרטי דירה/בית בבעלותך
                </p>
              </div>
            </li>
          </ul>
          <div className="mt-4 pt-4 border-t">
            <Button asChild>
              <Link href="/portal/documents">המשך להעלאת מסמכים</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
