import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { ClientForm } from "@/components/clients/client-form"
import { Button } from "@/components/ui/button"
import { ACTIONS, CLIENTS } from "@/lib/constants/hebrew"

export default function NewClientPage() {
  return (
    <div className="space-y-6">
      {/* Back button and header */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/clients">
            <ArrowRight className="h-4 w-4 me-2" />
            {ACTIONS.back}
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold">{CLIENTS.addClient}</h1>
          <p className="text-muted-foreground">הוסף לקוח חדש למערכת</p>
        </div>
      </div>

      {/* Client Form */}
      <div className="max-w-2xl">
        <ClientForm />
      </div>
    </div>
  )
}
