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

/**
 * Calculate the number of days remaining until a deadline
 * Returns negative numbers for overdue, 0 for today, positive for future
 */
export function calculateDaysRemaining(
  deadline: Date | string | null
): number | null {
  if (!deadline) return null;
  const deadlineDate =
    typeof deadline === "string" ? new Date(deadline) : new Date(deadline);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  deadlineDate.setHours(0, 0, 0, 0);
  return Math.ceil(
    (deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );
}

/**
 * Get the appropriate color class based on days remaining
 * Red for overdue/urgent, orange for soon, yellow for upcoming, green for plenty of time
 */
export function getDaysRemainingColor(days: number | null): string {
  if (days === null) return "text-muted-foreground";
  if (days < 0) return "text-red-700 dark:text-red-400 font-bold";
  if (days <= 7) return "text-red-600 dark:text-red-400";
  if (days <= 14) return "text-orange-600 dark:text-orange-400";
  if (days <= 30) return "text-yellow-600 dark:text-yellow-400";
  return "text-green-600 dark:text-green-400";
}

/**
 * Validate Israeli ID number (תעודת זהות)
 * Uses the official Luhn-like algorithm with alternating weights 1,2
 *
 * @param idNumber - The ID number to validate (can include non-digit characters)
 * @returns true if valid, false otherwise
 */
export function validateIsraeliId(idNumber: string): boolean {
  // Remove non-digit characters and trim
  const cleanId = idNumber.replace(/\D/g, "")

  // Must be between 1-9 digits (will be padded to 9)
  if (cleanId.length === 0 || cleanId.length > 9) {
    return false
  }

  // Pad with leading zeros to 9 digits
  const paddedId = cleanId.padStart(9, "0")

  // Calculate checksum using alternating weights 1,2,1,2...
  let sum = 0
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(paddedId.charAt(i), 10)
    const weight = (i % 2) + 1 // alternates: 1,2,1,2,1,2,1,2,1
    let product = digit * weight

    // If product > 9, sum its digits (equivalent to product - 9 for single-digit sums)
    if (product > 9) {
      product = Math.floor(product / 10) + (product % 10)
    }

    sum += product
  }

  // Valid if sum is divisible by 10
  return sum % 10 === 0
}

/**
 * Format Israeli phone number with dash (050-1234567)
 * Handles both 10-digit cell phones (05X) and landlines
 */
export function formatPhoneNumber(phone: string): string {
  const cleanPhone = phone.replace(/\D/g, "")

  if (cleanPhone.length === 10) {
    // Cell phone: 05X-XXXXXXX
    return `${cleanPhone.slice(0, 3)}-${cleanPhone.slice(3)}`
  } else if (cleanPhone.length === 9) {
    // Landline: 0X-XXXXXXX
    return `${cleanPhone.slice(0, 2)}-${cleanPhone.slice(2)}`
  }

  return cleanPhone
}
