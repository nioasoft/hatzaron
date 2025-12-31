"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { requestPasswordReset } from "@/lib/auth-client"
import { AUTH } from "@/lib/constants/hebrew"

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [isPending, setIsPending] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsPending(true)

    try {
      const result = await requestPasswordReset({
        email,
        redirectTo: "/reset-password",
      })

      if (result.error) {
        setError(result.error.message || AUTH.errors.failedResetEmail)
      } else {
        setSuccess(true)
      }
    } catch {
      setError(AUTH.errors.unexpectedError)
    } finally {
      setIsPending(false)
    }
  }

  if (success) {
    return (
      <div className="space-y-4 w-full max-w-sm text-center">
        <p className="text-sm text-muted-foreground">
          {AUTH.forgotPassword.successMessage}
        </p>
        <Link href="/login">
          <Button variant="outline" className="w-full">
            {AUTH.forgotPassword.backToLogin}
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="email">{AUTH.forgotPassword.email}</Label>
        <Input
          id="email"
          type="email"
          placeholder={AUTH.forgotPassword.emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isPending}
          dir="ltr"
          className="text-start"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive">{error}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? AUTH.forgotPassword.submitting : AUTH.forgotPassword.submit}
      </Button>
      <div className="text-center text-sm text-muted-foreground">
        {AUTH.forgotPassword.rememberPassword}{" "}
        <Link href="/login" className="text-primary hover:underline">
          {AUTH.register.login}
        </Link>
      </div>
    </form>
  )
}
