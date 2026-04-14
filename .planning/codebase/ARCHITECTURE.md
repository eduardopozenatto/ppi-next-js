# Architecture

## Pattern

**Frontend-only SPA** using Next.js App Router. The application uses route groups, layout nesting, and client-side state management to emulate a full-stack lab management system. Currently runs entirely on mock data with no backend.

## Application Layers

```
┌─────────────────────────────────────────────────┐
│                  Route Groups                    │
│  (public) — login, register, recovery           │
│  (auth)   — all authenticated pages             │
├─────────────────────────────────────────────────┤
│              Layout Hierarchy                    │
│  RootLayout → AppProviders → AuthProvider       │
│  (auth)/layout → AuthGate → AppShell → Toast    │
│  (auth)/admin/layout → AdminGate                │
├─────────────────────────────────────────────────┤
│              UI Component Layer                  │
│  Primitives: Button, Input, Link                │
│  Shared: PageHeader, EmptyState, Toast          │
│  Domain: auth/, inventory/, loans/, admin/      │
│  Layout: AppShell, AppSidebar, AuthGate         │
├─────────────────────────────────────────────────┤
│              State & Data Layer                  │
│  Context: AuthContext (user session)             │
│  Hooks: useAuth()                               │
│  Mock data: mocks/*.ts (in-memory arrays)       │
├─────────────────────────────────────────────────┤
│              Library Layer                       │
│  lib/utils.ts — cn(), formatDate(), formatCurrency() │
│  lib/navigation.ts — NAV_ITEMS config, permission helpers │
│  lib/validations/ — Zod schemas                  │
│  lib/api/client.ts — BASE_URL stub               │
│  types/ — TypeScript interfaces                  │
└─────────────────────────────────────────────────┘
```

## Data Flow

### Authentication Flow
1. User visits any `(auth)` route
2. `AuthGate` checks `useAuth().status`
3. If `status === "guest"` → redirect to `/login`
4. Login form calls `AuthContext.login()` → checks `MOCK_USERS_DB`
5. On success → sets `currentUser` state, `status` → `"authenticated"`
6. Registration calls `mockRegisterUser()` → adds to `MOCK_USERS_DB` in-memory

### Navigation & Permission Flow
1. `AppSidebar` renders items from `NAV_ITEMS` config
2. Each item filtered by `navVisible(item, user)` — checks `user.userPermissions[permission]`
3. Admin section requires `isLabAdmin(user)` → tag name is `"laboratorista"`
4. `AdminGate` layout wrapper enforces admin check before rendering admin routes

### Page Data Flow
1. Pages import mock data directly (e.g., `import { MOCK_LOANS } from "@/mocks/loans"`)
2. Local component state (`useState`) manages UI interactions (filters, modals, form data)
3. Form submissions log console warnings or show alerts (TODOs for real API calls)
4. Permission/tag updates propagate through `AuthContext.updateSessionPermissions()` and `updateSessionTag()`

## Key Abstractions

### AuthContext (`contexts/AuthContext.tsx`)
Central authentication state with:
- `login(email, password)` — mock credential check
- `register(name, email, matricula, password)` — mock user creation
- `logout()` — clears session
- `updateSessionPermissions(permissions)` — live permission updates
- `updateSessionTag(tagName, tagColorClass)` — live tag updates

### Navigation Config (`lib/navigation.ts`)
Declarative nav configuration with:
- `NavItemConfig[]` — id, href, label, icon, permission key, section
- `navVisible(item, user)` — permission-based visibility
- `isLabAdmin(user)` — admin role check via tag name

### Permission System (`types/settings.ts`)
11-permission model using `TagPermissions` interface:
- `ver_itens`, `pedir_emprestimos`, `ver_notificacoes`
- `manipular_estoque`, `gerar_relatorios`, `aprovar_emprestimos`
- `gerenciar_itens`, `gerenciar_usuarios`, `gerenciar_roles`
- `gerenciar_categorias`, `gerenciar_permissoes`

Tags define base permissions; per-user overrides via `UserPermissionOverride`.

## Entry Points

| Entry | File | Purpose |
|-------|------|---------|
| Root layout | `app/layout.tsx` | HTML shell, font loading, `AppProviders` |
| Public landing | `app/(public)/page.tsx` | Login/register form |
| Login | `app/(public)/login/page.tsx` | Login page |
| Register | `app/(public)/register/page.tsx` | Registration page |
| Dashboard | `app/(auth)/dashboard/page.tsx` | Main dashboard (post-login) |
| Dev server | `next dev` | Development entry point |
