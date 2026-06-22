# Mini CRM Build Plan

A modern Client Lead Management System for small businesses, built on TanStack Start + Tailwind + Lovable Cloud (Supabase).

## 1. Backend (Lovable Cloud)

Enable Lovable Cloud, then create the schema via migration:

- **leads**: `id`, `owner_id` (auth.uid), `name`, `email`, `phone`, `source`, `status` (enum: `new` | `contacted` | `converted`), `created_at`, `updated_at`
- **lead_notes**: `id`, `lead_id` (fk → leads, cascade), `author_id`, `body`, `created_at`
- **user_roles** + `app_role` enum + `has_role()` security-definer function (admin role)

RLS:
- Leads & notes: owner can CRUD their own rows; admins (`has_role`) can read/manage all.
- GRANTs to `authenticated` and `service_role`.

Auth:
- Email/password login (admin-only entry). No public signup UI — first user is seeded as admin via migration helper, or admin role is granted manually.

## 2. Routing (TanStack Start)

```
src/routes/
  __root.tsx              shell + QueryClientProvider + onAuthStateChange
  index.tsx               redirect → /dashboard or /auth
  auth.tsx                login form (email/password)
  _authenticated/
    route.tsx             (integration-managed gate)
    dashboard.tsx         stats cards
    leads.index.tsx       leads table
    leads.new.tsx         create lead dialog/page
    leads.$leadId.tsx     lead detail + notes
```

All authenticated routes share a sidebar layout (Dashboard, Leads, Sign out).

## 3. Server functions (`src/lib/*.functions.ts`)

All use `requireSupabaseAuth`:
- `getDashboardStats` → counts by status
- `listLeads` (search/filter by status)
- `getLead(id)` → lead + notes ordered desc
- `createLead`, `updateLead`, `updateLeadStatus`
- `addLeadNote(leadId, body)`

Client uses TanStack Query: `ensureQueryData` in loaders, `useSuspenseQuery` in components, mutations invalidate keys.

## 4. UI

- **Sidebar** (shadcn `sidebar`): logo, nav (Dashboard, Leads), collapse trigger, user email + sign out at bottom.
- **Dashboard**: 4 stat cards (Total / New / Contacted / Converted) with subtle iconography; recent leads preview list.
- **Leads page**: shadcn `table` with columns Name, Email, Phone, Source, Status (colored badge), Created. Search input + status filter + "New lead" button (dialog form with zod validation).
- **Lead detail**: header with name + status selector, info grid (email/phone/source/dates), notes timeline (textarea + "Add note", chronological list with author + timestamp).
- **Auth page**: centered card, email + password, error toast.

Modern design: light theme, neutral background, accent color via design tokens in `src/styles.css`, rounded cards, generous spacing, Inter via `<link>` in root head. Fully responsive (sidebar collapses to icon on mobile).

## 5. Validation & polish

- Zod schemas for lead create/update and note bodies (length limits).
- Toasts (sonner) for success/error.
- Empty states for no leads / no notes.
- Loading skeletons on dashboard + table.

## Open questions before I build

1. **Who can sign in?** Default: only users with the `admin` role in `user_roles` can access the app. First admin is seeded by email — I'll need an email to seed, or I add a one-time "claim admin" button if no admin exists yet. Preference?
2. **Sources** — fixed dropdown (Website, Referral, Social, Email, Other) or free-text field?

I'll proceed with the defaults above (admin-only via claim-first-admin flow, fixed source dropdown with "Other") unless you say otherwise.