import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { SignInButton } from "@/components/auth/sign-in-button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { auth } from "@/lib/auth"
import { AUTH } from "@/lib/constants/hebrew"

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ reset?: string }>
}) {
  let session = null
  try {
    session = await auth.api.getSession({ headers: await headers() })
  } catch (error) {
    // Log error but continue - user is not logged in
    console.error("Session check failed:", error)
  }

  if (session) {
    redirect("/dashboard")
  }

  const { reset } = await searchParams

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle>{AUTH.login.title}</CardTitle>
          <CardDescription>{AUTH.login.subtitle}</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center">
          {reset === "success" && (
            <p className="mb-4 text-sm text-green-600 dark:text-green-400">
              {AUTH.login.passwordResetSuccess}
            </p>
          )}
          <SignInButton />
        </CardContent>
      </Card>
    </div>
  )
}
