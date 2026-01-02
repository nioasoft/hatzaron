"use client"

import { useState } from "react"
import { Copy, ExternalLink, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface PortalLinkButtonProps {
  token: string
}

export function PortalLinkButton({ token }: PortalLinkButtonProps) {
  const [copied, setCopied] = useState(false)

  const getPortalUrl = () => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/portal/${token}`
  }

  const handleCopy = () => {
    const url = getPortalUrl()
    navigator.clipboard.writeText(url)
    setCopied(true)
    toast.success("הקישור הועתק ללוח")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleOpen = () => {
    window.open(getPortalUrl(), "_blank")
  }

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleCopy}>
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
              <span className="sr-only">העתק קישור לפורטל</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>העתק קישור לפורטל</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" onClick={handleOpen}>
              <ExternalLink className="h-4 w-4" />
              <span className="sr-only">פתח פורטל</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>פתח פורטל לקוח</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}
