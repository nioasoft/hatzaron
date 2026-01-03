"use client";

import { AlertTriangle } from "lucide-react";
import { PENALTY } from "@/lib/constants/hebrew";
import { cn } from "@/lib/utils";

interface LateSubmissionIndicatorProps {
  wasSubmittedLate: boolean | null | undefined;
  className?: string;
  showText?: boolean;
}

export function LateSubmissionIndicator({
  wasSubmittedLate,
  className,
  showText = true,
}: LateSubmissionIndicatorProps) {
  if (!wasSubmittedLate) return null;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 text-red-600 dark:text-red-400",
        className
      )}
    >
      <AlertTriangle className="h-4 w-4" />
      {showText && (
        <span className="text-sm font-medium">
          {PENALTY.lateSubmission.indicator}
        </span>
      )}
    </span>
  );
}
