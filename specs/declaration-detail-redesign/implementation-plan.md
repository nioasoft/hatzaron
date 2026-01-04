# Implementation Plan: עיצוב מחדש דף פרטי הצהרה

## Overview

עיצוב מחדש של דף פרטי ההצהרה עם תעדוף מידע משרדי, Timeline מאוחד, ו-Sidebar מצומצם.

---

## Phase 1: כרטיס סטטוס משרד

יצירת קומפוננטה חדשה שמאחדת דדליינים + רו"ח אחראי + קנסות

### Tasks

- [ ] יצירת קומפוננטת `office-status-card.tsx`
- [ ] הוספת תצוגת דדליינים עם ספירת ימים
- [ ] שילוב `AssignAccountantSelect` הקיים
- [ ] שילוב אזור קנסות conditional

### Technical Details

**קובץ חדש:** `src/components/declarations/office-status-card.tsx`

**Props interface:**
```typescript
interface OfficeStatusCardProps {
  declarationId: string
  taxAuthorityDueDate: Date | null
  internalDueDate: Date | null
  assignedTo: string | null
  accountants: Array<{ id: string; name: string }>
  isAdmin: boolean
  wasSubmittedLate?: boolean
  penaltyAmount?: number
  penaltyStatus?: string
}
```

**מבנה התצוגה:**
```
┌─────────────────────────────────────────────────────┐
│ סטטוס וניהול                                         │
├─────────────────────────────────────────────────────┤
│ ┌─────────────────┐  ┌─────────────────┐            │
│ │ דדליין רשות     │  │ דדליין פנימי    │            │
│ │ 20/02/2026      │  │ לא הוגדר        │            │
│ │ ⏰ עוד 47 ימים   │  │                 │            │
│ └─────────────────┘  └─────────────────┘            │
│                                                     │
│ רו"ח אחראי: [AssignAccountantSelect]                │
│                                                     │
│ ⚠️ [אזור קנסות - conditional]                       │
└─────────────────────────────────────────────────────┘
```

**חישוב ימים שנותרו:**
```typescript
import { differenceInDays, isPast } from "date-fns"

function getDaysRemaining(deadline: Date | null) {
  if (!deadline) return null
  const days = differenceInDays(deadline, new Date())
  return {
    days,
    isOverdue: days < 0,
    isUrgent: days <= 7 && days >= 0,
    label: days < 0 ? `איחור של ${Math.abs(days)} ימים` : `עוד ${days} ימים`
  }
}
```

**צבעים לדדליינים:**
- אדום: `isPast` או פחות מ-0 ימים
- כתום: 1-7 ימים
- ירוק: 8+ ימים
- אפור: לא הוגדר

---

## Phase 2: Timeline מאוחד

יצירת קומפוננטה שמאחדת היסטוריית סטטוסים + תקשורת

### Tasks

- [ ] הוספת server action `getUnifiedHistory`
- [ ] יצירת קומפוננטת `unified-timeline.tsx`
- [ ] הוספת לוגיקת "הצג עוד" עם state
- [ ] הבחנה ויזואלית בין סוגי אירועים

### Technical Details

**Server Action חדש:** `src/app/dashboard/declarations/actions.ts`

```typescript
export type UnifiedHistoryEntry = {
  id: string
  type: 'status_change' | 'communication'
  timestamp: Date
  // For status changes
  fromStatus?: string
  toStatus?: string
  statusNotes?: string
  changedBy?: { name: string } | null
  isSystemChange?: boolean
  // For communications
  communicationType?: 'phone_call' | 'whatsapp' | 'note' | 'letter'
  direction?: 'outbound' | 'inbound'
  subject?: string
  content?: string
  outcome?: string
  createdBy?: { name: string } | null
}

export async function getUnifiedHistory(declarationId: string): Promise<UnifiedHistoryEntry[]> {
  // Fetch both status history and communications
  // Merge and sort by timestamp descending
}
```

**קובץ חדש:** `src/components/declarations/unified-timeline.tsx`

**Props interface:**
```typescript
interface UnifiedTimelineProps {
  declarationId: string
  initialLimit?: number // default: 3
}
```

**סיווג סטטוסים:**
```typescript
const OFFICE_STATUSES = ['reviewing', 'in_preparation', 'pending_approval', 'submitted', 'completed']
const CLIENT_STATUSES = ['sent', 'in_progress', 'waiting_documents', 'documents_received']

function isOfficeStatus(status: string): boolean {
  return OFFICE_STATUSES.includes(status)
}
```

**צבעים:**
- שינוי סטטוס משרד: `bg-primary/10 text-primary` (כחול)
- שינוי סטטוס לקוח: `bg-muted text-muted-foreground` (אפור)
- תקשורת:
  - phone_call: `bg-blue-100 text-blue-700`
  - whatsapp: `bg-green-100 text-green-700`
  - note: `bg-yellow-100 text-yellow-700`
  - letter: `bg-purple-100 text-purple-700`

**אייקונים:**
```typescript
import { Phone, MessageCircle, StickyNote, Mail, ArrowLeftRight, Bot, User } from "lucide-react"

const TYPE_ICONS = {
  status_change_office: ArrowLeftRight, // or custom icon
  status_change_client: ArrowLeftRight,
  phone_call: Phone,
  whatsapp: MessageCircle,
  note: StickyNote,
  letter: Mail,
}
```

**Empty state:**
```tsx
<div className="text-center py-6 text-muted-foreground">
  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
  <p>אין היסטוריה עדיין</p>
</div>
```

---

## Phase 3: עדכון דף ההצהרה

החלפת המבנה הנוכחי במבנה החדש

### Tasks

- [ ] הסרת imports ישנים (StatusHistoryTimeline, CommunicationHistoryCard נפרדים)
- [ ] הוספת imports חדשים (OfficeStatusCard, UnifiedTimeline)
- [ ] עדכון Main content עם הסדר החדש
- [ ] צמצום Sidebar (רק פורטל + ת.ז.)
- [ ] בדיקת תאימות RTL ו-mobile

### Technical Details

**קובץ:** `src/app/dashboard/declarations/[id]/page.tsx`

**מבנה חדש:**
```tsx
<div className="grid gap-6 lg:grid-cols-3">
  {/* Main Content - 2/3 */}
  <div className="space-y-6 lg:col-span-2">
    {/* 1. Documents Card */}
    <Card>...</Card>

    {/* 2. Office Status Card (NEW) */}
    <OfficeStatusCard
      declarationId={declaration.id}
      taxAuthorityDueDate={declaration.taxAuthorityDueDate}
      internalDueDate={declaration.internalDueDate}
      assignedTo={declaration.assignedTo}
      accountants={accountants}
      isAdmin={isAdmin}
      wasSubmittedLate={declaration.wasSubmittedLate}
      penaltyAmount={declaration.penaltyAmount}
      penaltyStatus={declaration.penaltyStatus}
    />

    {/* 3. Unified Timeline (NEW) */}
    <Card>
      <CardHeader>
        <CardTitle>היסטוריה</CardTitle>
      </CardHeader>
      <CardContent>
        <UnifiedTimeline declarationId={declaration.id} />
      </CardContent>
    </Card>
  </div>

  {/* Sidebar - 1/3 */}
  <div className="space-y-6">
    {/* Portal Link */}
    {declaration.publicToken && (
      <Card>
        <CardHeader><CardTitle>פורטל לקוח</CardTitle></CardHeader>
        <CardContent>
          <PortalLinkButton token={declaration.publicToken} />
        </CardContent>
      </Card>
    )}

    {/* Client ID */}
    <Card>
      <CardHeader><CardTitle>פרטי לקוח</CardTitle></CardHeader>
      <CardContent>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">ת.ז.</span>
          <span dir="ltr">{declaration.client.idNumber || "-"}</span>
        </div>
      </CardContent>
    </Card>
  </div>
</div>
```

**הסרות:**
- לא לייבא `StatusHistoryTimeline` ו-`CommunicationHistoryCard` בנפרד
- להסיר את כרטיסי "תאריכים" ו"רו״ח אחראי" מה-sidebar (עברו ל-OfficeStatusCard)

**להשאיר:**
- Header עם שם לקוח, סטטוס, פרטי התקשרות
- כפתורי פעולה (ערוך, תקשורת, תזכורות)

---

## Phase 4: סגנון ופוליש

שיפורים ויזואליים וטיפול במקרי קצה

### Tasks

- [ ] הוספת animations למעברים
- [ ] טיפול ב-loading states
- [ ] בדיקת responsive design
- [ ] הרצת lint ו-typecheck

### Technical Details

**Loading skeleton ל-UnifiedTimeline:**
```tsx
function TimelineSkeleton() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
```

**Animation לכפתור "הצג עוד":**
```tsx
<Button
  variant="ghost"
  onClick={() => setShowAll(!showAll)}
  className="w-full transition-all"
>
  {showAll ? "הצג פחות" : `הצג עוד ${remaining}`}
  <ChevronDown className={cn(
    "h-4 w-4 ms-2 transition-transform",
    showAll && "rotate-180"
  )} />
</Button>
```

**פקודות בדיקה:**
```bash
pnpm run lint
pnpm run typecheck
```
