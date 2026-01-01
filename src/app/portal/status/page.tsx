import {
  CheckCircle2,
  Circle,
  Clock,
  FileText,
  Upload,
  ClipboardList,
  Send,
  AlertCircle,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { PORTAL } from "@/lib/constants/hebrew"
import { cn } from "@/lib/utils"

// Mock status data
const declarationStatus = {
  currentStep: 2,
  steps: [
    {
      id: 1,
      title: "הצהרה נפתחה",
      description: "הצהרת הון חדשה נוצרה עבורך",
      date: "2024-01-15",
      status: "completed" as const,
    },
    {
      id: 2,
      title: "העלאת מסמכים",
      description: "העלה את המסמכים הנדרשים",
      date: "2024-01-20",
      status: "in_progress" as const,
    },
    {
      id: 3,
      title: "מילוי נתונים",
      description: "מלא את הפרטים הפיננסיים",
      date: null,
      status: "pending" as const,
    },
    {
      id: 4,
      title: "בדיקת רואה החשבון",
      description: "המשרד בודק את הנתונים והמסמכים",
      date: null,
      status: "pending" as const,
    },
    {
      id: 5,
      title: "הגשה לרשות המסים",
      description: "ההצהרה מוגשת לרשות המסים",
      date: null,
      status: "pending" as const,
    },
  ],
  summary: {
    documentsUploaded: 2,
    documentsRequired: 6,
    dataSectionsCompleted: 1,
    dataSectionsTotal: 5,
    deadline: "2024-03-15",
    daysRemaining: 45,
  },
}

const STEP_ICONS = {
  1: FileText,
  2: Upload,
  3: ClipboardList,
  4: Clock,
  5: Send,
}

export default function StatusPage() {
  const { steps, summary } = declarationStatus
  const overallProgress =
    (steps.filter((s) => s.status === "completed").length / steps.length) * 100

  return (
    <div id="main-content" className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">{PORTAL.tabs.status}</h1>
        <p className="text-muted-foreground">
          עקוב אחרי ההתקדמות של הצהרת ההון שלך
        </p>
      </div>

      {/* Overall Progress Card */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>הצהרת הון 2024</CardTitle>
              <CardDescription>
                דדליין: {new Date(summary.deadline).toLocaleDateString("he-IL")}
              </CardDescription>
            </div>
            <Badge
              variant="outline"
              className={cn(
                summary.daysRemaining <= 30
                  ? "border-orange-500 text-orange-600"
                  : "border-muted-foreground"
              )}
            >
              <Clock className="h-3 w-3 me-1" />
              {summary.daysRemaining} ימים נותרו
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>התקדמות כללית</span>
              <span className="font-medium">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </div>

          {/* Quick Stats */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <Upload className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">מסמכים</p>
                <p className="text-xs text-muted-foreground">
                  {summary.documentsUploaded}/{summary.documentsRequired} הועלו
                </p>
              </div>
              <Progress
                value={
                  (summary.documentsUploaded / summary.documentsRequired) * 100
                }
                className="h-2 flex-1"
              />
            </div>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <ClipboardList className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium">נתונים</p>
                <p className="text-xs text-muted-foreground">
                  {summary.dataSectionsCompleted}/{summary.dataSectionsTotal}{" "}
                  קטגוריות
                </p>
              </div>
              <Progress
                value={
                  (summary.dataSectionsCompleted / summary.dataSectionsTotal) *
                  100
                }
                className="h-2 flex-1"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">ציר זמן</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {steps.map((step, index) => {
              const StepIcon =
                STEP_ICONS[step.id as keyof typeof STEP_ICONS] || Circle
              const isLast = index === steps.length - 1

              return (
                <div key={step.id} className="relative flex gap-4 pb-8">
                  {/* Vertical line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute start-5 top-10 bottom-0 w-0.5",
                        step.status === "completed"
                          ? "bg-green-500"
                          : "bg-muted-foreground/25"
                      )}
                    />
                  )}

                  {/* Icon */}
                  <div
                    className={cn(
                      "relative z-10 h-10 w-10 rounded-full flex items-center justify-center shrink-0",
                      step.status === "completed" &&
                        "bg-green-100 dark:bg-green-900/30",
                      step.status === "in_progress" &&
                        "bg-yellow-100 dark:bg-yellow-900/30 ring-2 ring-yellow-500",
                      step.status === "pending" &&
                        "bg-muted"
                    )}
                  >
                    {step.status === "completed" ? (
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                    ) : step.status === "in_progress" ? (
                      <AlertCircle className="h-5 w-5 text-yellow-600" />
                    ) : (
                      <StepIcon className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 pt-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                      <div>
                        <h3
                          className={cn(
                            "font-medium",
                            step.status === "pending" && "text-muted-foreground"
                          )}
                        >
                          {step.title}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {step.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {step.date && (
                          <span className="text-xs text-muted-foreground">
                            {new Date(step.date).toLocaleDateString("he-IL")}
                          </span>
                        )}
                        <Badge
                          variant={
                            step.status === "completed"
                              ? "default"
                              : step.status === "in_progress"
                              ? "secondary"
                              : "outline"
                          }
                          className={cn(
                            step.status === "completed" &&
                              "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
                            step.status === "in_progress" &&
                              "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400"
                          )}
                        >
                          {step.status === "completed" && "הושלם"}
                          {step.status === "in_progress" && "בתהליך"}
                          {step.status === "pending" && "ממתין"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* What's Next */}
      <Card className="border-primary/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600" />
            מה הצעד הבא?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            על מנת להתקדם, עליך להשלים את השלבים הבאים:
          </p>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-yellow-500" />
              <span>העלה 4 מסמכים נוספים</span>
            </li>
            <li className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span>מלא נתונים ב-4 קטגוריות נוספות</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
