# Implementation Plan: Super User Admin System

## Overview

מערכת Super User/Admin מלאה עבור ניהול מערכת הצהרות ההון. כוללת דשבורד admin נפרד, ניהול משרדים, ו-Impersonation להתחברות כמשרד.

---

## Phase 1: Auth System Setup

הגדרת BetterAuth Admin Plugin והרשאות admin.

### Tasks

- [ ] Add BetterAuth admin plugin configuration to `src/lib/auth.ts`
- [ ] Add adminClient plugin to `src/lib/auth-client.ts` and export admin actions
- [ ] Add `SUPER_ADMIN_EMAIL` to `.env.example` with documentation
- [ ] Run BetterAuth migration to add role/ban fields to database
- [ ] Create `src/lib/admin.ts` with helper functions for admin checks

### Technical Details

**File: `src/lib/auth.ts`** - Add admin plugin:
```typescript
import { admin } from "better-auth/plugins"

export const auth = betterAuth({
  // ... existing config
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
      impersonationSessionDuration: 3600, // 1 hour
      allowImpersonatingAdmins: false,
    }),
  ],
})
```

**File: `src/lib/auth-client.ts`** - Add adminClient:
```typescript
import { adminClient } from "better-auth/client/plugins"

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [adminClient()],
})

export const adminActions = authClient.admin
```

**File: `.env`** - Add:
```env
SUPER_ADMIN_EMAIL=your-email@domain.com
```

**CLI command for migration:**
```bash
npx @better-auth/cli migrate
```
This adds to user table: `role`, `banned`, `banReason`, `banExpires`
This adds to session table: `impersonatedBy`

**File: `src/lib/admin.ts`** - Helper functions:
```typescript
import { headers } from "next/headers"
import { auth } from "./auth"

export async function isAdmin(): Promise<boolean> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return false
  const user = session.user as { role?: string }
  return user.role === "admin"
}

export async function requireAdmin() {
  const admin = await isAdmin()
  if (!admin) throw new Error("Unauthorized: Admin access required")
}

export async function getImpersonationState() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) return null
  const sessionData = session.session as { impersonatedBy?: string }
  return {
    isImpersonating: !!sessionData.impersonatedBy,
    originalAdminId: sessionData.impersonatedBy,
  }
}
```

---

## Phase 2: Admin Layout & Navigation

יצירת layout, sidebar, ו-header לאזור ה-admin.

### Tasks

- [ ] Create `src/app/admin/layout.tsx` with auth check and admin role verification
- [ ] Create `src/components/admin/sidebar.tsx` based on existing dashboard sidebar
- [ ] Create `src/components/admin/header.tsx` based on existing dashboard header
- [ ] Add Hebrew constants for admin section to `src/lib/constants/hebrew.ts`

### Technical Details

**File: `src/app/admin/layout.tsx`:**
```typescript
import { headers } from "next/headers"
import { redirect } from "next/navigation"
import { AdminHeader } from "@/components/admin/header"
import { AdminSidebar } from "@/components/admin/sidebar"
import { auth } from "@/lib/auth"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) redirect("/login")

  const user = session.user as { role?: string }
  if (user.role !== "admin") redirect("/dashboard")

  return (
    <div className="min-h-screen bg-background">
      <AdminSidebar />
      <div className="lg:ps-64">
        <AdminHeader />
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
```

**Admin Navigation Items:**
```typescript
const ADMIN_NAV_ITEMS = [
  { href: "/admin", label: ADMIN.nav.dashboard, icon: LayoutDashboard, exact: true },
  { href: "/admin/firms", label: ADMIN.nav.firms, icon: Building2 },
  { href: "/admin/settings", label: ADMIN.nav.settings, icon: Settings },
]
```

**Hebrew Constants to add to `src/lib/constants/hebrew.ts`:**
```typescript
export const ADMIN = {
  title: "ניהול מערכת",
  nav: {
    dashboard: "סקירה כללית",
    firms: "משרדים",
    settings: "הגדרות",
  },
  stats: {
    totalFirms: "סה״כ משרדים",
    activeSubscriptions: "מנויים פעילים",
    monthlyRevenue: "הכנסה חודשית",
    trialUsers: "בתקופת ניסיון",
  },
  firms: {
    title: "ניהול משרדים",
    subtitle: "ניהול משרדי רואי חשבון",
    tableHeaders: {
      firm: "משרד",
      email: "אימייל",
      plan: "תוכנית",
      status: "סטטוס",
      registeredAt: "תאריך הרשמה",
      actions: "פעולות",
    },
    status: { active: "פעיל", suspended: "מושעה" },
    actions: {
      view: "צפייה בפרטים",
      suspend: "השעה משרד",
      activate: "הפעל משרד",
      delete: "מחק משרד",
      impersonate: "התחבר כמשרד",
    },
  },
  impersonation: {
    banner: "מחובר כ:",
    exit: "יציאה",
    confirmTitle: "התחברות כמשרד",
    confirmDescription: "אתה עומד להתחבר כמשרד זה. תוכל לראות את לוח הבקרה שלהם ולבצע פעולות בשמם.",
    confirm: "התחבר",
    cancel: "ביטול",
  },
} as const
```

---

## Phase 3: Admin Dashboard Page

דף הבית של האדמין עם סטטיסטיקות וטבלת משרדים אחרונים.

### Tasks

- [ ] Create `src/app/admin/page.tsx` with stats cards and recent firms table
- [ ] Create `src/app/admin/loading.tsx` with skeleton loading state
- [ ] Create `src/app/admin/error.tsx` with error boundary

### Technical Details

**File: `src/app/admin/page.tsx`:**
- Use existing `StatCard` component from `src/components/dashboard/stat-card.tsx`
- Query users table for firms count: `db.select().from(user).where(ne(user.role, "admin"))`
- Stats to display:
  - Total firms (real count from DB)
  - Active subscriptions (mock: 45)
  - Monthly revenue (mock: ₪11,205)
  - Trial users (mock: 8)
- Recent firms table: last 5 registered (order by createdAt DESC)

**Icons to use:**
- Building2 for firms
- Users for subscriptions
- TrendingUp for revenue
- CreditCard for trial

---

## Phase 4: Firms List Page

דף רשימת כל המשרדים עם חיפוש ופעולות.

### Tasks

- [ ] Create `src/app/admin/firms/page.tsx` with firms table
- [ ] Create `src/app/admin/firms/loading.tsx` with skeleton
- [ ] Create `src/components/admin/firms/firm-table.tsx` table component
- [ ] Create `src/components/admin/firms/firm-status-badge.tsx` status badge component

### Technical Details

**Table columns:**
1. שם המשרד (with Building2 icon)
2. אימייל (dir="ltr")
3. תוכנית (badge: basic/professional/enterprise)
4. סטטוס (badge: active=green, suspended=red)
5. תאריך הרשמה (formatted: toLocaleDateString("he-IL"))
6. פעולות (DropdownMenu)

**Query:**
```typescript
const firms = await db
  .select()
  .from(user)
  .where(ne(user.role, "admin"))
  .orderBy(desc(user.createdAt))
```

**Status badge colors:**
```typescript
const STATUS_COLORS = {
  active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  suspended: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
}
```

---

## Phase 5: Firm Detail Page

דף פרטי משרד עם כל המידע ופעולות.

### Tasks

- [ ] Create `src/app/admin/firms/[userId]/page.tsx` with firm details
- [ ] Create `src/app/admin/firms/[userId]/loading.tsx` with skeleton
- [ ] Create `src/components/admin/ban-user-button.tsx` for suspend/activate

### Technical Details

**File: `src/app/admin/firms/[userId]/page.tsx`:**
- Params type: `params: Promise<{ userId: string }>`
- Query: `db.select().from(user).where(eq(user.id, userId)).limit(1)`
- Use `notFound()` if firm not found

**Page layout (2 columns on desktop):**
- Column 1: Firm info card (name, email, registration date, status)
- Column 2: Subscription card (plan, status, next billing - mock data)

**Action buttons:**
- ImpersonateButton (from Phase 6)
- BanUserButton (toggle suspend/activate)

**BanUserButton component:**
```typescript
"use client"
interface BanUserButtonProps {
  userId: string
  isBanned: boolean
}
// Uses adminActions.banUser({ userId }) or adminActions.unbanUser({ userId })
```

---

## Phase 6: Impersonation System [complex]

מערכת Impersonation מלאה עם באנר והחזרה.

### Tasks

- [ ] Create `src/components/admin/impersonate-button.tsx` with confirmation dialog
- [ ] Create `src/components/admin/impersonation-banner.tsx` yellow banner component
- [ ] Update `src/app/dashboard/layout.tsx` to show impersonation banner when active
- [ ] Add padding adjustment to dashboard layout when banner is visible

### Technical Details

**File: `src/components/admin/impersonate-button.tsx`:**
```typescript
"use client"
import { adminActions } from "@/lib/auth-client"

export function ImpersonateButton({ userId, userName }: { userId: string; userName: string }) {
  const handleImpersonate = async () => {
    await adminActions.impersonateUser({ userId })
    router.push("/dashboard")
    router.refresh()
  }
  // AlertDialog with confirmation
}
```

**File: `src/components/admin/impersonation-banner.tsx`:**
```typescript
"use client"
export function ImpersonationBanner({ firmName, firmEmail }: Props) {
  const handleExit = async () => {
    await adminActions.stopImpersonating({})
    router.push("/admin/firms")
    router.refresh()
  }
  // Fixed yellow banner at top with firm info and exit button
}
```

**Banner styling:**
```typescript
className="fixed top-0 inset-x-0 z-50 bg-yellow-500 text-yellow-950 py-2 px-4"
```

**Dashboard layout update:**
```typescript
// In src/app/dashboard/layout.tsx
const impersonation = await getImpersonationState()

return (
  <div className="min-h-screen bg-background">
    {impersonation?.isImpersonating && (
      <ImpersonationBanner
        firmName={session.user.name || "Unknown"}
        firmEmail={session.user.email}
      />
    )}
    <Sidebar />
    <div className={`lg:ps-64 ${impersonation?.isImpersonating ? "pt-10" : ""}`}>
      {/* ... */}
    </div>
  </div>
)
```

---

## Phase 7: Polish & Verification

בדיקות וסיום.

### Tasks

- [ ] Run lint and typecheck to ensure no errors
- [ ] Manually set first user as admin in database for testing
- [ ] Verify admin dashboard loads correctly
- [ ] Verify impersonation flow works end-to-end

### Technical Details

**Commands to run:**
```bash
pnpm run lint
pnpm run typecheck
```

**Manual DB update to set admin role (one-time):**
```sql
UPDATE "user" SET role = 'admin' WHERE email = 'your-super-admin-email@domain.com';
```

Or via Drizzle:
```typescript
await db.update(user).set({ role: "admin" }).where(eq(user.email, process.env.SUPER_ADMIN_EMAIL))
```

---

## File Structure Summary

```
src/
├── app/admin/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── loading.tsx
│   ├── error.tsx
│   └── firms/
│       ├── page.tsx
│       ├── loading.tsx
│       └── [userId]/
│           ├── page.tsx
│           └── loading.tsx
├── components/admin/
│   ├── sidebar.tsx
│   ├── header.tsx
│   ├── impersonate-button.tsx
│   ├── impersonation-banner.tsx
│   ├── ban-user-button.tsx
│   └── firms/
│       ├── firm-table.tsx
│       └── firm-status-badge.tsx
└── lib/
    └── admin.ts
```

---

## Files to Modify

| File | Change |
|------|--------|
| `src/lib/auth.ts` | Add admin plugin |
| `src/lib/auth-client.ts` | Add adminClient + exports |
| `src/lib/constants/hebrew.ts` | Add ADMIN section |
| `src/app/dashboard/layout.tsx` | Add impersonation banner |
| `.env.example` | Add SUPER_ADMIN_EMAIL |
