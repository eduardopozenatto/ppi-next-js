# Concerns

## Critical Issues

### 🔴 No Backend — Entire App Runs on Mock Data
Every data source uses in-memory JavaScript objects from `mocks/`. All CRUD operations are simulated with `useState` and `alert()`. Data is lost on page refresh. This is by design (frontend prototype), but creates:
- **No data persistence** — registration, loans, settings changes are ephemeral
- **19 TODO comments** marking unimplemented API calls
- **Security bypass** — passwords stored in plain text in mock objects

### 🔴 Hardcoded Plain-Text Passwords
`mocks/session-user.ts` stores user passwords as plain strings:
```typescript
password: "1234"
```
While these are mock objects, this pattern could leak into production if the mock-to-API transition isn't handled carefully. The `LabSessionUser` type includes `password: string`.

### 🔴 No Tests
Zero test files, no test framework installed. Any refactoring or feature addition has no safety net. See `TESTING.md` for details.

## High-Priority Technical Debt

### 🟠 NextAuth Installed But Unused
`next-auth@4.24.13` is a dependency but has no route handler, no configuration, and no usage anywhere. It should either be:
- **Wired up** when backend is ready (replace `AuthContext` mock auth)
- **Removed** to reduce bundle size and attack surface

### 🟠 Admin Check Based on String Comparison
`lib/navigation.ts:98`:
```typescript
export function isLabAdmin(user: LabSessionUser): boolean {
  return user.tag.name === "laboratorista";
}
```
Admin access is determined by matching the tag name string `"laboratorista"`. This is fragile:
- Case-sensitive comparison
- No enum or constant for valid admin tag names
- Any user whose tag is renamed loses admin access silently

### 🟠 Logout Uses `window.location.href`
`components/layout/AppSidebar.tsx:67`:
```typescript
onClick={() => {
  logout();
  window.location.href = "/login";
}}
```
Uses imperative navigation instead of Next.js `router.push()`, causing a full page reload. Should use `useRouter().push("/login")` for consistency.

### 🟠 Redundant Dependencies
- `tw-merge@0.0.1-alpha.3` — appears to be an alpha/duplicate of `tailwind-merge` (which is already installed at v3.5.0)
- `pnpm@10.32.1` — listed as a dependency (should be a global tool, not a project dependency)
- `autoprefixer@10.4.24` — Tailwind CSS v4 handles vendor prefixes natively; this may be unnecessary

### 🟠 Tailwind Config Mismatch
`tailwind.config.ts` references `./pages/**/*` (Pages Router convention), but the app uses App Router (`./app/**/*`). While this shouldn't cause issues (the `app/` glob also exists), it indicates the config was copied from a Pages Router template without cleanup.

## Medium-Priority Concerns

### 🟡 CSS Token Architecture: Two Systems
The codebase uses two overlapping styling systems:
1. CSS custom properties in `:root` (`--color-primary`, `--color-border`, etc.)
2. Tailwind `@theme` block with `azure-*` palette

Components mix both: `bg-[var(--color-primary)]` alongside `text-azure-800`. This creates maintenance confusion about which system is authoritative.

### 🟡 Mock Data Inconsistencies
- `mocks/storage-categories.ts` has inconsistent casing: `["sensores", "Multimetros digitais"]`
- `mocks/loans.ts` references `inventoryItemId: "inv-5"` and `"inv-6"` but `mocks/inventory-items.ts` only defines `inv-1` through `inv-4`
- `mocks/users.ts` user IDs (`admin-1`, `user-1`, etc.) don't match session user IDs (numeric: `1`, `2`, `3`)

### 🟡 Empty Directories
- `app/_data/` — empty, seemingly reserved for future data loading
- `components/search/` — empty, reserved for search components
These add clutter and may confuse contributors.

### 🟡 `app/types.ts` — Misplaced Type
Contains only `export type Mode = "login" | "register"` — should be co-located with the auth components that use it, or in `types/`.

### 🟡 No Error Boundaries
No React error boundaries exist. Any runtime error in a component tree will crash the entire page with the default Next.js error screen.

### 🟡 No Loading States
Most data operations (forms, mock API calls) lack loading spinners or skeleton UI. The `alert()` calls for unimplemented features provide poor UX.

## Low-Priority / Future Concerns

### 🟢 No Accessibility Audit
While basic ARIA attributes exist (`aria-label`, `aria-expanded`, `role="status"`), there's been no comprehensive accessibility audit. Screen reader testing and keyboard navigation should be verified.

### 🟢 No SEO Beyond Root
`app/layout.tsx` defines a base title template and description, but individual pages don't set `metadata` exports for page-specific SEO.

### 🟢 No i18n Infrastructure
Although the app is Portuguese-first (`lang="pt"`), there's no internationalization framework. If multilingual support is needed later, all hardcoded strings in components would need extraction.

### 🟢 Image Optimization
Inventory items use placeholder SVGs (`buttonIcons/box.svg`) instead of real images. The `NewInventoryItemForm` has image upload code but it's a TODO.

### 🟢 `next.config.ts` Is Empty
The Next.js configuration is default — no image domains, no redirects, no security headers configured. When backend integration happens, `images.domains`, `headers`, and API rewrites will be needed.

## Security Considerations

| Area | Risk | Current State |
|------|------|---------------|
| Authentication | 🔴 High | Mock auth, passwords in plain text |
| Authorization | 🟠 Medium | String-based admin check, client-side only |
| Input validation | 🟡 Low | Zod schemas exist for forms |
| CSRF/XSS | 🟢 Minimal | No API calls to protect (mock data only) |
| Dependencies | 🟡 Low | Unused `next-auth`, alpha-stage `tw-merge` |
| Secrets | 🟢 None | No API keys, tokens, or secrets in codebase |
