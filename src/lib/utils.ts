import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a date to Hebrew locale string
 * Supports both Date objects and ISO date strings
 */
export function formatDate(date: Date | string, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  return new Intl.DateTimeFormat("he-IL", {
    day: "numeric",
    month: "short",
    year: "numeric",
    ...options,
  }).format(dateObj)
}

/**
 * Format a date to Hebrew locale with long month name
 */
export function formatDateLong(date: Date | string): string {
  return formatDate(date, { month: "long" })
}

/**
 * Format a number as Israeli currency (ILS)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("he-IL", {
    style: "currency",
    currency: "ILS",
    maximumFractionDigits: 0,
  }).format(amount)
}
