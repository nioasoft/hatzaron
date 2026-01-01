"use client"

import { useEffect } from "react"
import { AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">משהו השתבש</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            אירעה שגיאה בלתי צפויה. נסה שוב או פנה לתמיכה אם הבעיה נמשכת.
          </p>
          {error.digest && (
            <p className="mt-4 text-xs text-muted-foreground" dir="ltr">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={reset}>נסה שוב</Button>
          <Button
            variant="outline"
            onClick={() => (window.location.href = "/")}
          >
            חזור לדף הבית
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
