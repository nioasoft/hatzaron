"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { logCommunication } from "@/app/dashboard/declarations/actions"
import { COMMUNICATION } from "@/lib/constants/hebrew"
import { toast } from "sonner"
import { Loader2, MessageCircle } from "lucide-react"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface WhatsAppReminderButtonProps {
  declarationId: string
  clientPhone: string
  clientName: string
  year: number
  publicToken: string | null
  onCommunicationLogged?: () => void
  variant?: "default" | "outline" | "ghost"
  size?: "default" | "sm" | "lg" | "icon"
}

export function WhatsAppReminderButton({
  declarationId,
  clientPhone,
  clientName,
  year,
  publicToken,
  onCommunicationLogged,
  variant = "outline",
  size = "sm",
}: WhatsAppReminderButtonProps) {
  const [isPending, startTransition] = useTransition()
  const [hasLogged, setHasLogged] = useState(false)

  const generateWhatsAppLink = () => {
    // Clean phone number - remove spaces, dashes, parentheses
    const cleanPhone = clientPhone.replace(/[\s\-()]/g, "")

    // Convert to international format (Israel)
    const phoneWithCode = cleanPhone.startsWith("+")
      ? cleanPhone.slice(1) // Remove the + sign (WhatsApp API doesn't use it)
      : cleanPhone.startsWith("0")
        ? "972" + cleanPhone.slice(1) // Convert 0xx to 972xx
        : "972" + cleanPhone // Just prepend country code

    // Build portal URL
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    const portalUrl = publicToken ? `${appUrl}/portal/${publicToken}` : appUrl

    // Generate message from template
    const message = COMMUNICATION.whatsapp.messageTemplate
      .replace("{name}", clientName)
      .replace("{year}", year.toString())
      .replace("{link}", portalUrl)

    return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`
  }

  const handleClick = () => {
    if (!clientPhone) {
      toast.error("לא קיים מספר טלפון ללקוח")
      return
    }

    // Open WhatsApp link
    const whatsappUrl = generateWhatsAppLink()
    window.open(whatsappUrl, "_blank", "noopener,noreferrer")

    // Log the communication
    startTransition(async () => {
      const result = await logCommunication({
        declarationId,
        type: "whatsapp",
        direction: "outbound",
        subject: "תזכורת וואטסאפ",
        content: COMMUNICATION.whatsapp.messageTemplate
          .replace("{name}", clientName)
          .replace("{year}", year.toString())
          .replace("{link}", "..."),
        outcome: "נפתח קישור וואטסאפ",
      })

      if (result.success) {
        setHasLogged(true)
        toast.success("התקשורת נרשמה")
        onCommunicationLogged?.()
      }
    })
  }

  if (!clientPhone) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <span>
              <Button
                variant={variant}
                size={size}
                disabled
                className="gap-2"
              >
                <MessageCircle className="h-4 w-4 text-green-600" />
                וואטסאפ
              </Button>
            </span>
          </TooltipTrigger>
          <TooltipContent>
            <p>לא קיים מספר טלפון ללקוח</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={isPending}
      className="gap-2"
    >
      {isPending ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <MessageCircle className="h-4 w-4 text-green-600" />
      )}
      {COMMUNICATION.whatsapp.sendReminder}
      {hasLogged && (
        <span className="text-green-600 text-xs">(נרשם)</span>
      )}
    </Button>
  )
}
