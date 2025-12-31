import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DeclarationWizard } from "@/components/declarations/wizard"
import { Button } from "@/components/ui/button"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"

export default function NewDeclarationPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/dashboard/declarations">
            <ArrowRight className="h-4 w-4" />
            <span className="sr-only">{ACTIONS.back}</span>
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{DECLARATIONS.newDeclaration}</h1>
          <p className="text-muted-foreground">
            מלא את הפרטים ליצירת הצהרת הון חדשה
          </p>
        </div>
      </div>

      {/* Wizard */}
      <DeclarationWizard />
    </div>
  )
}
