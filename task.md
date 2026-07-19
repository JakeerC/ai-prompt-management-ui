# Next.js UI Implementation Tasks

## Phase 1 — Project Scaffolding & Design System
- [x] Scaffold Next.js project with create-next-app
- [x] Install dependencies (shadcn/ui, tanstack-query, supabase, framer-motion, etc.)
- [x] Configure tailwind with custom design tokens
- [x] Create globals.css with design system
- [x] Configure next.config.ts with API proxy
- [x] Set up fonts (Inter + JetBrains Mono)

## Phase 2 — Type Definitions
- [x] Create all TypeScript types (api, prompt, approval, version, audit, usage, category, tag, auth)

## Phase 3 — API Client Layer
- [x] Create API client with auth header injection
- [x] Create all API modules (prompts, approvals, versions, audit, usage, search, categories, tags)

## Phase 4 — Authentication
- [x] Supabase client/server setup
- [x] Auth context provider
- [x] Login page
- [x] Signup page
- [x] Middleware for route protection

## Phase 5 — Shared Components
- [x] Status/approval/impact badges
- [x] App shell, sidebar, top bar
- [x] Prompt card
- [x] KPI card
- [x] Data table
- [x] Empty state
- [x] Confirm dialog
- [x] Role guard component

## Phase 6 — TanStack Query Hooks
- [x] All query/mutation hooks

## Phase 7 — Pages
- [x] Dashboard
- [x] Prompt Library (Search & List)
- [x] Prompt Details
- [x] Create Prompt
- [x] Edit Prompt
- [x] Review Queue
- [x] Global Audit
- [ ] Categories Management Detail (tabbed)
- [x] Edit Prompt
- [x] Review Queue
- [x] Categories
- [x] Settings
- [x] Profile Pages

## Phase 8 — Polish
- [ ] Dark/light mode
- [ ] Loading skeletons
- [ ] Toast notifications
- [ ] Error boundaries
