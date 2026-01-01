"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle, Home, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error("Admin error:", error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold">שגיאה בטעינת הדף</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            לא הצלחנו לטעון את הדף הזה. נסה לרענן את הדף או חזור לסקירה הכללית.
          </p>
          {error.digest && (
            <p className="mt-4 text-xs text-muted-foreground" dir="ltr">
              Error ID: {error.digest}
            </p>
          )}
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button onClick={reset}>
            <RotateCcw className="h-4 w-4 me-2" />
            נסה שוב
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin">
              <Home className="h-4 w-4 me-2" />
              סקירה כללית
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
