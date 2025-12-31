import { Check, Circle } from "lucide-react"
import { cn } from "@/lib/utils"

export interface TimelineStep {
  id: string
  label: string
  status: "completed" | "current" | "upcoming"
  date?: string
}

interface TimelineProps {
  steps: TimelineStep[]
  className?: string
}

export function Timeline({ steps, className }: TimelineProps) {
  return (
    <div className={cn("relative", className)}>
      {steps.map((step, index) => (
        <div key={step.id} className="flex gap-4 pb-8 last:pb-0">
          {/* Timeline line */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2",
                step.status === "completed" &&
                  "border-primary bg-primary text-primary-foreground",
                step.status === "current" &&
                  "border-primary bg-background text-primary",
                step.status === "upcoming" &&
                  "border-muted-foreground/30 bg-background text-muted-foreground/30"
              )}
            >
              {step.status === "completed" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Circle className="h-3 w-3 fill-current" />
              )}
            </div>
            {index < steps.length - 1 && (
              <div
                className={cn(
                  "mt-2 h-full w-0.5 flex-1",
                  step.status === "completed"
                    ? "bg-primary"
                    : "bg-muted-foreground/30"
                )}
              />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pt-1">
            <p
              className={cn(
                "font-medium",
                step.status === "upcoming" && "text-muted-foreground"
              )}
            >
              {step.label}
            </p>
            {step.date && (
              <p className="text-sm text-muted-foreground" dir="ltr">
                {step.date}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
