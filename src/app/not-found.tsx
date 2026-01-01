import Link from "next/link"
import { FileQuestion, Home, LayoutDashboard } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="container mx-auto flex min-h-[60vh] items-center justify-center px-4 py-16">
      <Card className="max-w-md text-center">
        <CardHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
            <FileQuestion className="h-8 w-8 text-muted-foreground" />
          </div>
          <h1 className="text-4xl font-bold">404</h1>
          <h2 className="text-xl font-semibold">הדף לא נמצא</h2>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            הדף שחיפשת לא קיים או שהועבר למיקום אחר.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center gap-4">
          <Button asChild>
            <Link href="/">
              <Home className="h-4 w-4 me-2" />
              דף הבית
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/dashboard">
              <LayoutDashboard className="h-4 w-4 me-2" />
              לוח בקרה
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
