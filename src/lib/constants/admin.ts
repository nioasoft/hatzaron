/**
 * Admin-specific constants for the admin section
 */

/**
 * Subscription plan color classes for badges
 */
export const PLAN_COLORS = {
  basic: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200",
  professional: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  enterprise: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
} as const

export type PlanType = keyof typeof PLAN_COLORS

/**
 * Plan display names in Hebrew
 */
export const PLAN_NAMES: Record<PlanType, string> = {
  basic: "בסיסי",
  professional: "מקצועי",
  enterprise: "ארגוני",
}

/**
 * Mock function to get a random plan
 * Will be replaced when subscription system is added
 */
export function getMockPlan(): PlanType {
  const plans: PlanType[] = ["basic", "professional", "enterprise"]
  const index = Math.floor(Math.random() * plans.length)
  return plans[index] ?? "basic"
}

/**
 * Get a consistent mock plan based on user ID
 * This ensures the same user always shows the same plan
 */
export function getMockPlanByUserId(userId: string): PlanType {
  const plans: PlanType[] = ["basic", "professional", "enterprise"]
  // Use simple hash of first char to get consistent result
  const charCode = userId.charCodeAt(0) || 0
  const index = charCode % plans.length
  return plans[index] ?? "professional"
}
