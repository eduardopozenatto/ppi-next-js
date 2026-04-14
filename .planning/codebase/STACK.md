# Technology Stack

## Language & Runtime

| Aspect | Details |
|--------|---------|
| **Language** | TypeScript 5.x (strict mode enabled) |
| **Runtime** | Node.js (via Next.js) |
| **Module system** | ESNext modules, bundler resolution |
| **Target** | ES2017 |

## Framework

| Aspect | Details |
|--------|---------|
| **Framework** | Next.js 16.1.6 (App Router) |
| **React** | React 19.2.3 / ReactDOM 19.2.3 |
| **Routing** | App Router with route groups `(auth)` / `(public)` |
| **Rendering** | Client-side rendering — all interactive components use `"use client"` |
| **Font** | Poppins via `next/font/google` (weights 300, 400, 500, 700) |

## Styling

| Aspect | Details |
|--------|---------|
| **CSS Framework** | Tailwind CSS v4.2.0 |
| **PostCSS** | `@tailwindcss/postcss` plugin |
| **Utility library** | `clsx` (2.1.1) + `tailwind-merge` (3.5.0) via `cn()` helper in `lib/utils.ts` |
| **Design tokens** | CSS custom properties in `app/src/globals.css` (semantic color system: `--color-primary`, `--color-bg`, `--color-text`, etc.) |
| **Custom theme** | `@theme` block with `azure-50` through `azure-900` color palette |
| **Tailwind config** | `tailwind.config.ts` — content paths for `pages/`, `components/`, `app/`, custom gradients |

## Form Handling & Validation

| Aspect | Details |
|--------|---------|
| **Form library** | `react-hook-form` 7.72.0 |
| **Resolver** | `@hookform/resolvers` 5.2.2 |
| **Schema validation** | Zod 4.3.6 |
| **Validation schemas** | `lib/validations/inventory.ts`, `lib/validations/loan.ts` |

## Authentication

| Aspect | Details |
|--------|---------|
| **Auth library** | `next-auth` 4.24.13 (installed but currently unused) |
| **Current auth** | Custom `AuthContext` with in-memory mock user database |
| **Auth hook** | `useAuth()` re-exported from `hooks/useAuth.ts` → `contexts/AuthContext.tsx` |
| **Route protection** | `AuthGate` and `AdminGate` layout components with client-side redirect |

## Package Management

| Aspect | Details |
|--------|---------|
| **Package manager** | pnpm (lockfile: `pnpm-lock.yaml`) |
| **Monorepo** | Not used — single `frontend/` directory |

## Dev Tooling

| Aspect | Details |
|--------|---------|
| **Linting** | ESLint 9.x with `eslint-config-next` (core-web-vitals + typescript presets) |
| **Type checking** | `tsc --noEmit` (strict mode) |
| **Build** | `next build` |
| **Dev server** | `next dev` |

## Configuration Files

| File | Purpose |
|------|---------|
| `frontend/package.json` | Dependencies and scripts |
| `frontend/tsconfig.json` | TypeScript — strict, path alias `@/*` → `./*` |
| `frontend/next.config.ts` | Next.js — empty/default config |
| `frontend/tailwind.config.ts` | Tailwind — content paths, custom gradients |
| `frontend/postcss.config.mjs` | PostCSS — `@tailwindcss/postcss` plugin |
| `frontend/eslint.config.mjs` | ESLint — flat config with Next.js presets |
| `frontend/proxy.ts` | Next.js middleware (no-op pass-through) |

## Dependencies Summary

### Production
- `next` 16.1.6
- `react` / `react-dom` 19.2.3
- `next-auth` 4.24.13
- `react-hook-form` 7.72.0
- `@hookform/resolvers` 5.2.2
- `zod` 4.3.6
- `clsx` 2.1.1
- `tailwind-merge` 3.5.0

### Development
- `tailwindcss` 4.2.0
- `@tailwindcss/postcss` 4.2.0
- `typescript` 5.x
- `eslint` 9.x / `eslint-config-next` 16.1.6
- `postcss` 8.5.6
- `autoprefixer` 10.4.24
