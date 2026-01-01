# Action Required: Super User Admin System

Manual steps that must be completed by a human. These cannot be automated.

## Before Implementation

- [ ] **Set `SUPER_ADMIN_EMAIL` environment variable** - Required to identify which user should be the super admin. Add your email address to `.env` file.

## During Implementation

- [ ] **Run BetterAuth migration** - Execute `npx @better-auth/cli migrate` to add role/ban fields to the database schema. This requires database access.

## After Implementation

- [ ] **Set admin role for first user in database** - Run SQL or use Drizzle to set `role = 'admin'` for your user. This is a one-time setup to bootstrap the first admin.

---

> **Note:** These tasks are also listed in context within `implementation-plan.md`
