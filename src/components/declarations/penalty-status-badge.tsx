"use client";

import { Badge } from "@/components/ui/badge";
import { PENALTY } from "@/lib/constants/hebrew";
import { cn } from "@/lib/utils";

export type PenaltyStatus =
  | "received"
  | "appeal_submitted"
  | "cancelled"
  | "paid_by_client"
  | "paid_by_office";

const STATUS_COLORS: Record<PenaltyStatus, string> = {
  received: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  appeal_submitted:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  paid_by_client:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  paid_by_office:
    "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
};

interface PenaltyStatusBadgeProps {
  status: PenaltyStatus | null | undefined;
  className?: string;
}

export function PenaltyStatusBadge({
  status,
  className,
}: PenaltyStatusBadgeProps) {
  if (!status) return null;

  const label = PENALTY.status[status];
  const colorClass = STATUS_COLORS[status];

  return (
    <Badge variant="outline" className={cn(colorClass, "border-0", className)}>
      {label}
    </Badge>
  );
}
