"use client"

import { useState } from "react"
import { toast } from "sonner"
import { User, Building, CreditCard, FileUp, CheckCircle, Wallet, Car } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StepWelcome } from "./step-welcome"
import { StepDocuments, DocumentCategory } from "./step-documents"
import { uploadDocument, markDocumentsComplete } from "@/app/portal/actions"
import { Separator } from "@/components/ui/separator"

// Define the steps and their document requirements
const DOC_CATEGORIES: Record<string, DocumentCategory> = {
  general: {
    id: "general",
    label: "פרטים אישיים",
    description: "אנא העלה צילום תעודת זהות וספח",
    items: [
      { id: "id_card", label: "תעודת זהות", description: "כולל ספח פתוח" },
      { id: "partner_id", label: "ת.ז. בן/בת זוג", description: "במידה ויש" },
    ]
  },
  banks: {
    id: "banks",
    label: "בנקים ופיננסים",
    description: "אישורי יתרות ליום ההצהרה מכל הבנקים",
    items: [
      { id: "bank_il", label: "עו״ש ופיקדונות (בארץ)", description: "אישור יתרות ליום הקובע" },
      { id: "bank_foreign", label: "חשבונות בחו״ל", description: "דפי בנק / אישור יתרות" },
      { id: "investments", label: "תיקי השקעות", description: "דוח יתרות מבית ההשקעות/בנק" },
    ]
  },
  real_estate: {
    id: "real_estate",
    label: 'נדל"ן',
    description: "נכסים בבעלותך (דירות, מגרשים, זכויות)",
    items: [
      { id: "tabu", label: "נסח טאבו / אישור זכויות", description: "לכל נכס בנפרד" },
      { id: "purchase_contract", label: "חוזה רכישה", description: "לנכסים שנרכשו השנה" },
    ]
  },
  liabilities: {
    id: "liabilities",
    label: "התחייבויות",
    description: "משכנתאות והלוואות",
    items: [
      { id: "mortgage", label: "יתרת משכנתא", description: "אישור יתרה עדכני מהבנק" },
      { id: "loans", label: "הלוואות אחרות", description: "אישור יתרה ממוסדות אחרים" },
    ]
  },
  other: {
    id: "other",
    label: "רכבים ואחר",
    description: "רכבים, כספות, ופריטי ערך",
    items: [
      { id: "vehicle", label: "רישיון רכב", description: "בתוקף ליום ההצהרה" },
      { id: "other_assets", label: "נכסים אחרים", description: "מסמכים נוספים" },
    ]
  }
}

const WIZARD_STEPS = [
  { id: "welcome", label: "ברוכים הבאים", icon: User },
  { id: "general", label: "כללי", icon: FileUp },
  { id: "banks", label: "בנקים", icon: Wallet },
  { id: "real_estate", label: 'נדל"ן', icon: Building },
  { id: "liabilities", label: "התחייבויות", icon: CreditCard },
  { id: "other", label: "אחר", icon: Car },
  { id: "review", label: "סיום", icon: CheckCircle },
] as const

export type WizardStep = (typeof WIZARD_STEPS)[number]["id"]

export interface DeclarationWizardProps {
  initialUploadedFiles: Record<string, boolean>
  declarationId: string
  publicToken: string
}

export function DeclarationWizard({ initialUploadedFiles, declarationId, publicToken }: DeclarationWizardProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>("welcome")
  const [uploadedFiles, setUploadedFiles] = useState(initialUploadedFiles)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const currentStepIndex = WIZARD_STEPS.findIndex((s) => s.id === currentStep)

  const handleNext = () => {
    const nextStep = WIZARD_STEPS[currentStepIndex + 1]
    if (nextStep) {
      setCurrentStep(nextStep.id)
    }
  }

  const handlePrevious = () => {
    const prevStep = WIZARD_STEPS[currentStepIndex - 1]
    if (prevStep) {
      setCurrentStep(prevStep.id)
    }
  }

  const handleSubmit = async () => {
    if (isSubmitting) return

    setIsSubmitting(true)
    try {
      const result = await markDocumentsComplete(declarationId, publicToken)
      if (result.success) {
        toast.success("תודה! המסמכים הועברו למשרד")
      } else {
        toast.error(result.error || "שגיאה בשליחת המסמכים")
      }
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בשליחת המסמכים")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleFileUpload = async (fileId: string, file: File) => {
    const formData = new FormData()
    formData.append("file", file)

    try {
      await uploadDocument(declarationId, publicToken, fileId, formData)
      
      setUploadedFiles(prev => ({
        ...prev,
        [fileId]: true
      }))
      
      toast.success("הקובץ הועלה בהצלחה")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה בהעלאת הקובץ")
    }
  }

  // Calculate progress
  const totalFiles = Object.values(DOC_CATEGORIES).reduce((sum, cat) => sum + cat.items.length, 0)
  const uploadedCount = Object.keys(uploadedFiles).length
  const progressPercent = Math.round((uploadedCount / totalFiles) * 100)

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center overflow-x-auto pb-4 no-scrollbar">
        <div className="flex items-center gap-2 min-w-max px-2">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon
            const isActive = step.id === currentStep
            const isCompleted = index < currentStepIndex

            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => {
                    if (index <= currentStepIndex) {
                      setCurrentStep(step.id)
                    }
                  }}
                  disabled={index > currentStepIndex}
                  className={cn(
                    "flex flex-col items-center gap-1 rounded-lg p-2 transition-colors",
                    isActive && "text-primary",
                    isCompleted &&
                      "cursor-pointer text-primary hover:bg-muted",
                    !isActive &&
                      !isCompleted &&
                      "cursor-not-allowed text-muted-foreground"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-colors",
                      isActive && "border-primary bg-primary text-primary-foreground",
                      isCompleted && "border-primary bg-primary/10",
                      !isActive && !isCompleted && "border-muted-foreground/30"
                    )}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="text-xs font-medium">{step.label}</span>
                </button>
                {index < WIZARD_STEPS.length - 1 && (
                  <div
                    className={cn(
                      "mx-1 h-0.5 w-4 sm:w-8 transition-colors",
                      index < currentStepIndex
                        ? "bg-primary"
                        : "bg-muted-foreground/20"
                    )}
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3 items-start">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="min-h-[500px]">
            <CardContent className="p-6">
              {currentStep === "welcome" && <StepWelcome />}
              
              {/* Dynamic Document Steps */}
              {(currentStep === "general" || 
                currentStep === "banks" || 
                currentStep === "real_estate" || 
                currentStep === "liabilities" || 
                currentStep === "other") && (
                <StepDocuments 
                  category={DOC_CATEGORIES[currentStep]!} 
                  uploadedFiles={uploadedFiles}
                  onUpload={handleFileUpload}
                />
              )}

              {currentStep === "review" && (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto text-green-600 dark:text-green-400">
                    <CheckCircle className="h-8 w-8" />
                  </div>
                  <h2 className="text-2xl font-bold">סיימנו!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    תודה שהעלית את המסמכים. משרד רואי החשבון יעבור על החומרים ויצור איתך קשר במידה ויהיו חוסרים.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between">
            <div>
              {currentStepIndex > 0 && (
                <Button variant="outline" onClick={handlePrevious}>
                  חזרה
                </Button>
              )}
            </div>
            <div className="flex items-center gap-2">
              {currentStep === "review" ? (
                <Button onClick={handleSubmit} disabled={isSubmitting} className="w-32">
                  {isSubmitting ? "שולח..." : "סיום"}
                </Button>
              ) : (
                <Button onClick={handleNext} className="w-32">
                  {currentStep === "welcome" ? "בוא נתחיל" : "המשך"}
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-4 lg:sticky lg:top-6 hidden lg:block">
          <Card className="bg-muted/30 border-none shadow-none">
            <CardContent className="p-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-2">התקדמות</h3>
                <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-primary transition-all duration-500 ease-out"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-end">
                  {uploadedCount} מתוך {totalFiles} מסמכים הועלו
                </p>
              </div>

              <Separator className="bg-muted-foreground/10" />

              <div className="space-y-3 text-sm">
                <h3 className="font-semibold">סטטוס מסמכים</h3>
                {Object.values(DOC_CATEGORIES).map(cat => {
                  const catItems = cat.items.map(i => i.id)
                  const uploadedInCat = catItems.filter(id => uploadedFiles[id]).length
                  const totalInCat = catItems.length
                  const isComplete = uploadedInCat === totalInCat && totalInCat > 0
                  
                  return (
                    <div key={cat.id} className="flex justify-between items-center">
                      <span className={cn(isComplete && "text-primary font-medium")}>
                        {cat.label}
                      </span>
                      <span className="text-muted-foreground text-xs">
                        {uploadedInCat}/{totalInCat}
                      </span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}