# Code Conventions

## General Style

- **Language:** Portuguese (pt-BR) for all user-facing text, component labels, comments, some variable names (e.g., `matricula`, `empréstimos`)
- **TypeScript:** Strict mode enabled, explicit typing preferred, interfaces over type aliases for object shapes
- **Components:** Functional components only, no class components
- **Client directives:** All interactive components have `"use client"` at the top

## Import Style

```typescript
// 1. React/Next.js imports
import { useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";

// 2. Local imports using path alias @/*
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";
import type { LabSessionUser } from "@/types/lab-session";
```

- Path alias `@/*` → `./` (configured in `tsconfig.json`)
- `type` keyword used for type-only imports
- No barrel files (each module imported directly)

## Component Patterns

### Component Structure
```typescript
"use client";

import { ... } from "react";
import { cn } from "@/lib/utils";

export interface ComponentProps { ... }

export function Component({ children, className, ...props }: ComponentProps) {
  return ( ... );
}
```

### Variant Pattern (Button example)
```typescript
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost";
}
// Variants applied via cn() with conditional class strings
```

### Forward Ref Pattern (Input example)
```typescript
export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, className, ...props },
  ref
) { ... });
```

## Styling Conventions

### CSS Custom Properties
Design tokens defined in `app/src/globals.css`:
```css
:root {
  --color-primary: #0284c7;
  --color-bg: #ffffff;
  --color-text: #0c4a6e;
  --color-border: #bae6fd;
  --radius: 0.75rem;
}
```

### Tailwind Usage
- **Semantic variables in classes:** `bg-[var(--color-primary)]`, `text-[var(--color-text)]`
- **Custom azure palette:** `text-azure-800`, `bg-azure-200/50` (defined in `@theme` block)
- **Utility helper:** `cn()` from `lib/utils.ts` for conditional class merging
- **Responsive:** Mobile-first with `sm:`, `lg:` breakpoints
- **Transitions:** `transition-colors`, `transition-[transform,box-shadow]` with `duration-200`

### Common Class Patterns
```
// Card-like surfaces
"rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-4"

// Active sidebar link
"bg-[var(--color-primary)] text-white shadow-sm"

// Focus-visible
"focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-primary)]"
```

## State Management

- **Global state:** `AuthContext` only — manages user session
- **Local state:** `useState` per-component for UI state (modals, filters, tabs)
- **No external state library** (no Redux, Zustand, etc.)
- **Data fetching:** Direct mock imports — no SWR, React Query, or `fetch()`

## Error Handling

- **Auth errors:** Returned as `string | null` from `login()` / `register()` (null = success)
- **Form validation:** Zod schemas with `react-hook-form` resolvers
- **User feedback:** `alert()` for unimplemented actions (TODOs), Toast component for settings
- **Auth guards:** Silent redirect (no error message) — `AuthGate` redirects to `/login`, `AdminGate` redirects to `/dashboard`

## Naming Conventions

| Domain | Convention | Examples |
|--------|-----------|----------|
| Components | PascalCase | `AppShell`, `AuthGate`, `NewLoanForm` |
| Files (components) | PascalCase `.tsx` | `AppSidebar.tsx`, `FormCard.tsx` |
| Files (utils/mocks/types) | kebab-case `.ts` | `session-user.ts`, `lab-session.ts` |
| Hooks | `use` prefix, camelCase | `useAuth` |
| Constants | SCREAMING_SNAKE | `MOCK_LOANS`, `NAV_ITEMS` |
| Interfaces | PascalCase | `LabSessionUser`, `NavItemConfig` |
| Type aliases | PascalCase | `AuthStatus`, `LoanStatus` |
| CSS variables | kebab-case with `--color-` prefix | `--color-primary`, `--color-bg-subtle` |
| Permissions | snake_case (pt-BR) | `ver_itens`, `manipular_estoque` |
| Routes | kebab-case | `/admin/settings/permissions` |

## Portuguese-First Convention

Domain-specific terms use Portuguese throughout:
- **Permission keys:** `ver_itens`, `pedir_emprestimos`, `gerenciar_usuarios`
- **UI labels:** "Buscar itens", "Empréstimos", "Configurações"
- **Tag names:** "laboratorista", "estagiário", "aluno"
- **Comments:** Mix of Portuguese and English
- **Error messages:** Portuguese for user-facing, English for developer notes

## File Organization Rules

1. **One component per file** — named exports matching filename
2. **Co-located page components** — e.g., `ApprovalsActions.tsx` next to `page.tsx`
3. **Types in `types/`** — domain-specific interfaces in separate files
4. **Mocks in `mocks/`** — one file per domain entity
5. **Validations in `lib/validations/`** — Zod schemas per domain
6. **No index files / barrel exports** — import directly from source file
