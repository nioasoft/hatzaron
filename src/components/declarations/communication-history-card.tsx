"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getCommunications, type CommunicationEntry } from "@/app/dashboard/declarations/actions"
import { COMMUNICATION } from "@/lib/constants/hebrew"
import { format } from "date-fns"
import { he } from "date-fns/locale"
import {
  Phone,
  MessageCircle,
  StickyNote,
  Mail,
  ArrowUpRight,
  ArrowDownLeft,
  MessageSquare,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

interface CommunicationHistoryCardProps {
  declarationId: string
  refreshKey?: number
}

const TYPE_ICONS: Record<string, React.ReactNode> = {
  phone_call: <Phone className="h-4 w-4" />,
  whatsapp: <MessageCircle className="h-4 w-4" />,
  note: <StickyNote className="h-4 w-4" />,
  letter: <Mail className="h-4 w-4" />,
}

const TYPE_COLORS: Record<string, string> = {
  phone_call: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  whatsapp: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  note: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300",
  letter: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
}

export function CommunicationHistoryCard({
  declarationId,
  refreshKey = 0,
}: CommunicationHistoryCardProps) {
  const [communications, setCommunications] = useState<CommunicationEntry[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchCommunications() {
      setIsLoading(true)
      const data = await getCommunications(declarationId)
      setCommunications(data)
      setIsLoading(false)
    }
    fetchCommunications()
  }, [declarationId, refreshKey])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MessageSquare className="h-5 w-5" />
            {COMMUNICATION.history.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[200px]" />
                  <Skeleton className="h-3 w-[150px]" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageSquare className="h-5 w-5" />
          {COMMUNICATION.history.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {communications.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-4">
            {COMMUNICATION.history.empty}
          </p>
        ) : (
          <div className="space-y-4">
            {communications.map((comm) => (
              <CommunicationItem key={comm.id} communication={comm} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

function CommunicationItem({ communication }: { communication: CommunicationEntry }) {
  const typeLabel = COMMUNICATION.types[communication.type as keyof typeof COMMUNICATION.types] || communication.type
  const directionIcon = communication.direction === "outbound" ? (
    <ArrowUpRight className="h-3 w-3" />
  ) : (
    <ArrowDownLeft className="h-3 w-3" />
  )
  const directionLabel = COMMUNICATION.directions[communication.direction as keyof typeof COMMUNICATION.directions] || communication.direction

  return (
    <div className="flex gap-3 group">
      {/* Type icon */}
      <div
        className={cn(
          "shrink-0 h-8 w-8 rounded-full flex items-center justify-center",
          TYPE_COLORS[communication.type] || "bg-muted text-muted-foreground"
        )}
      >
        {TYPE_ICONS[communication.type] || <MessageSquare className="h-4 w-4" />}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-medium text-sm">{typeLabel}</span>
          <span className="text-muted-foreground text-xs flex items-center gap-1">
            {directionIcon}
            {directionLabel}
          </span>
          {communication.subject && (
            <span className="text-muted-foreground text-xs truncate">
              &bull; {communication.subject}
            </span>
          )}
        </div>

        {communication.content && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
            {communication.content}
          </p>
        )}

        {communication.outcome && (
          <p className="text-sm text-muted-foreground mt-1 line-clamp-1 italic">
            {communication.outcome}
          </p>
        )}

        <div className="flex items-center gap-2 mt-1.5 text-xs text-muted-foreground">
          <span>
            {format(new Date(communication.communicatedAt), "dd/MM/yyyy HH:mm", { locale: he })}
          </span>
          {communication.createdBy && (
            <span>
              &bull; {communication.createdBy.name}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
