"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { UserCheck, UserX, Loader2 } from "lucide-react"
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
import { ADMIN, ACTIONS } from "@/lib/constants/hebrew"

interface BanUserButtonProps {
  userId: string
  isBanned: boolean
}

export function BanUserButton({ userId, isBanned }: BanUserButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()

  const handleToggleBan = async () => {
    setIsLoading(true)
    try {
      if (isBanned) {
        await adminActions.unbanUser({ userId })
      } else {
        await adminActions.banUser({ userId })
      }
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle user ban status:", error)
    } finally {
      setIsLoading(false)
      setIsOpen(false)
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <Button
          variant={isBanned ? "default" : "destructive"}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 me-2 animate-spin" />
              {isBanned
                ? ADMIN.firms.detail.activating
                : ADMIN.firms.detail.suspending}
            </>
          ) : isBanned ? (
            <>
              <UserCheck className="h-4 w-4 me-2" />
              {ADMIN.firms.actions.activate}
            </>
          ) : (
            <>
              <UserX className="h-4 w-4 me-2" />
              {ADMIN.firms.actions.suspend}
            </>
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isBanned
              ? ADMIN.firms.actions.activate
              : ADMIN.firms.actions.suspend}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isBanned
              ? "האם אתה בטוח שברצונך להפעיל את המשרד הזה? המשרד יוכל לגשת שוב למערכת."
              : "האם אתה בטוח שברצונך להשעות את המשרד הזה? המשרד לא יוכל לגשת למערכת עד להפעלה מחדש."}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-row-reverse gap-2">
          <AlertDialogAction
            onClick={handleToggleBan}
            className={isBanned ? "" : "bg-destructive text-destructive-foreground hover:bg-destructive/90"}
          >
            {ACTIONS.confirm}
          </AlertDialogAction>
          <AlertDialogCancel>{ACTIONS.cancel}</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
