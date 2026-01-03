import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DECLARATIONS, ACTIONS } from "@/lib/constants/hebrew"
import { CreateDeclarationForm } from "@/components/declarations/create-declaration-form"

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

      {/* Form */}
      <div className="max-w-2xl">
        <CreateDeclarationForm />
      </div>
    </div>
  )
}
