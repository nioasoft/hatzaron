"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { resetPassword } from "@/lib/auth-client"
import { AUTH, VALIDATION } from "@/lib/constants/hebrew"

export function ResetPasswordForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const error = searchParams.get("error")

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [formError, setFormError] = useState("")
  const [isPending, setIsPending] = useState(false)

  if (error === "invalid_token" || !token) {
    return (
      <div className="space-y-4 w-full max-w-sm text-center">
        <p className="text-sm text-destructive">
          {error === "invalid_token"
            ? AUTH.resetPassword.invalidToken
            : AUTH.resetPassword.noToken}
        </p>
        <Link href="/forgot-password">
          <Button variant="outline" className="w-full">
            {AUTH.resetPassword.requestNewLink}
          </Button>
        </Link>
      </div>
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (password !== confirmPassword) {
      setFormError(VALIDATION.passwordMismatch)
      return
    }

    if (password.length < 8) {
      setFormError(VALIDATION.passwordTooShort)
      return
    }

    setIsPending(true)

    try {
      const result = await resetPassword({
        newPassword: password,
        token,
      })

      if (result.error) {
        setFormError(result.error.message || AUTH.errors.failedResetPassword)
      } else {
        router.push("/login?reset=success")
      }
    } catch {
      setFormError(AUTH.errors.unexpectedError)
    } finally {
      setIsPending(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
      <div className="space-y-2">
        <Label htmlFor="password">{AUTH.resetPassword.newPassword}</Label>
        <Input
          id="password"
          type="password"
          placeholder={AUTH.resetPassword.newPasswordPlaceholder}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={isPending}
          dir="ltr"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword">{AUTH.resetPassword.confirmPassword}</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder={AUTH.resetPassword.confirmPasswordPlaceholder}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          disabled={isPending}
          dir="ltr"
        />
      </div>
      {formError && (
        <p className="text-sm text-destructive">{formError}</p>
      )}
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? AUTH.resetPassword.submitting : AUTH.resetPassword.submit}
      </Button>
    </form>
  )
}
