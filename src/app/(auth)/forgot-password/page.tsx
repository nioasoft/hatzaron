import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { AUTH } from "@/lib/constants/hebrew"

export default async function ForgotPasswordPage() {
  const session = await auth.api.getSession({ headers: await headers() })

  if (session) {
    redirect("/dashboard")
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{AUTH.forgotPassword.title}</CardTitle>
          <CardDescription>
            {AUTH.forgotPassword.description}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          <ForgotPasswordForm />
        </CardContent>
      </Card>
    </div>
  )
}
