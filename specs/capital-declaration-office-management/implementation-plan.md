# Implementation Plan: Capital Declaration Office Management

## Overview

מימוש מלא של מערכת ניהול הצהרות הון מצד המשרד, כולל 12 קומפוננטות חדשות ועדכונים לקבצים קיימים.

---

## Phase 1: Server Actions Infrastructure

תשתית הפונקציות בצד השרת לכל הפיצ'רים.

### Tasks

- [ ] Add `updateDeclarationStatus()` server action with history logging
- [ ] Add `getDeclarationStatusHistory()` server action
- [ ] Add `logCommunication()` server action
- [ ] Add `getCommunications()` server action
- [ ] Add `updatePenalty()` server action
- [ ] Add `getPenaltyDetails()` server action
- [ ] Add `getDeclarationStats()` server action for dashboard statistics
- [ ] Add `assignAccountant()` server action
- [ ] Add `getFirmAccountants()` server action
- [ ] Add `sendEmailReminder()` server action
- [ ] Enhance `getDeclarations()` with filters support (search, status, year, priority, assignedTo)

### Technical Details

**File:** `src/app/dashboard/declarations/actions.ts`

**Types to add:**
```typescript
export type DeclarationStatus =
  | "draft" | "sent" | "in_progress" | "waiting_documents"
  | "documents_received" | "reviewing" | "in_preparation"
  | "pending_approval" | "submitted" | "waiting"

export type StatusHistoryEntry = {
  id: string
  fromStatus: string | null
  toStatus: string
  notes: string | null
  changedBy: { id: string; name: string } | null
  changedAt: Date
}

export type CommunicationType = "letter" | "phone_call" | "whatsapp" | "note"
export type CommunicationDirection = "outbound" | "inbound"

export type DeclarationFilters = {
  search?: string
  status?: string
  taxYear?: number
  priority?: string
  assignedTo?: string
}

export type DeclarationStats = {
  total: number
  critical: number
  urgent: number
  waiting: number
  sent: number
  inProgress: number
  submitted: number
}
```

**updateDeclarationStatus implementation:**
```typescript
export async function updateDeclarationStatus(data: {
  declarationId: string
  newStatus: string
  notes?: string
}) {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return { success: false, error: "Unauthorized" }

  const firmId = (session.user as any).firmId

  // Get current status
  const current = await db.select({ status: declaration.status })
    .from(declaration)
    .where(eq(declaration.id, data.declarationId))
    .limit(1)

  // Insert history record
  await db.insert(declarationStatusHistory).values({
    declarationId: data.declarationId,
    firmId,
    fromStatus: current[0]?.status,
    toStatus: data.newStatus,
    notes: data.notes || null,
    changedBy: session.user.id,
  })

  // Update declaration
  await db.update(declaration)
    .set({ status: data.newStatus })
    .where(eq(declaration.id, data.declarationId))

  revalidatePath(`/dashboard/declarations/${data.declarationId}`)
  return { success: true }
}
```

**Schema references:**
- `declarationStatusHistory` table at `src/lib/schema.ts:215-225`
- `declarationCommunication` table at `src/lib/schema.ts:228-242`
- Penalty fields in `declaration` table at `src/lib/schema.ts:177-185`

---

## Phase 2: Hebrew Constants

הוספת קבועים בעברית לכל הטקסטים החדשים.

### Tasks

- [ ] Add `COMMUNICATION` constants (types, directions, form labels)
- [ ] Add `PENALTY` constants (statuses, form labels)
- [ ] Add `DASHBOARD` constants (stats labels, filter placeholders)
- [ ] Add `STATUS_MANAGEMENT` constants (dialog labels)

### Technical Details

**File:** `src/lib/constants/hebrew.ts`

```typescript
export const COMMUNICATION = {
  title: "תקשורת",
  types: {
    letter: "מכתב",
    phone_call: "שיחת טלפון",
    whatsapp: "וואטסאפ",
    note: "הערה",
  },
  directions: {
    outbound: "יוצאת",
    inbound: "נכנסת",
  },
  form: {
    type: "סוג תקשורת",
    direction: "כיוון",
    subject: "נושא",
    content: "תוכן",
    outcome: "תוצאה/סיכום",
    date: "תאריך ושעה",
    save: "שמור",
  },
  history: {
    title: "היסטוריית תקשורת",
    empty: "אין תקשורת מתועדת",
  },
  whatsapp: {
    sendReminder: "שלח תזכורת בוואטסאפ",
    messageTemplate: "שלום {name}, בנושא הצהרת הון לשנת {year} - להעלאת מסמכים: {link}",
  },
} as const

export const PENALTY = {
  title: "ניהול קנסות",
  status: {
    received: "התקבל קנס",
    appeal_submitted: "הוגש ערעור",
    cancelled: "בוטל",
    paid_by_client: "שולם ע\"י לקוח",
    paid_by_office: "שולם ע\"י משרד",
  },
  form: {
    amount: "סכום הקנס",
    receivedDate: "תאריך קבלה",
    notes: "הערות",
    appealDate: "תאריך ערעור",
    appealNotes: "פרטי הערעור",
    paidDate: "תאריך תשלום",
    paidAmount: "סכום ששולם",
    paidBy: "שולם על ידי",
    paidByOptions: { client: "לקוח", office: "משרד" },
  },
  lateSubmission: { indicator: "הוגש באיחור" },
} as const

export const DASHBOARD = {
  stats: {
    total: "סה״כ הצהרות",
    critical: "קריטי",
    urgent: "דחוף",
    waiting: "בהמתנה",
    sent: "נשלח",
    inProgress: "בתהליך",
    submitted: "הוגש",
  },
  filters: {
    allStatuses: "כל הסטטוסים",
    allYears: "כל השנים",
    allPriorities: "כל העדיפויות",
    allAccountants: "כל רואי החשבון",
    searchPlaceholder: "חיפוש לפי שם או אימייל...",
  },
  daysRemaining: {
    overdue: "עבר",
    days: "ימים",
    today: "היום",
  },
} as const
```

---

## Phase 3: Base Components

קומפוננטות בסיס פשוטות (badges, indicators).

### Tasks

- [ ] Create `penalty-status-badge.tsx` component
- [ ] Create `late-submission-indicator.tsx` component
- [ ] Add utility functions for days remaining calculation

### Technical Details

**File:** `src/components/declarations/penalty-status-badge.tsx`
```typescript
export type PenaltyStatus = "received" | "appeal_submitted" | "cancelled" | "paid_by_client" | "paid_by_office"

const STATUS_COLORS: Record<PenaltyStatus, string> = {
  received: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  appeal_submitted: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  cancelled: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200",
  paid_by_client: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  paid_by_office: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
}
```

**File:** `src/lib/utils.ts` - Add:
```typescript
export function calculateDaysRemaining(deadline: Date | string | null): number | null {
  if (!deadline) return null
  const deadlineDate = typeof deadline === 'string' ? new Date(deadline) : deadline
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  deadlineDate.setHours(0, 0, 0, 0)
  return Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
}

export function getDaysRemainingColor(days: number | null): string {
  if (days === null) return 'text-muted-foreground'
  if (days < 0) return 'text-red-700 dark:text-red-400 font-bold'
  if (days <= 7) return 'text-red-600 dark:text-red-400'
  if (days <= 14) return 'text-orange-600 dark:text-orange-400'
  if (days <= 30) return 'text-yellow-600 dark:text-yellow-400'
  return 'text-green-600 dark:text-green-400'
}
```

---

## Phase 4: Status Management Components [complex]

קומפוננטות לניהול סטטוסים.

### Tasks

- [ ] Create `status-change-dialog.tsx` component
  - [ ] Dropdown with all 10 statuses
  - [ ] Notes textarea
  - [ ] Loading state
  - [ ] Toast on success/error
- [ ] Create `status-history-timeline.tsx` component
  - [ ] Fetch history via server action
  - [ ] Display chronological timeline
  - [ ] User vs system icon
  - [ ] Hebrew date formatting

### Technical Details

**File:** `src/components/declarations/status-change-dialog.tsx`

Key props:
```typescript
interface StatusChangeDialogProps {
  declarationId: string
  currentStatus: string
  onStatusChanged?: () => void
  children?: React.ReactNode
}
```

Uses:
- `Dialog` from shadcn
- `Select` for status dropdown
- `Textarea` for notes
- `updateDeclarationStatus` server action
- `toast` from sonner

**File:** `src/components/declarations/status-history-timeline.tsx`

Server Component that:
- Calls `getDeclarationStatusHistory(declarationId)`
- Uses `formatDistanceToNow` from date-fns with Hebrew locale
- Icons: `User` for manual changes, `Bot` for automatic

---

## Phase 5: Communication Components [complex]

קומפוננטות לתיעוד תקשורת.

### Tasks

- [ ] Create `log-communication-dialog.tsx` component
  - [ ] Type selector (phone/whatsapp/note/letter)
  - [ ] Direction selector (inbound/outbound)
  - [ ] Subject, content, outcome fields
  - [ ] DateTime picker
- [ ] Create `communication-history-card.tsx` component
  - [ ] List of communications
  - [ ] Icons per type
  - [ ] Direction indicators
- [ ] Create `whatsapp-reminder-button.tsx` component
  - [ ] Generate WhatsApp link with message
  - [ ] Auto-log communication on click

### Technical Details

**File:** `src/components/declarations/log-communication-dialog.tsx`

Form state:
```typescript
const [formData, setFormData] = useState({
  type: "phone_call" as CommunicationType,
  direction: "outbound" as CommunicationDirection,
  subject: "",
  content: "",
  outcome: "",
  communicatedAt: new Date().toISOString().slice(0, 16),
})
```

**File:** `src/components/declarations/whatsapp-reminder-button.tsx`

WhatsApp link generation:
```typescript
const generateWhatsAppLink = () => {
  const cleanPhone = clientPhone.replace(/[\s\-()]/g, "")
  const phoneWithCode = cleanPhone.startsWith("+")
    ? cleanPhone.slice(1)
    : cleanPhone.startsWith("0")
      ? "972" + cleanPhone.slice(1)
      : "972" + cleanPhone

  const message = COMMUNICATION.whatsapp.messageTemplate
    .replace("{name}", clientName)
    .replace("{year}", year.toString())
    .replace("{link}", portalUrl)

  return `https://wa.me/${phoneWithCode}?text=${encodeURIComponent(message)}`
}
```

---

## Phase 6: Penalty Management Component

קומפוננטת ניהול קנסות.

### Tasks

- [ ] Create `penalty-management-card.tsx` component
  - [ ] Basic info section (amount, status, received date)
  - [ ] Appeal section (conditional display)
  - [ ] Payment section (conditional display)
  - [ ] Save button with loading state

### Technical Details

**File:** `src/components/declarations/penalty-management-card.tsx`

Form sections:
1. **Basic**: penaltyAmount, penaltyStatus, penaltyReceivedDate, penaltyNotes
2. **Appeal** (shown when status = appeal_submitted): appealDate, appealNotes
3. **Payment** (shown when status = paid_*): penaltyPaidDate, penaltyPaidAmount, penaltyPaidBy

Card styling: `border-red-200 dark:border-red-900` for visual distinction

---

## Phase 7: Dashboard Components [complex]

קומפוננטות לדשבורד משופר.

### Tasks

- [ ] Create `declaration-stats-cards.tsx` component
  - [ ] 7 stat cards in responsive grid
  - [ ] Color-coded by type
  - [ ] Icons per stat
- [ ] Create `declaration-filters.tsx` component
  - [ ] Search input with debounce
  - [ ] Status dropdown
  - [ ] Year dropdown
  - [ ] Priority dropdown
  - [ ] Accountant dropdown (admin only)
  - [ ] URL-based state management
- [ ] Update `declaration-table.tsx` to 12 columns
  - [ ] Priority selector (admin only)
  - [ ] Days remaining indicators
  - [ ] Document progress
  - [ ] Penalty status column
  - [ ] Last communication column
  - [ ] Row click navigation

### Technical Details

**File:** `src/components/declarations/declaration-stats-cards.tsx`

Grid layout: `grid-cols-2 sm:grid-cols-4 lg:grid-cols-7`

Cards array:
```typescript
const STATS_CONFIG = [
  { key: 'total', label: 'סה"כ', icon: FileText, color: 'default' },
  { key: 'critical', label: 'קריטי', icon: AlertCircle, color: 'red' },
  { key: 'urgent', label: 'דחוף', icon: Clock, color: 'orange' },
  { key: 'waiting', label: 'בהמתנה', icon: Hourglass, color: 'default' },
  { key: 'sent', label: 'נשלח', icon: Send, color: 'blue' },
  { key: 'inProgress', label: 'בתהליך', icon: Loader, color: 'default' },
  { key: 'submitted', label: 'הוגש', icon: CheckCircle, color: 'green' },
]
```

**File:** `src/components/declarations/declaration-filters.tsx`

Uses `useSearchParams` and `useRouter` for URL state.
Debounce search with 300ms delay.

**Table columns (12):**
1. Priority (dropdown for admin)
2. Client + contact
3. Tax year
4. Status badge
5. Assigned accountant
6. Tax authority deadline + days (color-coded)
7. Internal deadline + days
8. Document progress (X/6)
9. Late indicator
10. Penalty status
11. Last communication
12. Actions

---

## Phase 8: Assignment & Email Components

קומפוננטות להקצאה ותזכורות.

### Tasks

- [ ] Create `assign-accountant-select.tsx` component
  - [ ] Dropdown with firm accountants
  - [ ] Optimistic update
  - [ ] Admin-only visibility
- [ ] Create `send-reminder-dialog.tsx` component
  - [ ] Reminder type selector
  - [ ] Message preview
  - [ ] Send button
  - [ ] Auto-log to communication history

### Technical Details

**File:** `src/components/declarations/assign-accountant-select.tsx`

Props:
```typescript
interface AssignAccountantSelectProps {
  declarationId: string
  currentAssignee: string | null
  accountants: Array<{ id: string; name: string }>
  isAdmin: boolean
}
```

**File:** `src/components/declarations/send-reminder-dialog.tsx`

Reminder types:
- `documents_request` - בקשה להעלאת מסמכים
- `status_update` - עדכון סטטוס
- `general` - הודעה כללית

Email templates include portal link and dynamic content.

---

## Phase 9: Portal Automatic Transitions

מעברי סטטוס אוטומטיים בפורטל.

### Tasks

- [ ] Update `getPortalData()` for first access transition (sent → in_progress)
- [ ] Add `markDocumentsComplete()` server action
- [ ] Update wizard to call `markDocumentsComplete` on finish
- [ ] Log all automatic transitions to history

### Technical Details

**File:** `src/app/portal/actions.ts`

```typescript
// In getPortalData:
if (isFirstAccess && currentStatus === "sent") {
  await db.update(declaration)
    .set({
      portalAccessedAt: new Date(),
      portalAccessCount: 1,
      status: "in_progress"
    })
    .where(eq(declaration.id, declarationId))

  // Log to history with changedBy: null (system)
  await db.insert(declarationStatusHistory).values({
    declarationId,
    firmId,
    fromStatus: "sent",
    toStatus: "in_progress",
    notes: "הלקוח צפה בפורטל לראשונה",
    changedBy: null,
  })
}
```

**File:** `src/components/declarations/wizard/index.tsx`

Add `publicToken` prop and call `markDocumentsComplete(declarationId, publicToken)` on finish.

---

## Phase 10: Page Integration

אינטגרציה של כל הקומפוננטות בדפים.

### Tasks

- [ ] Update declaration detail page with all new components
- [ ] Update dashboard page with stats, filters, enhanced table
- [ ] Add new components to declaration table rows
- [ ] Test RTL layout for all components

### Technical Details

**File:** `src/app/dashboard/declarations/[id]/page.tsx`

Add imports and integrate:
- StatusChangeDialog (in header, wrapping status badge)
- StatusHistoryTimeline (sidebar)
- CommunicationHistoryCard (sidebar)
- LogCommunicationDialog (header button)
- WhatsAppReminderButton (header)
- AssignAccountantSelect (info card)
- SendReminderDialog (header button)
- PenaltyManagementCard (shown if wasSubmittedLate && status === 'submitted')

**File:** `src/app/dashboard/declarations/page.tsx`

Layout structure:
```
+--------------------------------------------------+
| Page Header (title + "New Declaration" button)   |
+--------------------------------------------------+
| DeclarationStatsCards (7 cards)                  |
+--------------------------------------------------+
| DeclarationFilters (search + dropdowns)          |
+--------------------------------------------------+
| DeclarationTable (12 columns, enhanced)          |
+--------------------------------------------------+
```

Data fetching:
```typescript
const [declarations, stats, accountants] = await Promise.all([
  getDeclarations(filters),
  getDeclarationStats(),
  getFirmAccountants(),
])
```
