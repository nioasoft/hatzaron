"use client"

import { useCallback, useEffect, useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { DECLARATIONS, DASHBOARD_ENHANCED } from "@/lib/constants/hebrew"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { Accountant } from "@/app/dashboard/declarations/actions"

interface DeclarationFiltersProps {
  accountants?: Accountant[]
  isAdmin?: boolean
  years?: number[]
  currentYear?: number
}

const STATUS_OPTIONS = [
  { value: "all", label: DASHBOARD_ENHANCED.filters.allStatuses },
  { value: "draft", label: DECLARATIONS.status.draft },
  { value: "sent", label: DECLARATIONS.status.sent },
  { value: "in_progress", label: DECLARATIONS.status.in_progress },
  { value: "waiting_documents", label: DECLARATIONS.status.waiting_documents },
  { value: "documents_received", label: DECLARATIONS.status.documents_received },
  { value: "reviewing", label: DECLARATIONS.status.reviewing },
  { value: "in_preparation", label: DECLARATIONS.status.in_preparation },
  { value: "pending_approval", label: DECLARATIONS.status.pending_approval },
  { value: "submitted", label: DECLARATIONS.status.submitted },
  { value: "waiting", label: DECLARATIONS.status.waiting },
]

const PRIORITY_OPTIONS = [
  { value: "all", label: DASHBOARD_ENHANCED.filters.allPriorities },
  { value: "critical", label: DASHBOARD_ENHANCED.stats.critical },
  { value: "urgent", label: DASHBOARD_ENHANCED.stats.urgent },
  { value: "normal", label: "רגיל" },
]

export function DeclarationFilters({
  accountants = [],
  isAdmin = false,
  years = [],
  currentYear = 2026,
}: DeclarationFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  // Local state for search (with debounce)
  const [searchValue, setSearchValue] = useState(
    searchParams.get("search") || ""
  )

  // Get current filter values from URL
  const status = searchParams.get("status") || "all"
  const year = searchParams.get("year") || "all"
  const priority = searchParams.get("priority") || "all"
  const assignedTo = searchParams.get("assignedTo") || "all"

  // Update URL with new params
  const updateFilters = useCallback(
    (key: string, value: string) => {
      startTransition(() => {
        const params = new URLSearchParams(searchParams.toString())
        if (value === "all" || value === "") {
          params.delete(key)
        } else {
          params.set(key, value)
        }
        router.push(`?${params.toString()}`, { scroll: false })
      })
    },
    [router, searchParams]
  )

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchValue !== (searchParams.get("search") || "")) {
        updateFilters("search", searchValue)
      }
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue, searchParams, updateFilters])

  // Clear all filters
  const clearFilters = () => {
    setSearchValue("")
    startTransition(() => {
      router.push("?", { scroll: false })
    })
  }

  const hasActiveFilters =
    searchValue ||
    status !== "all" ||
    year !== "all" ||
    priority !== "all" ||
    assignedTo !== "all"

  // Generate year options dynamically
  const yearOptions = years.length > 0
    ? years
    : Array.from({ length: 5 }, (_, i) => currentYear - i)

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        {/* Search Input */}
        <div className="relative min-w-[200px] flex-1">
          <Search className="text-muted-foreground absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2" />
          <Input
            type="text"
            placeholder={DASHBOARD_ENHANCED.filters.searchPlaceholder}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            className={cn("pe-3 ps-10", isPending && "opacity-70")}
          />
        </div>

        {/* Status Filter */}
        <Select
          value={status}
          onValueChange={(value) => updateFilters("status", value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder={DASHBOARD_ENHANCED.filters.allStatuses} />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Year Filter */}
        <Select
          value={year}
          onValueChange={(value) => updateFilters("year", value)}
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder={DASHBOARD_ENHANCED.filters.allYears} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              {DASHBOARD_ENHANCED.filters.allYears}
            </SelectItem>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter (admin only) */}
        {isAdmin && (
          <Select
            value={priority}
            onValueChange={(value) => updateFilters("priority", value)}
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue
                placeholder={DASHBOARD_ENHANCED.filters.allPriorities}
              />
            </SelectTrigger>
            <SelectContent>
              {PRIORITY_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Accountant Filter (admin only) */}
        {isAdmin && accountants.length > 0 && (
          <Select
            value={assignedTo}
            onValueChange={(value) => updateFilters("assignedTo", value)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue
                placeholder={DASHBOARD_ENHANCED.filters.allAccountants}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">
                {DASHBOARD_ENHANCED.filters.allAccountants}
              </SelectItem>
              {accountants.map((accountant) => (
                <SelectItem key={accountant.id} value={accountant.id}>
                  {accountant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        {/* Clear Filters Button */}
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-10 gap-1 px-3"
          >
            <X className="h-4 w-4" />
            נקה
          </Button>
        )}
      </div>
    </div>
  )
}
