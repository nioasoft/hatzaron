"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight } from "lucide-react"
import { toast } from "sonner"
import { ClientForm, type ClientFormData } from "@/components/clients/client-form"
import { Button } from "@/components/ui/button"
import { ACTIONS, CLIENTS } from "@/lib/constants/hebrew"
import { createClient } from "@/app/dashboard/clients/actions"

export default function NewClientPage() {
  const router = useRouter()

  const handleSubmit = async (data: ClientFormData) => {
    try {
      await createClient(data)
      toast.success("הלקוח נוצר בהצלחה")
      router.push("/dashboard/clients")
    } catch (error) {
      console.error(error)
      toast.error("שגיאה ביצירת הלקוח")
    }
  }

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
        <ClientForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}