# Implementation Plan: Declaration Creation Flow Redesign

## Overview

שינוי תהליך יצירת הצהרה כך שפרטי הלקוח מוזנים ישירות בטופס (עם חיפוש אוטומטי לפי ת.ז.), והסרת עמוד הלקוחות הנפרד.

## Phase 1: Add Package & Server Actions

הוספת חבילת debounce ופונקציות server actions חדשות לחיפוש לקוח ויצירת הצהרה עם לקוח.

### Tasks

- [ ] Install `use-debounce` package
- [ ] Add `findClientByIdNumber` server action
- [ ] Add `createDeclarationWithClient` server action

### Technical Details

**Package installation:**
```bash
pnpm add use-debounce
```

**File:** `src/app/dashboard/declarations/actions.ts`

**findClientByIdNumber action:**
```typescript
export async function findClientByIdNumber(idNumber: string): Promise<Client | null> {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) return null

  const firmId = (session.user as any).firmId
  if (!firmId) return null

  const clientData = await db.query.client.findFirst({
    where: and(eq(client.idNumber, idNumber), eq(client.firmId, firmId)),
  })

  if (!clientData) return null

  return {
    id: clientData.id,
    firstName: clientData.firstName,
    lastName: clientData.lastName,
    idNumber: clientData.idNumber || "",
    phone: clientData.phone || "",
    email: clientData.email,
    address: clientData.address || null,
    notes: clientData.notes || null,
    activeDeclarations: 0,
  }
}
```

**createDeclarationWithClient interface:**
```typescript
export interface CreateDeclarationWithClientData {
  // Client fields
  firstName: string
  lastName: string
  idNumber: string
  phone: string
  email: string
  address?: string
  notes?: string

  // Declaration fields
  year: number
  declarationDate: Date
  taxAuthorityDueDate?: Date
  internalDueDate?: Date
  subject: string
  declarationNotes?: string
}
```

**createDeclarationWithClient logic:**
1. Get session and firmId
2. Check if client exists by idNumber + firmId
3. If exists → update client fields
4. If not exists → create new client
5. Create declaration with clientId
6. Generate publicToken, set status to "sent"
7. Send email to client
8. Revalidate and return declaration ID

---

## Phase 2: Redesign Declaration Form

שכתוב מלא של טופס יצירת הצהרה עם שדות לקוח וחיפוש אוטומטי.

### Tasks

- [ ] Rewrite CreateDeclarationForm component [complex]
  - [ ] Add client fields section (firstName, lastName, idNumber, phone, email, address, notes)
  - [ ] Add ID number search with debounce
  - [ ] Add client status indicator (searching/found/new badges)
  - [ ] Implement auto-fill on client found
  - [ ] Add form validation
  - [ ] Connect to new server actions

### Technical Details

**File:** `src/components/declarations/create-declaration-form.tsx`

**Form structure:**
```
Card: פרטי לקוח
├── ת.ז. input + status badge (searching/found/new)
├── שם פרטי + שם משפחה (grid 2 cols)
├── טלפון + אימייל (grid 2 cols)
├── כתובת
└── הערות לקוח

Card: פרטי הצהרה
├── שנת מס + תאריך קובע (grid 2 cols)
├── דדליין רשות המסים + דדליין פנימי (grid 2 cols)
├── נושא
└── הערות להצהרה

Button: צור הצהרה
```

**State management:**
```typescript
type ClientStatus = "idle" | "searching" | "found" | "new"

const [clientStatus, setClientStatus] = useState<ClientStatus>("idle")
const [formData, setFormData] = useState<FormData>({...})
const [errors, setErrors] = useState<Record<string, string>>({})
```

**Debounced search:**
```typescript
import { useDebouncedCallback } from "use-debounce"

const debouncedSearch = useDebouncedCallback(async (idNumber: string) => {
  const cleanId = idNumber.replace(/\D/g, "")
  if (cleanId.length !== 9) {
    setClientStatus("idle")
    return
  }

  setClientStatus("searching")
  const client = await findClientByIdNumber(cleanId)

  if (client) {
    setClientStatus("found")
    // Auto-fill form fields
    toast.success("לקוח קיים נמצא - הפרטים מולאו אוטומטית")
  } else {
    setClientStatus("new")
    toast.info("לקוח חדש - מלא את הפרטים")
  }
}, 500)
```

**Validation rules:**
- ת.ז.: `/^\d{9}$/` (9 digits)
- טלפון: `/^\d{10}$/` (10 digits)
- אימייל: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`
- Required: firstName, lastName, idNumber, phone, year, declarationDate

**Hebrew labels from constants:**
- `CLIENTS.form.firstName` = "שם פרטי"
- `CLIENTS.form.lastName` = "שם משפחה"
- `CLIENTS.form.idNumber` = "תעודת זהות"
- `CLIENTS.form.phone` = "טלפון"
- `CLIENTS.form.email` = "אימייל (אופציונלי)"
- `VALIDATION.required` = "שדה חובה"
- `VALIDATION.invalidIdNumber` = "מספר תעודת זהות לא תקין"

---

## Phase 3: Update Page & Navigation

עדכון עמוד הצהרה חדשה והסרת לקוחות מהתפריט.

### Tasks

- [ ] Update new declaration page to remove clients prop
- [ ] Remove clients from sidebar navigation
- [ ] Remove Users icon import from sidebar

### Technical Details

**File:** `src/app/dashboard/declarations/new/page.tsx`

Before:
```typescript
import { getClients } from "@/app/dashboard/clients/actions"
const clients = await getClients()
<CreateDeclarationForm clients={clients} />
```

After:
```typescript
// Remove getClients import and call
<CreateDeclarationForm />
```

**File:** `src/components/dashboard/sidebar.tsx`

Remove from NAV_ITEMS (line 30):
```typescript
{ href: "/dashboard/clients", label: NAV.clients, icon: Users },
```

Update imports (line 8):
```typescript
// Remove Users from the import
import {
  LayoutDashboard,
  FileText,
  // Users, -- REMOVE
  Settings,
  LogOut,
  Menu,
  Shield,
} from "lucide-react"
```

---

## Phase 4: Remove Client Pages

מחיקת קבצי עמודי הלקוחות שלא בשימוש.

### Tasks

- [ ] Delete `/src/app/dashboard/clients/page.tsx`
- [ ] Delete `/src/app/dashboard/clients/new/page.tsx`
- [ ] Delete `/src/app/dashboard/clients/[id]/page.tsx`
- [ ] Delete `/src/app/dashboard/clients/loading.tsx`
- [ ] Delete `/src/app/dashboard/clients/[id]/loading.tsx`
- [ ] Delete `/src/app/dashboard/clients/[id]/` directory
- [ ] Delete `/src/app/dashboard/clients/new/` directory
- [ ] Keep `/src/app/dashboard/clients/actions.ts` (functions still in use)

### Technical Details

**Files to delete:**
```
src/app/dashboard/clients/
├── page.tsx              # DELETE
├── loading.tsx           # DELETE
├── new/
│   └── page.tsx          # DELETE (and folder)
├── [id]/
│   ├── page.tsx          # DELETE
│   └── loading.tsx       # DELETE (and folder)
└── actions.ts            # KEEP - has getClients, getClientDetails used elsewhere
```

**Verify actions.ts usage:**
- `getClients()` - may be used in declaration detail pages
- `getClientDetails()` - used in client card on declaration page

---

## Phase 5: Verification

בדיקת תקינות ותיקון שגיאות.

### Tasks

- [ ] Run `pnpm run lint` and fix any errors
- [ ] Run `pnpm run typecheck` and fix any errors
- [ ] Verify navigation works correctly
- [ ] Verify declaration creation flow works end-to-end
