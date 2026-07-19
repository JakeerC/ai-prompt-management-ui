# Next.js UI for AI Prompt Management Platform

> A comprehensive implementation plan for a production-grade Next.js frontend that provides a complete management console for the `prompt-management-service` Spring Boot backend.

## Background

The backend exposes 8 REST controllers with the following API surface, all returning a uniform `ApiResponse<T>` envelope (`{ success, data, message, timestamp }`):

| Controller | Base Path | Key Operations |
|---|---|---|
| **Prompts** | `/api/v1/prompts` | CRUD |
| **Approvals** | `/api/v1/prompts/{id}/approvals` | Submit, Approve, Reject, History |
| **Versions** | `/api/v1/prompts/{id}/versions` | List, Current, By Number |
| **Audit** | `/api/v1/prompts/{id}/audit` | Paginated trail |
| **Usage** | `/api/v1/prompts/{id}/usage` | Record, Paginated history |
| **Search** | `/api/v1/search/prompts` | Advanced paginated search |
| **Categories** | `/api/v1/categories` | List all, Get by ID |
| **Tags** | `/api/v1/tags` | List all |

Auth: **Supabase JWT** → Backend validates as OAuth2 Resource Server.  
Roles: `ADMIN > REVIEWER > AUTHOR > VIEWER` (hierarchy).

---

## Open Questions

> [!IMPORTANT]
> **Monorepo or Separate Repo?**  
> Should the Next.js app live inside the existing `prompt-management-service` repo (e.g., `frontend/` directory), or in a completely separate repository? I recommend keeping it in the same repo under `frontend/` for simplified CI/CD and version alignment.

> [!IMPORTANT]
> **Deployment Target**  
> Will the frontend be deployed on Vercel, Render (alongside the backend), or another platform? This affects the `next.config.js` output settings and API proxy configuration.

> [!IMPORTANT]
> **Supabase Project**  
> Should the frontend reuse the same Supabase project that the backend uses for JWT validation, or a separate one? The frontend needs the Supabase `anon` key and project URL for `@supabase/ssr`.

---

## Proposed Tech Stack

| Technology | Purpose |
|---|---|
| **Next.js 15** (App Router) | Framework — server components, layouts, streaming |
| **TypeScript** | Type safety across all layers |
| **Supabase SSR** (`@supabase/ssr`) | Client-side auth (login, signup, session management) |
| **TanStack Query v5** | Server state management, caching, optimistic updates |
| **Tailwind CSS v4** | Utility-first styling with custom design tokens |
| **shadcn/ui** | Headless, accessible component primitives (built on Radix) |
| **Lucide React** | Icon library |
| **React Hook Form + Zod** | Form management and schema validation |
| **Framer Motion** | Micro-animations and page transitions |
| **next-themes** | Dark/light mode toggle |
| **Sonner** | Toast notifications |
| **date-fns** | Date formatting and relative time |

---

## Design System

### Color Palette (Dark Mode Primary)

```
Background:   hsl(222, 47%, 6%)    → Deep navy
Surface:      hsl(222, 35%, 10%)   → Elevated card surface
Border:       hsl(222, 20%, 18%)   → Subtle separator
Muted:        hsl(222, 15%, 40%)   → Secondary text

Primary:      hsl(262, 83%, 58%)   → Electric violet (CTAs, active states)
Accent:       hsl(190, 95%, 45%)   → Teal-cyan (secondary actions)

Status Colors:
  DRAFT:        hsl(220, 15%, 50%)   → Slate
  IN_REVIEW:    hsl(38, 92%, 50%)    → Amber
  APPROVED:     hsl(142, 71%, 45%)   → Emerald
  PUBLISHED:    hsl(262, 83%, 58%)   → Violet
  IN_USE:       hsl(190, 95%, 45%)   → Cyan
  RETIRED:      hsl(0, 72%, 51%)     → Rose
  ARCHIVED:     hsl(220, 10%, 35%)   → Gray

Impact Badge Colors:
  LOW:          hsl(220, 15%, 50%)
  MEDIUM:       hsl(38, 92%, 50%)
  HIGH:         hsl(25, 95%, 53%)
  CRITICAL:     hsl(0, 72%, 51%)
```

### Typography
- **Font**: `Inter` (Google Fonts) for body, `JetBrains Mono` for prompt content/code
- **Scale**: 12 / 14 / 16 / 20 / 24 / 32 / 48px

### Key Design Patterns
- **Glassmorphism** on sidebar and modals (`backdrop-blur-xl`, semi-transparent backgrounds)
- **Gradient borders** on focused cards using `bg-gradient-to-r` with primary→accent
- **Micro-animations**: 150ms ease-out on hover states, spring transitions on page changes
- **Status pills** with dot indicator + label, colored per lifecycle state
- **Skeleton loading** for all data-fetching states

---

## Information Architecture & Pages

### Application Shell

```
┌──────────────────────────────────────────────────────────────┐
│  ┌──────┐  Prompt Management Platform        🔔  👤 Role ▼  │  ← Top bar
│  │ Logo │                                                    │
├──┼──────┼────────────────────────────────────────────────────┤
│  │      │                                                    │
│  │  📊  │    ┌─────────────────────────────────────────┐     │
│  │ Dash │    │                                         │     │
│  │      │    │           Main Content Area             │     │
│  │  📝  │    │                                         │     │
│  │Prompts│   │                                         │     │
│  │      │    │                                         │     │
│  │  ✅  │    │                                         │     │
│  │Review │   │                                         │     │
│  │      │    │                                         │     │
│  │  📂  │    │                                         │     │
│  │Categ. │   └─────────────────────────────────────────┘     │
│  │      │                                                    │
│  │  🏷️  │                                                    │
│  │ Tags │                                                    │
│  │      │                                                    │
│  │  📈  │                                                    │
│  │Audit │                                                    │
│  │      │                                                    │
│  │  ⚙️  │                                                    │
│  │Sett. │                                                    │
│  └──────┘                                                    │
└──────────────────────────────────────────────────────────────┘
```

### Page Map

| Route | Page | Description | Min Role |
|---|---|---|---|
| `/` | **Dashboard** | KPI cards, recent prompts, approval queue, usage chart | VIEWER |
| `/login` | **Login** | Supabase email/password + OAuth providers | Public |
| `/signup` | **Signup** | Create account | Public |
| `/prompts` | **Prompt Library** | Searchable, filterable, paginated list | VIEWER |
| `/prompts/new` | **Create Prompt** | Multi-step form with template variable builder | AUTHOR |
| `/prompts/[id]` | **Prompt Detail** | Full prompt view with tabs (Content, Versions, Approvals, Audit, Usage) | VIEWER |
| `/prompts/[id]/edit` | **Edit Prompt** | Edit form (only DRAFT status, ownership enforced) | AUTHOR |
| `/review` | **Review Queue** | Prompts awaiting approval (IN_REVIEW status) | REVIEWER |
| `/categories` | **Category Browser** | Hierarchical category tree with prompt counts | VIEWER |
| `/audit` | **Global Audit Log** | Cross-prompt audit timeline (ADMIN only) | ADMIN |
| `/settings` | **User Settings** | Profile, preferences, theme | VIEWER |

---

## Proposed Changes

### Phase 1 — Project Scaffolding & Design System

#### [NEW] `frontend/` directory

Scaffold using `npx create-next-app@latest ./frontend` with TypeScript, Tailwind CSS, App Router, and ESLint.

**Key files to create:**

| File | Purpose |
|---|---|
| `frontend/next.config.ts` | API proxy rewrites to backend, image domains |
| `frontend/tailwind.config.ts` | Custom design tokens (colors, fonts, animations) |
| `frontend/src/app/globals.css` | CSS custom properties, Tailwind layers, glass effects |
| `frontend/src/lib/fonts.ts` | Inter + JetBrains Mono via `next/font/google` |

---

### Phase 2 — Authentication Layer

#### [NEW] `frontend/src/lib/supabase/`

| File | Purpose |
|---|---|
| `client.ts` | Browser Supabase client via `createBrowserClient()` |
| `server.ts` | Server Supabase client via `createServerClient()` with cookie handling |
| `middleware.ts` | Next.js middleware for session refresh on every request |

#### [NEW] `frontend/src/app/(auth)/`

| File | Purpose |
|---|---|
| `login/page.tsx` | Login form — email/password + social providers |
| `signup/page.tsx` | Signup form with role selection (VIEWER default) |
| `layout.tsx` | Centered auth layout with branding |
| `auth/callback/route.ts` | Supabase OAuth callback handler |

#### [NEW] `frontend/src/contexts/auth-context.tsx`

React context providing `user`, `role`, `accessToken`, `signOut()` to the entire app.

---

### Phase 3 — API Client & Type Definitions

#### [NEW] `frontend/src/types/`

| File | Types Defined |
|---|---|
| `api.ts` | `ApiResponse<T>`, `PagedResponse<T>` |
| `prompt.ts` | `Prompt`, `CreatePromptRequest`, `UpdatePromptRequest`, `PromptStatus`, `BusinessImpact` |
| `approval.ts` | `PromptApproval`, `ApprovalStatus`, `ApproveRequest`, `RejectRequest` |
| `version.ts` | `PromptVersion` |
| `audit.ts` | `PromptAudit`, `AuditAction` |
| `usage.ts` | `PromptUsage`, `RecordUsageRequest` |
| `category.ts` | `PromptCategory` |
| `tag.ts` | `PromptTag` |
| `auth.ts` | `UserRole`, role hierarchy helpers |

#### [NEW] `frontend/src/lib/api/`

| File | Purpose |
|---|---|
| `client.ts` | Axios/fetch wrapper — auto-attaches `Authorization: Bearer` from Supabase session, handles `ApiResponse` unwrapping, error normalization |
| `prompts.ts` | `createPrompt()`, `getPrompt()`, `updatePrompt()`, `deletePrompt()` |
| `approvals.ts` | `submitForReview()`, `approve()`, `reject()`, `getApprovalHistory()` |
| `versions.ts` | `getVersionHistory()`, `getCurrentVersion()`, `getVersion()` |
| `audit.ts` | `getAuditTrail()` |
| `usage.ts` | `recordUsage()`, `getUsageHistory()` |
| `search.ts` | `searchPrompts()` with full `PromptSearchCriteria` support |
| `categories.ts` | `getAllCategories()`, `getCategory()` |
| `tags.ts` | `getAllTags()` |

#### [NEW] `frontend/src/hooks/`

TanStack Query hooks wrapping each API function:

| File | Hooks |
|---|---|
| `use-prompts.ts` | `usePrompt(id)`, `useCreatePrompt()`, `useUpdatePrompt()`, `useDeletePrompt()` |
| `use-search.ts` | `useSearchPrompts(criteria)` with debounced search |
| `use-approvals.ts` | `useApprovalHistory(id)`, `useSubmitForReview()`, `useApprove()`, `useReject()` |
| `use-versions.ts` | `useVersionHistory(id)`, `useCurrentVersion(id)` |
| `use-audit.ts` | `useAuditTrail(id, pageable)` |
| `use-usage.ts` | `useUsageHistory(id)`, `useRecordUsage()` |
| `use-categories.ts` | `useCategories()` |
| `use-tags.ts` | `useTags()` |

---

### Phase 4 — Shared Components

#### [NEW] `frontend/src/components/`

| Component | Description |
|---|---|
| **Layout** | |
| `app-shell.tsx` | Sidebar + top bar + main content wrapper |
| `sidebar.tsx` | Collapsible nav with role-based menu items, glassmorphism |
| `top-bar.tsx` | Breadcrumbs, search, notifications, user menu |
| **Data Display** | |
| `status-badge.tsx` | Colored pill for `PromptStatus` with dot indicator |
| `approval-badge.tsx` | Colored pill for `ApprovalStatus` |
| `impact-badge.tsx` | Colored pill for `BusinessImpact` (LOW/MED/HIGH/CRITICAL) |
| `role-badge.tsx` | User role indicator |
| `prompt-card.tsx` | List-item card showing name, status, impact, tags, owner, date |
| `version-timeline.tsx` | Vertical timeline showing version history with diffs |
| `audit-timeline.tsx` | Chronological audit events with actor/action/timestamp |
| `usage-chart.tsx` | Usage over time chart (daily/weekly aggregation) |
| `category-tree.tsx` | Nested tree view for hierarchical categories |
| **Forms** | |
| `prompt-form.tsx` | Create/Edit prompt form with variable builder |
| `variable-builder.tsx` | Dynamic list of template variable inputs |
| `search-filters.tsx` | Filter panel: status, impact, category, tags, date range |
| `approval-dialog.tsx` | Modal for approve/reject with comments textarea |
| **Primitives** | |
| `data-table.tsx` | Generic paginated, sortable table built on shadcn |
| `empty-state.tsx` | Illustrated empty state with action CTA |
| `skeleton-card.tsx` | Loading skeleton matching `prompt-card` dimensions |
| `confirm-dialog.tsx` | Generic confirmation modal (for delete, etc.) |
| `kpi-card.tsx` | Stat card with icon, value, label, and trend indicator |

---

### Phase 5 — Page Implementations

#### Dashboard (`/`)

```
┌─────────────────────────────────────────────────────────────┐
│  Dashboard                                            🌓    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ Total   │ │ Pending │ │Published│ │ Usage   │          │
│  │ Prompts │ │ Review  │ │ Active  │ │ Today   │          │
│  │   142   │ │    7    │ │   89    │ │  1,247  │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  ┌─────────────────────────┐ ┌─────────────────────────┐   │
│  │   Recent Prompts        │ │   Approval Queue        │   │
│  │   ─────────────         │ │   ──────────────        │   │
│  │   • Customer Greet...   │ │   • Refund Policy...    │   │
│  │   • Data Extract...     │ │   • Compliance Ch...    │   │
│  │   • Support Triag...    │ │                          │   │
│  └─────────────────────────┘ └─────────────────────────┘   │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Usage Over Time (7 days)                 │   │
│  │   ▁▂▃▅▇█▆▄▃▂▁▂▃▅▇█▆▄▃▂▁▂▃▅▇█▆▄▃▂▁▂▃▅▇             │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

- **KPI Cards**: Total prompts, Pending reviews, Published count, Usage today
- **Recent Prompts**: Latest 5 prompts by `updatedAt`
- **Approval Queue**: Prompts in `IN_REVIEW` (visible only to REVIEWER+)
- **Usage Chart**: 7-day usage trend (AUTHOR+ only)

#### Prompt Library (`/prompts`)

- Top: Search bar (debounced, maps to `name` in `PromptSearchCriteria`)
- Left filter panel: Status chips, Impact chips, Category dropdown, Tag multi-select, Date range
- Main: Paginated grid/list toggle of `prompt-card` components
- Pagination: Page size selector (10/20/50), page navigation
- FAB: "Create Prompt" button (AUTHOR+ only)

#### Prompt Detail (`/prompts/[id]`)

**Tabbed layout:**

| Tab | Content | Min Role |
|---|---|---|
| **Content** | Full prompt text (rendered in monospace), metadata sidebar (status, impact, owner, category, tags, variables), action buttons (Edit, Submit for Review, Publish, Retire) | VIEWER |
| **Versions** | Timeline of all versions with content diff viewer (side-by-side or unified) | VIEWER |
| **Approvals** | Approval history timeline, approve/reject actions for current pending | REVIEWER |
| **Audit** | Paginated audit log with action, actor, status transition, timestamp | REVIEWER |
| **Usage** | Usage history table + aggregation chart, record usage button | AUTHOR |

**Action Buttons (context-aware):**

| Current Status | Actions Shown | Role Required |
|---|---|---|
| DRAFT | Edit, Submit for Review, Delete | AUTHOR (owner) |
| IN_REVIEW | Approve, Reject | REVIEWER |
| APPROVED | Publish | ADMIN |
| PUBLISHED | Retire | ADMIN |
| RETIRED | Archive | ADMIN |

#### Create / Edit Prompt (`/prompts/new`, `/prompts/[id]/edit`)

Multi-section form:

1. **Basic Info**: Name, Description, Model Hint
2. **Content**: Large textarea with monospace font, line numbers, placeholder highlighting for `{{variables}}`
3. **Classification**: Business Impact (radio group), Category (dropdown), Tags (multi-select combobox)
4. **Variables**: Dynamic variable builder (name, type, description, default value, required toggle, drag-to-reorder)
5. **Preview**: Live preview of rendered prompt with sample variable values

#### Review Queue (`/review`)

- Filtered view of prompts with `status = IN_REVIEW`
- Cards show: prompt name, author, submission time, business impact
- Click opens prompt detail on Approvals tab
- Bulk actions: Approve/Reject multiple (ADMIN only)

---

### Phase 6 — Role-Based UI

#### Navigation Visibility

| Menu Item | VIEWER | AUTHOR | REVIEWER | ADMIN |
|---|---|---|---|---|
| Dashboard | ✅ | ✅ | ✅ | ✅ |
| Prompt Library | ✅ | ✅ | ✅ | ✅ |
| Create Prompt | ❌ | ✅ | ❌ | ✅ |
| Review Queue | ❌ | ❌ | ✅ | ✅ |
| Categories | ✅ | ✅ | ✅ | ✅ |
| Global Audit | ❌ | ❌ | ❌ | ✅ |

#### Component-Level Guards

```tsx
// Role guard component
<RequireRole role="AUTHOR">
  <Button>Create Prompt</Button>
</RequireRole>

// Hook-level check
const { hasRole } = useAuth();
if (hasRole('REVIEWER')) { /* show approve button */ }
```

---

### Phase 7 — Polish & UX

| Feature | Implementation |
|---|---|
| **Dark/Light Mode** | `next-themes` with system preference detection |
| **Optimistic Updates** | TanStack Query `onMutate` for approve/reject |
| **Toast Notifications** | Sonner for success/error feedback on all mutations |
| **Keyboard Shortcuts** | `Cmd+K` → global search, `N` → new prompt, `Esc` → close modals |
| **Responsive** | Mobile sidebar → bottom nav, stacked layouts below `lg` breakpoint |
| **Loading States** | Skeleton cards/tables matching real content dimensions |
| **Error Boundaries** | Per-page error boundaries with retry buttons |
| **Empty States** | Illustrated empties with contextual CTAs |
| **Content Diff Viewer** | Side-by-side version comparison with line-level highlighting |

---

## Folder Structure (Final)

```
frontend/
├── next.config.ts
├── tailwind.config.ts
├── package.json
├── tsconfig.json
│
├── public/
│   └── favicon.ico
│
├── src/
│   ├── app/
│   │   ├── layout.tsx                    ← Root layout (providers, fonts, theme)
│   │   ├── globals.css                   ← Design tokens, glass effects
│   │   ├── page.tsx                      ← Dashboard
│   │   ├── (auth)/
│   │   │   ├── layout.tsx                ← Centered auth layout
│   │   │   ├── login/page.tsx
│   │   │   ├── signup/page.tsx
│   │   │   └── auth/callback/route.ts    ← OAuth callback
│   │   ├── (app)/
│   │   │   ├── layout.tsx                ← App shell (sidebar + top bar)
│   │   │   ├── prompts/
│   │   │   │   ├── page.tsx              ← Prompt Library
│   │   │   │   ├── new/page.tsx          ← Create Prompt
│   │   │   │   └── [id]/
│   │   │   │       ├── page.tsx          ← Prompt Detail
│   │   │   │       └── edit/page.tsx     ← Edit Prompt
│   │   │   ├── review/page.tsx           ← Review Queue
│   │   │   ├── categories/page.tsx       ← Category Browser
│   │   │   ├── audit/page.tsx            ← Global Audit Log
│   │   │   └── settings/page.tsx         ← User Settings
│   │   └── not-found.tsx
│   │
│   ├── components/
│   │   ├── ui/                           ← shadcn/ui primitives
│   │   ├── layout/
│   │   │   ├── app-shell.tsx
│   │   │   ├── sidebar.tsx
│   │   │   └── top-bar.tsx
│   │   ├── prompts/
│   │   │   ├── prompt-card.tsx
│   │   │   ├── prompt-form.tsx
│   │   │   ├── variable-builder.tsx
│   │   │   └── search-filters.tsx
│   │   ├── approvals/
│   │   │   └── approval-dialog.tsx
│   │   ├── versions/
│   │   │   └── version-timeline.tsx
│   │   ├── audit/
│   │   │   └── audit-timeline.tsx
│   │   ├── usage/
│   │   │   └── usage-chart.tsx
│   │   ├── categories/
│   │   │   └── category-tree.tsx
│   │   └── shared/
│   │       ├── status-badge.tsx
│   │       ├── approval-badge.tsx
│   │       ├── impact-badge.tsx
│   │       ├── role-badge.tsx
│   │       ├── kpi-card.tsx
│   │       ├── data-table.tsx
│   │       ├── empty-state.tsx
│   │       ├── skeleton-card.tsx
│   │       ├── confirm-dialog.tsx
│   │       └── require-role.tsx
│   │
│   ├── hooks/
│   │   ├── use-prompts.ts
│   │   ├── use-search.ts
│   │   ├── use-approvals.ts
│   │   ├── use-versions.ts
│   │   ├── use-audit.ts
│   │   ├── use-usage.ts
│   │   ├── use-categories.ts
│   │   └── use-tags.ts
│   │
│   ├── lib/
│   │   ├── api/
│   │   │   ├── client.ts
│   │   │   ├── prompts.ts
│   │   │   ├── approvals.ts
│   │   │   ├── versions.ts
│   │   │   ├── audit.ts
│   │   │   ├── usage.ts
│   │   │   ├── search.ts
│   │   │   ├── categories.ts
│   │   │   └── tags.ts
│   │   ├── supabase/
│   │   │   ├── client.ts
│   │   │   ├── server.ts
│   │   │   └── middleware.ts
│   │   └── fonts.ts
│   │
│   ├── types/
│   │   ├── api.ts
│   │   ├── prompt.ts
│   │   ├── approval.ts
│   │   ├── version.ts
│   │   ├── audit.ts
│   │   ├── usage.ts
│   │   ├── category.ts
│   │   ├── tag.ts
│   │   └── auth.ts
│   │
│   ├── contexts/
│   │   └── auth-context.tsx
│   │
│   └── middleware.ts                     ← Route protection + session refresh
│
├── .env.local                            ← NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, API_BASE_URL
└── .env.example
```

---

## Verification Plan

### Automated Tests
```bash
# Lint and type check
npm run lint
npx tsc --noEmit

# Unit tests (components + hooks)
npm run test

# E2E tests (Playwright)
npx playwright test
```

### Manual Verification
- Login/signup flow with Supabase
- Create a prompt end-to-end → verify appears in library
- Submit for review → verify reviewer sees it in queue
- Approve → verify status transitions
- Version history shows all versions with content
- Audit trail records all actions
- Role-based UI elements hide/show correctly per role
- Dark/light mode toggle
- Responsive layout on mobile breakpoints
- Search/filter combinations return correct results
