# Requirements: הצהר-הון UI Redesign

## Overview

Complete UI redesign of the existing Next.js boilerplate into "הצהר-הון" - a SaaS platform for Israeli accounting firms to manage wealth declarations (הצהרות הון) for their clients.

## Business Context

### What is הצהרת הון?
A wealth declaration is a mandatory form submitted to the Israeli Tax Authority (רשות המסים) that shows a snapshot of a person's assets minus liabilities. Accountants help their clients prepare these declarations. Key facts:
- Required by Section 135(1)(a) of the Income Tax Ordinance
- Must be submitted within 120 days of receiving the request
- Usually requested every 4-5 years
- Costs 500-1500 NIS per declaration
- Includes: real estate, vehicles, bank accounts, investments, loans, mortgages

### Target Users

1. **Accounting Firms (Primary)** - Sign up, pay for the service, manage their clients' declarations
2. **End Clients (Secondary)** - Clients of the accounting firms who need to submit data and documents

### Value Proposition

- Save hours of manual work organizing declarations
- Professional, branded experience for end clients
- Centralized tracking of all declarations and deadlines
- White-label portal for each accounting firm

## Functional Requirements

### FR1: Marketing Website
- Landing page explaining the service
- Pricing page with plans
- FAQ section
- Login/Register functionality
- Hebrew language (RTL)

### FR2: Accountant Dashboard
- Overview with statistics (active, pending, completed declarations)
- Declaration management (create, view, edit)
- Client management
- Deadline tracking and alerts
- White-label customization (logo, colors)
- Account and billing settings

### FR3: Declaration Wizard
- Multi-step form for creating new declarations
- Steps: Client info → Assets → Liabilities → Documents → Summary
- Support for multiple asset types:
  - Real estate (נדל"ן)
  - Vehicles (כלי רכב)
  - Bank accounts (חשבונות בנק)
  - Investments (השקעות)
  - Other assets

### FR4: Client Portal (White-labeled)
- Displays accountant's branding
- Document upload interface
- Financial data entry forms
- Declaration status tracking
- Messaging with accountant

## Non-Functional Requirements

### NFR1: Language & Layout
- Hebrew only (עברית)
- Full RTL (right-to-left) support
- All UI text in Hebrew

### NFR2: Design
- Minimalist, professional style
- Custom color palette (orange primary in light mode, blue in dark mode)
- Open Sans + Heebo fonts
- Flat design (no shadows)
- Rounded corners (1.3rem radius)

### NFR3: Responsiveness
- Desktop-first, mobile-friendly
- Sidebar collapses on mobile
- Tables become card lists on mobile

### NFR4: Multi-tenancy
- Each accounting firm is a tenant
- Clients belong to their accountant's tenant
- White-label styling per tenant

## Acceptance Criteria

### Landing Page
- [ ] Hero section with clear value proposition in Hebrew
- [ ] Features section highlighting key benefits
- [ ] Pricing section or link
- [ ] FAQ section
- [ ] Call-to-action buttons
- [ ] Full RTL layout

### Accountant Dashboard
- [ ] Statistics cards showing declaration counts
- [ ] Recent declarations table
- [ ] Deadline alerts
- [ ] Sidebar navigation
- [ ] Works in light and dark mode

### Declaration Management
- [ ] List view with filtering and sorting
- [ ] Create new declaration wizard (5 steps)
- [ ] View/edit existing declarations
- [ ] Status tracking

### Client Portal
- [ ] White-labeled with accountant's branding
- [ ] Document upload with progress
- [ ] Financial data forms
- [ ] Status timeline

## Dependencies

- Existing Next.js 16 setup with App Router
- Better Auth for authentication
- PostgreSQL with Drizzle ORM (schema extension needed)
- shadcn/ui components
- Tailwind CSS 4

## Out of Scope (Phase 1)

- Email notifications (future)
- Payment processing (future)
- PDF generation (future)
- Team member management (future)
- Advanced analytics (future)
