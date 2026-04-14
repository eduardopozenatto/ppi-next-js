# External Integrations

## Current State

**No backend API is connected.** The entire application runs on client-side mock data. Every data source has a `// TODO: substituir por chamada real quando backend estiver pronto` comment indicating future API integration.

## API Client (Stub)

| File | Purpose |
|------|---------|
| `lib/api/client.ts` | Exports `BASE_URL` from `NEXT_PUBLIC_API_URL` env var (default: `http://localhost:3001/api`) |

The API client is a placeholder — no actual HTTP calls are made anywhere in the codebase.

## Mock Data Layer (In-Memory)

All data is served from `mocks/` files, imported directly into page and component modules:

| Mock file | Data type | Key exports |
|-----------|-----------|-------------|
| `mocks/session-user.ts` | Auth users | `MOCK_USERS_DB`, `MOCK_LABORATORISTA`, `MOCK_ESTAGIARIO`, `MOCK_ALUNO`, `mockRegisterUser()` |
| `mocks/inventory-items.ts` | Lab equipment | `MOCK_INVENTORY_ITEMS`, `getMockInventoryItem()` |
| `mocks/loans.ts` | Loan records | `MOCK_LOANS`, `getMockLoan()` |
| `mocks/notifications.ts` | User notifications | `MOCK_NOTIFICATIONS` |
| `mocks/settings.ts` | Tags, categories, permission overrides | `MOCK_TAGS`, `MOCK_CATEGORIES`, `MOCK_PERMISSION_OVERRIDES` |
| `mocks/users.ts` | Admin user list | `MOCK_ADMIN_USERS` |
| `mocks/cart.ts` | Shopping cart lines | `MOCK_CART_LINES` |
| `mocks/storage-categories.ts` | Inventory categories | `MOCK_STORAGE_CATEGORIES` |

## Planned API Endpoints (from TODOs)

The following API endpoints are referenced in TODO comments throughout the codebase:

| Endpoint | Method | Used in |
|----------|--------|---------|
| `GET /api/auth/me` | GET | `types/lab-session.ts` |
| `GET /api/inventory` | GET | `types/lab-inventory.ts` |
| `POST /api/inventory` | POST | `components/inventory/NewInventoryItemForm.tsx` |
| `POST /api/loans` | POST | `components/loans/NewLoanForm.tsx`, `app/(auth)/cart/page.tsx` |
| `PUT /api/loans/:id` | PUT | `app/(auth)/approvals/ApprovalsActions.tsx` (approve) |
| `POST /api/auth/recovery` | POST | `components/auth/RecoveryForm.tsx` |
| `POST /api/auth/profile` | POST | `app/(auth)/settings/profile/ProfileSummary.tsx` |
| `POST /api/settings/notifications` | POST | `app/(auth)/settings/page.tsx` |
| `PATCH /api/admin/settings` | PATCH | `app/(auth)/admin/settings/SystemSettingsMock.tsx` |

## Authentication Providers

- **NextAuth** (`next-auth` 4.24.13) is installed as a dependency but **not currently wired up**. No `[...nextauth]` route handler exists.
- Authentication is fully client-side via `AuthContext` using mock data.

## External Services

**None configured.** No database connections, external APIs, webhook integrations, third-party SDKs, or cloud services are currently in use.

## Environment Variables

| Variable | Default | Purpose |
|----------|---------|---------|
| `NEXT_PUBLIC_API_URL` | `http://localhost:3001/api` | Backend API base URL (unused until backend is ready) |

## Databases

**None.** All state is ephemeral (in-memory mock data that resets on page reload/server restart).
