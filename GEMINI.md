# Hatzaron Project Context

## Project Overview
**Hatzaron** (הצהר-הון) is a web platform designed for accountants to manage capital declarations (Net Worth Declarations) for their clients. It features a dashboard for tracking declaration status, a client management system, and a wizard for submitting declarations.

**Current Status:**  
The project is in an **early prototyping phase**. 
- **UI:** The Dashboard, Client list, and Declaration views are implemented but currently rely on **hardcoded mock data**.
- **Database:** The PostgreSQL database (managed via Drizzle ORM) currently **only contains Authentication tables** (User, Session, Account). Business entities like `Clients` and `Declarations` are **not yet defined** in the schema.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4, shadcn/ui
- **Database:** PostgreSQL, Drizzle ORM
- **Authentication:** Better Auth
- **AI Integration:** Vercel AI SDK (OpenRouter)

## Key Directories
- **`src/app`**: Next.js App Router pages.
    - `(auth)`: Login/Register pages.
    - `dashboard`: Main application area (Clients, Declarations).
    - `portal`: Client-facing portal for document uploads.
- **`src/lib`**:
    - `schema.ts`: Database schema definitions (Currently Auth only).
    - `constants/hebrew.ts`: Centralized Hebrew text constants for the UI.
- **`src/components`**: React components.
    - `clients`, `declarations`, `dashboard`: Domain-specific components.
- **`drizzle`**: Database migrations.

## Development Commands
- **Run Development Server:** `pnpm dev`
- **Database Operations:**
    - `pnpm db:generate`: Generate migrations from schema.
    - `pnpm db:migrate`: Apply migrations to the database.
    - `pnpm db:studio`: Open Drizzle Studio to view data.
- **Lint/Check:** `pnpm check` (Runs lint and typecheck).

## Conventions
- **Localization:** The app is primarily in Hebrew. All static text should be added to `src/lib/constants/hebrew.ts` rather than hardcoded in components.
- **Data Fetching:** Currently using mock data arrays in page components. Future implementation should transition to Server Actions fetching from Drizzle.
- **Styling:** Mobile-first, using Tailwind CSS utility classes.
