"use client"

import { FileText, Shield, Clock } from "lucide-react"

export function StepWelcome() {
  return (
    <div className="space-y-8 text-center max-w-2xl mx-auto py-8">
      <div>
        <h2 className="text-2xl font-bold text-primary mb-2">ברוכים הבאים לפורטל הצהרת ההון</h2>
        <p className="text-muted-foreground">
          תהליך זה נועד לאסוף את כל המסמכים הנדרשים להכנת הצהרת ההון שלך בצורה מאובטחת ויעילה.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 text-start">
        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary">
            <FileText className="h-5 w-5" />
          </div>
          <h3 className="font-semibold">העלאת מסמכים</h3>
          <p className="text-sm text-muted-foreground">
            העלה את כל האישורים והמסמכים ישירות מהמחשב או מהנייד.
          </p>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary">
            <Shield className="h-5 w-5" />
          </div>
          <h3 className="font-semibold">מאובטח ופרטי</h3>
          <p className="text-sm text-muted-foreground">
            המידע שלך מוצפן ומאובטח ברמה הגבוהה ביותר.
          </p>
        </div>

        <div className="bg-muted/30 p-4 rounded-lg space-y-2">
          <div className="bg-primary/10 w-10 h-10 rounded-full flex items-center justify-center text-primary">
            <Clock className="h-5 w-5" />
          </div>
          <h3 className="font-semibold">שמור והמשך</h3>
          <p className="text-sm text-muted-foreground">
            תוכל לעצור בכל שלב ולהמשיך מאוחר יותר מאותה נקודה.
          </p>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-100 dark:border-blue-900 text-start">
        <h4 className="font-semibold text-blue-800 dark:text-blue-200 mb-1">לפני שמתחילים:</h4>
        <p className="text-sm text-blue-700 dark:text-blue-300">
          מומלץ להכין מראש צילום תעודת זהות, אישורי יתרות מהבנקים, ומסמכי נכסים והלוואות.
        </p>
      </div>
    </div>
  )
}
