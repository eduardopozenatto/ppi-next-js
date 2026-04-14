# Testing

## Current State

**No tests exist in this project.**

There are:
- No test files (`*.test.ts`, `*.spec.ts`, `*.test.tsx`, `*.spec.tsx`)
- No test framework configured (no Jest, Vitest, Playwright, or Cypress)
- No test scripts in `package.json`
- No `__tests__/` directories
- No test configuration files

## Test Infrastructure

| Aspect | Status |
|--------|--------|
| Unit test framework | ❌ Not installed |
| Component testing | ❌ Not configured |
| Integration testing | ❌ Not configured |
| E2E testing | ❌ Not configured |
| CI/CD test pipeline | ❌ Not configured |
| Test coverage | ❌ Not tracked |

## Available Quality Checks

The only code quality tool configured is:
- **ESLint** (`npm run lint`) — `eslint-config-next` with core-web-vitals and TypeScript rules
- **TypeScript** (`tsc --noEmit`) — strict type checking

## Recommendations for Test Setup

### Unit/Component Testing
Given the Next.js 16 + React 19 stack, recommended setup:
- **Vitest** as test runner (faster than Jest with Next.js)
- **@testing-library/react** + `@testing-library/user-event` for component tests
- **msw** (Mock Service Worker) for API mocking when backend is integrated

### Key Areas to Test
1. **Auth flows:** Login, register, logout via `AuthContext`
2. **Permission system:** `navVisible()`, `isLabAdmin()`, gate components
3. **Form validation:** Zod schemas in `lib/validations/`
4. **Data formatting:** `formatDate()`, `formatCurrency()`, `cn()`
5. **Mock data helpers:** `getMockInventoryItem()`, `getMockLoan()`

### E2E Testing
- **Playwright** recommended for Next.js App Router testing
- Key flows: login → dashboard → create loan → approve loan
