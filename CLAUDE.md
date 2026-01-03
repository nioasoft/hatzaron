# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**הצהר-הון** (Hatzaron) is a Hebrew-language capital declarations (הצהרות הון) management platform for Israeli accountants. It enables accounting firms to manage client declarations, track document uploads, monitor status workflows, and communicate with clients through a branded portal.

### Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript
- **Authentication**: BetterAuth with admin plugin (impersonation, roles)
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui, Tailwind CSS 4, RTL Hebrew interface
- **AI Integration**: Vercel AI SDK 5 + OpenRouter (optional chat feature)
- **File Storage**: Local dev / Vercel Blob production

## Commands

```bash
pnpm run dev          # Start dev server (DON'T run this - ask user to provide output)
pnpm run lint         # ESLint - ALWAYS run after changes
pnpm run typecheck    # TypeScript check - ALWAYS run after changes
pnpm run check        # Run both lint and typecheck
pnpm run db:generate  # Generate migrations after schema changes
pnpm run db:migrate   # Apply migrations
pnpm run db:push      # Push schema directly (dev only)
pnpm run db:studio    # Drizzle Studio GUI
```

## Architecture

### Multi-Tenant Structure

```
Firm (משרד רו"ח)
├── Users (firm_admin, firm_employee)
├── Clients (לקוחות)
│   └── Declarations (הצהרות הון)
│       ├── Documents (מסמכים)
│       ├── StatusHistory (היסטוריית סטטוסים)
│       └── Communications (תקשורת)
```

### User Roles

- `admin` - Super admin with firm management and impersonation
- `firm_admin` - Firm owner with full access to their firm
- `firm_employee` - Accountant with assigned declarations
- `user` - Default role

### Key Route Groups

- `/(marketing)` - Public landing, pricing, FAQ pages
- `/(auth)` - Login, register, password reset
- `/dashboard` - Firm dashboard (clients, declarations, settings)
- `/portal/[token]` - Public client portal for document uploads
- `/admin` - Super admin panel for managing firms

### Declaration Status Flow

`draft` → `sent` → `in_progress` → `waiting_documents` → `documents_received` → `reviewing` → `in_preparation` → `pending_approval` → `submitted`

Portal access automatically transitions: `sent` → `in_progress`
Client "done uploading" transitions: `in_progress` → `documents_received`

## Key Files

- `src/lib/schema.ts` - Database schema (firm, user, client, declaration, document, etc.)
- `src/lib/constants/hebrew.ts` - All Hebrew UI strings (use these, don't hardcode text)
- `src/lib/session.ts` - `requireAuth()`, `getOptionalSession()` helpers
- `src/lib/admin.ts` - `isAdmin()`, `requireAdmin()`, `getImpersonationState()`
- `src/lib/auth.ts` - BetterAuth config with admin plugin

## Guidelines

### Hebrew/RTL

- All user-facing text is in Hebrew - import from `src/lib/constants/hebrew.ts`
- Layout is RTL - use `space-x-reverse`, `text-right`, etc.
- Date formatting uses `he` locale with date-fns

### Authentication Patterns

```typescript
// Server Component - require auth
import { requireAuth } from "@/lib/session"
const session = await requireAuth() // redirects if not logged in

// Server Component - optional auth
import { getOptionalSession } from "@/lib/session"
const session = await getOptionalSession()

// Client Component
import { useSession } from "@/lib/auth-client"
const { data: session } = useSession()

// Admin check
import { isAdmin, requireAdmin } from "@/lib/admin"
if (await isAdmin()) { /* show admin features */ }
```

### Database Queries

Declarations and clients are always scoped by `firmId`:

```typescript
import { db } from "@/lib/db"
import { declaration, client } from "@/lib/schema"
import { eq, and } from "drizzle-orm"

// Always filter by firmId
const declarations = await db
  .select()
  .from(declaration)
  .where(eq(declaration.firmId, session.user.firmId))
```

### Server Actions

Use `"use server"` actions for mutations. Located in component files or dedicated action files.

### Status Changes

Always log to `declarationStatusHistory` table when changing declaration status.

## Specs & Feature Development

Feature specs are stored in `specs/` with requirements and implementation plans. Use Claude Code commands:

- `/create-spec` - Create new feature specification
- `/publish-to-github` - Publish to GitHub Issues/Projects
- `/continue-feature` - Implement next task from spec
- `/checkpoint` - Create detailed checkpoint commit
