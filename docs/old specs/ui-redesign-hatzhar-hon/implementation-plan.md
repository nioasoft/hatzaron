# Implementation Plan: הצהר-הון UI Redesign

## Overview

Complete UI redesign transforming the existing boilerplate into a Hebrew RTL SaaS platform for managing wealth declarations. The implementation covers: foundation setup (RTL, fonts, colors), marketing site, accountant dashboard, declaration management, client management, settings, and white-labeled client portal.

---

## Phase 1: Foundation Setup

Set up RTL support, Hebrew fonts, and the new color palette.

### Tasks

- [ ] Update `src/app/layout.tsx` to add RTL support (`lang="he" dir="rtl"`)
- [ ] Add Hebrew fonts (Heebo from Google Fonts alongside Open Sans)
- [ ] Replace `src/app/globals.css` with the new color palette
- [ ] Create `src/components/rtl-provider.tsx` for RTL context
- [ ] Install required shadcn/ui components
- [ ] Create `src/lib/constants/hebrew.ts` for Hebrew text constants

### Technical Details

**Root Layout Changes (`src/app/layout.tsx`):**
```tsx
<html lang="he" dir="rtl">
```

**Google Fonts to add:**
```tsx
import { Heebo, Open_Sans } from 'next/font/google'

const heebo = Heebo({ subsets: ['hebrew', 'latin'] })
const openSans = Open_Sans({ subsets: ['hebrew', 'latin'] })
```

**shadcn/ui components to install:**
```bash
npx shadcn@latest add table tabs progress select checkbox radio-group switch calendar tooltip sheet breadcrumb alert command
```

**Color Palette (globals.css) - Key values:**
```css
/* Light Mode */
--primary: oklch(0.7500 0.1830 55.9340);  /* Orange/amber */
--secondary: oklch(0.1884 0.0128 248.5103);
--radius: 1.3rem;
--font-sans: Open Sans, Heebo, sans-serif;

/* Dark Mode */
--primary: oklch(0.6692 0.1607 245.0110);  /* Blue */
```

**Tailwind RTL utilities to use:**
- `ms-*` / `me-*` (margin-start/end) instead of `ml-*` / `mr-*`
- `ps-*` / `pe-*` (padding-start/end) instead of `pl-*` / `pr-*`
- `start-*` / `end-*` instead of `left-*` / `right-*`
- `text-start` / `text-end` instead of `text-left` / `text-right`

---

## Phase 2: Marketing Site

Build the public-facing marketing pages.

### Tasks

- [ ] Create marketing route group `src/app/(marketing)/layout.tsx`
- [ ] Build `src/components/layouts/marketing-header.tsx` (Hebrew navigation)
- [ ] Build `src/components/layouts/marketing-footer.tsx`
- [ ] Create landing page `src/app/(marketing)/page.tsx` [complex]
  - [ ] Hero section with headline and CTA
  - [ ] Pain points section (problems for accountants)
  - [ ] Features grid (4-6 features with icons)
  - [ ] How it works (3 steps)
  - [ ] CTA footer section
- [ ] Create pricing page `src/app/(marketing)/pricing/page.tsx`
- [ ] Create FAQ page `src/app/(marketing)/faq/page.tsx`
- [ ] Build `src/components/marketing/pricing-card.tsx`
- [ ] Build `src/components/marketing/feature-card.tsx`
- [ ] Move existing root page to marketing group

### Technical Details

**Marketing Layout Structure:**
```
src/app/(marketing)/
├── layout.tsx          # Header + Footer, no sidebar
├── page.tsx            # Landing page
├── pricing/page.tsx
└── faq/page.tsx
```

**Hero Section Copy (Hebrew):**
```
Headline: נהל הצהרות הון בקלות
Subheadline: פלטפורמה חכמה לרואי חשבון
CTA: התחל בחינם | צפה בהדגמה
```

**Pain Points to highlight:**
- בלאגן במסמכים
- עומס עבודה ידני
- פספוס דדליינים
- חוויית לקוח לא מקצועית

**Features list:**
1. ניהול הצהרות במקום אחד
2. פורטל לקוח ממותג
3. תזכורות אוטומטיות
4. מעקב סטטוס בזמן אמת
5. העלאת מסמכים מאובטחת
6. דוחות וסטטיסטיקות

**Pricing Plans:**
| Plan | Hebrew | Declarations |
|------|--------|--------------|
| Basic | בסיסי | Up to 10/month |
| Professional | מקצועי | Up to 50/month |
| Enterprise | ארגוני | Unlimited + custom branding |

---

## Phase 3: Auth Pages Redesign

Redesign login and register pages with Hebrew text.

### Tasks

- [ ] Redesign `src/app/(auth)/login/page.tsx` with Hebrew labels
- [ ] Redesign `src/app/(auth)/register/page.tsx` with Hebrew labels
- [ ] Update `src/components/auth/sign-in-button.tsx` for Hebrew
- [ ] Update `src/components/auth/sign-up-form.tsx` for Hebrew
- [ ] Update forgot password and reset password forms

### Technical Details

**Hebrew Form Labels:**
```typescript
const AUTH_TEXT = {
  login: {
    title: 'התחברות',
    email: 'כתובת אימייל',
    password: 'סיסמה',
    submit: 'התחבר',
    forgotPassword: 'שכחת סיסמה?',
    noAccount: 'אין לך חשבון?',
    register: 'הירשם עכשיו'
  },
  register: {
    title: 'הרשמה',
    name: 'שם מלא',
    firmName: 'שם המשרד',
    email: 'כתובת אימייל',
    password: 'סיסמה',
    confirmPassword: 'אימות סיסמה',
    submit: 'צור חשבון',
    hasAccount: 'יש לך כבר חשבון?',
    login: 'התחבר'
  }
}
```

---

## Phase 4: Dashboard Shell

Build the dashboard layout with sidebar navigation.

### Tasks

- [ ] Create dashboard layout `src/app/dashboard/layout.tsx`
- [ ] Build `src/components/dashboard/sidebar.tsx` [complex]
  - [ ] Navigation items with icons
  - [ ] Collapsible on mobile (Sheet)
  - [ ] Active state highlighting
  - [ ] User profile section at bottom
- [ ] Build `src/components/dashboard/header.tsx`
- [ ] Build `src/components/dashboard/stat-card.tsx`
- [ ] Create dashboard overview `src/app/dashboard/page.tsx`
- [ ] Add loading skeleton `src/app/dashboard/loading.tsx`

### Technical Details

**Sidebar Navigation Items:**
```typescript
const NAV_ITEMS = [
  { href: '/dashboard', label: 'לוח בקרה', icon: LayoutDashboard },
  { href: '/dashboard/declarations', label: 'הצהרות הון', icon: FileText },
  { href: '/dashboard/clients', label: 'לקוחות', icon: Users },
  { href: '/dashboard/settings', label: 'הגדרות', icon: Settings },
]
```

**Dashboard Stats:**
```typescript
interface DashboardStats {
  active: number;        // הצהרות פעילות
  pending: number;       // ממתינות לאישור
  completedMonth: number; // הושלמו החודש
  nearDeadline: number;  // מתקרבות לדדליין
}
```

**Layout Structure:**
```
┌─────────────────────────────────────┐
│ Header (search, notifications, user)│
├──────────┬──────────────────────────┤
│          │                          │
│ Sidebar  │    Main Content          │
│ (280px)  │                          │
│          │                          │
└──────────┴──────────────────────────┘
```

---

## Phase 5: Declarations Core

Build the core declarations management functionality.

### Tasks

- [ ] Create declarations list page `src/app/dashboard/declarations/page.tsx`
- [ ] Build `src/components/declarations/declaration-table.tsx`
- [ ] Build `src/components/declarations/declaration-status.tsx` (status badge)
- [ ] Create declaration detail page `src/app/dashboard/declarations/[id]/page.tsx`
- [ ] Build `src/components/declarations/timeline.tsx` (progress timeline)
- [ ] Create new declaration wizard `src/app/dashboard/declarations/new/page.tsx` [complex]
  - [ ] Build wizard container `src/components/declarations/wizard/index.tsx`
  - [ ] Step 1: Client info `wizard/step-client.tsx`
  - [ ] Step 2: Assets `wizard/step-assets.tsx`
  - [ ] Step 3: Liabilities `wizard/step-liabilities.tsx`
  - [ ] Step 4: Documents `wizard/step-documents.tsx`
  - [ ] Step 5: Review `wizard/step-review.tsx`
- [ ] Build asset forms [complex]
  - [ ] `src/components/forms/real-estate-form.tsx`
  - [ ] `src/components/forms/vehicle-form.tsx`
  - [ ] `src/components/forms/bank-account-form.tsx`
  - [ ] `src/components/forms/investment-form.tsx`
  - [ ] `src/components/forms/liability-form.tsx`

### Technical Details

**Declaration Statuses:**
```typescript
type DeclarationStatus =
  | 'draft'              // טיוטה
  | 'pending_documents'  // ממתין למסמכים
  | 'in_review'          // בבדיקה
  | 'submitted'          // הוגש
  | 'completed'          // הושלם

const STATUS_LABELS: Record<DeclarationStatus, string> = {
  draft: 'טיוטה',
  pending_documents: 'ממתין למסמכים',
  in_review: 'בבדיקה',
  submitted: 'הוגש',
  completed: 'הושלם'
}

const STATUS_COLORS: Record<DeclarationStatus, string> = {
  draft: 'bg-muted',
  pending_documents: 'bg-yellow-100 text-yellow-800',
  in_review: 'bg-blue-100 text-blue-800',
  submitted: 'bg-purple-100 text-purple-800',
  completed: 'bg-green-100 text-green-800'
}
```

**Table Columns:**
| לקוח | תאריך יצירה | דדליין | סטטוס | סכום נטו | פעולות |

**Asset Types:**
```typescript
type AssetType =
  | 'real_estate'   // נדל"ן
  | 'vehicle'       // כלי רכב
  | 'bank_account'  // חשבון בנק
  | 'investment'    // השקעות
  | 'other'         // אחר
```

**Wizard Steps:**
```typescript
const WIZARD_STEPS = [
  { id: 'client', label: 'פרטי לקוח', icon: User },
  { id: 'assets', label: 'נכסים', icon: Building },
  { id: 'liabilities', label: 'התחייבויות', icon: CreditCard },
  { id: 'documents', label: 'מסמכים', icon: FileUp },
  { id: 'review', label: 'סיכום', icon: CheckCircle },
]
```

---

## Phase 6: Client Management

Build client list and profile pages.

### Tasks

- [ ] Create clients list page `src/app/dashboard/clients/page.tsx`
- [ ] Build `src/components/clients/client-table.tsx`
- [ ] Create client profile page `src/app/dashboard/clients/[id]/page.tsx`
- [ ] Build `src/components/clients/client-card.tsx`
- [ ] Create add client page `src/app/dashboard/clients/new/page.tsx`
- [ ] Build `src/components/clients/client-form.tsx`

### Technical Details

**Client Form Fields:**
```typescript
interface ClientFormData {
  firstName: string;      // שם פרטי
  lastName: string;       // שם משפחה
  idNumber: string;       // תעודת זהות
  phone: string;          // טלפון
  email?: string;         // אימייל (אופציונלי)
  address?: string;       // כתובת
  notes?: string;         // הערות
}
```

**Client Table Columns:**
| שם | ת.ז. | טלפון | הצהרות פעילות | פעולות |

---

## Phase 7: Settings Pages

Build account settings and white-label configuration.

### Tasks

- [ ] Create settings layout `src/app/dashboard/settings/layout.tsx`
- [ ] Create profile settings `src/app/dashboard/settings/profile/page.tsx`
- [ ] Create white-label settings `src/app/dashboard/settings/white-label/page.tsx` [complex]
  - [ ] Logo upload
  - [ ] Color picker for primary color
  - [ ] Email template customization
  - [ ] Live preview component
- [ ] Build `src/components/settings/white-label-form.tsx`
- [ ] Build `src/components/settings/white-label-preview.tsx`
- [ ] Create billing page `src/app/dashboard/settings/billing/page.tsx`

### Technical Details

**White-label Settings:**
```typescript
interface WhiteLabelSettings {
  logo?: string;           // URL to uploaded logo
  primaryColor?: string;   // OKLCH color value
  firmName: string;        // Display name
  contactEmail: string;    // Support email
  emailSignature?: string; // Custom email footer
}
```

**Settings Navigation:**
```typescript
const SETTINGS_NAV = [
  { href: '/dashboard/settings/profile', label: 'פרופיל' },
  { href: '/dashboard/settings/white-label', label: 'מיתוג' },
  { href: '/dashboard/settings/billing', label: 'חיוב' },
]
```

---

## Phase 8: Client Portal

Build the white-labeled client-facing portal.

### Tasks

- [ ] Create portal layout `src/app/portal/layout.tsx` (loads accountant's branding)
- [ ] Create portal dashboard `src/app/portal/page.tsx`
- [ ] Build `src/components/portal/header.tsx` (white-labeled)
- [ ] Create document upload page `src/app/portal/documents/page.tsx`
- [ ] Build `src/components/documents/uploader.tsx` (drag-drop with progress)
- [ ] Build `src/components/documents/checklist.tsx` (required docs list)
- [ ] Create data entry page `src/app/portal/data/page.tsx`
- [ ] Build `src/components/portal/data-entry-section.tsx`
- [ ] Create status page `src/app/portal/status/page.tsx`
- [ ] Create messages page `src/app/portal/messages/page.tsx`

### Technical Details

**Portal URL Structure:**
Clients access via subdomain or path with accountant ID:
- Option A: `{accountant-slug}.hatzhar-hon.co.il/portal`
- Option B: `hatzhar-hon.co.il/portal/{accountant-id}`

**Document Types Required:**
```typescript
const REQUIRED_DOCUMENTS = [
  { type: 'id_card', label: 'צילום תעודת זהות', required: true },
  { type: 'bank_statements', label: 'דפי בנק', required: true },
  { type: 'mortgage_statement', label: 'אישור יתרת משכנתא', required: false },
  { type: 'vehicle_registration', label: 'רישיון רכב', required: false },
  { type: 'investment_report', label: 'דוח השקעות', required: false },
  { type: 'property_deed', label: 'נסח טאבו', required: false },
]
```

**Portal Layout with White-label:**
```tsx
// Fetch accountant's branding
const branding = await getAccountantBranding(accountantId)

// Apply custom CSS variables
<style>{`
  :root {
    --portal-primary: ${branding.primaryColor || 'var(--primary)'};
  }
`}</style>

// Show accountant's logo
<Image src={branding.logo} alt={branding.firmName} />
```

---

## Phase 9: Polish & Testing

Final polish, responsive testing, and bug fixes.

### Tasks

- [ ] Add loading skeletons to all pages
- [ ] Implement error boundary components
- [ ] Add empty states for lists (no declarations, no clients)
- [ ] Test and fix RTL edge cases
- [ ] Test responsive design on mobile
- [ ] Add subtle animations/transitions
- [ ] Accessibility audit (form labels, ARIA)
- [ ] Run lint and typecheck, fix all issues

### Technical Details

**Empty State Component:**
```tsx
<EmptyState
  icon={FileText}
  title="אין הצהרות עדיין"
  description="צור את ההצהרה הראשונה שלך"
  action={
    <Button asChild>
      <Link href="/dashboard/declarations/new">צור הצהרה חדשה</Link>
    </Button>
  }
/>
```

**Skeleton Patterns:**
- Use shadcn/ui Skeleton component
- Match exact layout dimensions
- Animate with `animate-pulse`

**RTL Edge Cases to Check:**
- Icons should NOT flip (most icons are symmetric)
- Numbers should remain LTR
- Phone numbers, dates maintain LTR
- Text alignment in forms
- Breadcrumb separator direction
