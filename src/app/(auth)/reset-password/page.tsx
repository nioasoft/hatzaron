import { Suspense } from "react"
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ResetPasswordForm } from "@/components/auth/reset-password-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { AUTH } from "@/lib/constants/hebrew"

export default async function ResetPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{AUTH.resetPassword.title}</CardTitle>
          <CardDescription>{AUTH.resetPassword.description}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <Suspense fallback={<div>{AUTH.login.loading}</div>}>
            <ResetPasswordForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
