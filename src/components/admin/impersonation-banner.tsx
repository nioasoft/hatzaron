"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { LogOut, Loader2, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { adminActions } from "@/lib/auth-client"
import { ADMIN } from "@/lib/constants/hebrew"

interface ImpersonationBannerProps {
  firmName: string
  firmEmail: string
}

export function ImpersonationBanner({ firmName, firmEmail }: ImpersonationBannerProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleExit = async () => {
    setIsLoading(true)
    try {
      await adminActions.stopImpersonating({})
      router.push("/admin/firms")
      router.refresh()
    } catch (error) {
      console.error("Failed to stop impersonating:", error)
      setIsLoading(false)
    }
  }

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-yellow-500 text-yellow-950 py-2 px-4">
      <div className="max-w-screen-2xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5" />
          <span className="font-medium">
            {ADMIN.impersonation.banner}
          </span>
          <span className="font-bold">{firmName}</span>
          <span className="text-yellow-800" dir="ltr">({firmEmail})</span>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleExit}
          disabled={isLoading}
          className="bg-yellow-100 text-yellow-950 hover:bg-yellow-200 border-0"
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 me-2 animate-spin" />
              יוצא...
            </>
          ) : (
            <>
              <LogOut className="h-4 w-4 me-2" />
              {ADMIN.impersonation.exit}
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
