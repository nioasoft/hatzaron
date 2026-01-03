"use client"

import { Card, CardContent } from "@/components/ui/card"
import { DASHBOARD_ENHANCED } from "@/lib/constants/hebrew"
import { DeclarationStats } from "@/app/dashboard/declarations/actions"
import {
  FileText,
  AlertCircle,
  Clock,
  Hourglass,
  Send,
  Loader2,
  CheckCircle,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface DeclarationStatsCardsProps {
  stats: DeclarationStats
}

type ColorKey = "default" | "red" | "orange" | "blue" | "green"

const STATS_CONFIG: Array<{
  key: keyof DeclarationStats
  icon: typeof FileText
  color: ColorKey
}> = [
  { key: "total", icon: FileText, color: "default" },
  { key: "critical", icon: AlertCircle, color: "red" },
  { key: "urgent", icon: Clock, color: "orange" },
  { key: "waiting", icon: Hourglass, color: "default" },
  { key: "sent", icon: Send, color: "blue" },
  { key: "inProgress", icon: Loader2, color: "default" },
  { key: "submitted", icon: CheckCircle, color: "green" },
]

const COLOR_CLASSES = {
  default: {
    bg: "bg-muted/50",
    icon: "text-muted-foreground",
    text: "text-foreground",
  },
  red: {
    bg: "bg-red-50 dark:bg-red-950/30",
    icon: "text-red-600 dark:text-red-400",
    text: "text-red-700 dark:text-red-300",
  },
  orange: {
    bg: "bg-orange-50 dark:bg-orange-950/30",
    icon: "text-orange-600 dark:text-orange-400",
    text: "text-orange-700 dark:text-orange-300",
  },
  blue: {
    bg: "bg-blue-50 dark:bg-blue-950/30",
    icon: "text-blue-600 dark:text-blue-400",
    text: "text-blue-700 dark:text-blue-300",
  },
  green: {
    bg: "bg-green-50 dark:bg-green-950/30",
    icon: "text-green-600 dark:text-green-400",
    text: "text-green-700 dark:text-green-300",
  },
}

export function DeclarationStatsCards({ stats }: DeclarationStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
      {STATS_CONFIG.map((config) => {
        const Icon = config.icon
        const colors = COLOR_CLASSES[config.color]
        const label = DASHBOARD_ENHANCED.stats[config.key]
        const value = stats[config.key]

        return (
          <Card
            key={config.key}
            className={cn("border-0 shadow-sm", colors.bg)}
          >
            <CardContent className="flex flex-col items-center justify-center p-4">
              <Icon className={cn("mb-2 h-5 w-5", colors.icon)} />
              <span className={cn("text-2xl font-bold", colors.text)}>
                {value}
              </span>
              <span className="text-muted-foreground mt-1 text-xs">
                {label}
              </span>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
