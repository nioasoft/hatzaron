"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserRound, Loader2 } from "lucide-react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { adminActions } from "@/lib/auth-client"
import { ADMIN } from "@/lib/constants/hebrew"

interface ImpersonateButtonProps {
  userId: string
  userName: string
}

export function ImpersonateButton({ userId, userName }: ImpersonateButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleImpersonate = async () => {
    setIsLoading(true)
    try {
      await adminActions.impersonateUser({ userId })
      router.push("/dashboard")
      router.refresh()
    } catch (error) {
      console.error("Failed to impersonate user:", error)
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 me-2 animate-spin" />
              מתחבר...
            </>
          ) : (
            <>
              <UserRound className="h-4 w-4 me-2" />
              {ADMIN.firms.actions.impersonate}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{ADMIN.impersonation.confirmTitle}</AlertDialogTitle>
          <AlertDialogDescription>
            {ADMIN.impersonation.confirmDescription}
            <span className="block mt-2 font-medium text-foreground">
              {userName}
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogAction onClick={handleImpersonate}>
            {ADMIN.impersonation.confirm}
          </AlertDialogAction>
          <AlertDialogCancel>{ADMIN.impersonation.cancel}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
