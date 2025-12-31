"use client"

import { Mail, User } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

interface WhiteLabelPreviewProps {
  logo: string | undefined
  primaryColor: string
  firmName: string
  contactEmail: string
}

export function WhiteLabelPreview({
  logo,
  primaryColor,
  firmName,
  contactEmail,
}: WhiteLabelPreviewProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <p className="text-sm font-medium text-muted-foreground">
          תצוגה מקדימה - פורטל לקוח
        </p>
      </CardHeader>
      <CardContent className="p-0">
        {/* Preview Container */}
        <div
          className="border rounded-lg m-4 overflow-hidden"
          style={
            {
              "--preview-primary": primaryColor,
            } as React.CSSProperties
          }
        >
          {/* Mock Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ backgroundColor: primaryColor }}
          >
            <div className="flex items-center gap-3">
              {logo ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo}
                  alt={firmName}
                  className="h-8 w-auto bg-white rounded px-2 py-1"
                />
              ) : (
                <div className="h-8 px-3 bg-white/90 rounded flex items-center">
                  <span className="text-sm font-bold text-gray-800">
                    {firmName}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-white/20 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
              </div>
            </div>
          </div>

          {/* Mock Content */}
          <div className="p-4 bg-muted/30 space-y-3">
            <div className="bg-background rounded-lg p-4 space-y-2">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted/60 rounded" />
            </div>
            <div className="bg-background rounded-lg p-4 space-y-2">
              <div className="h-4 w-40 bg-muted rounded" />
              <div className="h-3 w-56 bg-muted/60 rounded" />
            </div>
          </div>

          {/* Mock Footer */}
          <div className="p-3 bg-muted/50 border-t text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Mail className="h-3 w-3" />
              <span dir="ltr">{contactEmail}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
