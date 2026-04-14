# Phase 5: Fundação do Backend — Research

## Research Summary

Investigated best practices for setting up a Node.js + Express + TypeScript + Prisma + PostgreSQL backend in 2025. Key findings inform the architecture and tooling decisions for the LabControl backend.

## Architecture Decision: Layered MVC

For a CRUD-heavy REST API like LabControl (not a complex domain-driven app), a **layered MVC approach** is the best fit:

```
src/
├── config/           # Env validation, database client, app config
├── controllers/      # HTTP request handling (thin — extract, validate, delegate)
├── services/         # Business logic (data access, validation rules)
├── routes/           # Express router definitions
├── middlewares/      # Auth, error handler, validation, CORS
├── utils/            # Helpers, response formatters
├── types/            # TypeScript interfaces/types
├── app.ts            # Express app setup (middleware chain)
└── server.ts         # Entry point (listen + graceful shutdown)
```

**Rationale:** Clean Architecture / DDD is overkill for this project. A simple controllers → services → Prisma chain is sufficient and matches the team's Express familiarity.

## ORM: Prisma

**Why Prisma over alternatives:**
- Auto-generated TypeScript types from schema → zero manual type maintenance
- Declarative schema language → easy to understand migrations
- Built-in migration system (`prisma migrate dev`)
- Excellent PostgreSQL support
- `@prisma/client` provides type-safe queries
- Already uses Zod in frontend → can share validation patterns

## Database Schema (Initial Tables)

Based on frontend types (`types/user.ts`, `types/loan.ts`, `types/lab-inventory.ts`, `types/settings.ts`, `types/lab-session.ts`):

### Core Tables Needed
1. **User** — id, name, email, password (hashed), matricula, role, tagId, phone, avatarUrl, isActive, createdAt, updatedAt
2. **Tag** — id, name, color, description, permissions (JSON with 11 keys), createdAt, updatedAt
3. **Category** — id, name, createdAt, updatedAt
4. **InventoryItem** — id, name, description, category (FK), quantity, availableQuantity, loanedQuantity, image, isActive, createdAt, updatedAt
5. **Loan** — id, borrowerId (FK), status, loanDate, dueDate, returnedDate, notes, labObservation, returnedLate, createdAt, updatedAt
6. **LoanItem** — id, loanId (FK), inventoryItemId (FK), inventoryItemName, quantity
7. **Notification** — id, userId (FK), title, body, read, type, createdAt
8. **UserPermissionOverride** — id, userId (FK), tagId (FK), customOverrides (JSON)

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js 20 LTS | Stable, long-term support |
| Framework | Express 4.x | Mature, well-documented |
| Language | TypeScript 5.x (strict) | Matches frontend |
| ORM | Prisma 6.x | Type-safe, great DX |
| Database | PostgreSQL 16 | Robust, free, relational |
| Dev runner | tsx (watch mode) | Fast TS execution, no compile step in dev |
| Env validation | dotenv + Zod | Already using Zod in frontend |
| Logger | Console (v1) → pino (later) | Keep simple for prototype |
| CORS | cors package | Standard Express middleware |
| Error format | ApiError from frontend types | Consistent front ↔ back |
| Response format | ApiResponse<T> / PaginatedResponse<T> | Already defined in frontend |
| Package manager | pnpm | Matches frontend |

## Response Format Alignment

The backend MUST return exactly these shapes (from `frontend/types/api.ts`):

```typescript
// Success
{ data: T, message: string, success: true }

// Paginated
{ data: T[], total: number, page: number, perPage: number, totalPages: number }

// Error
{ message: string, statusCode: number, errors?: Record<string, string[]> }
```

## Dependencies for Phase 5

### Production
- `express` — HTTP framework
- `cors` — CORS middleware
- `dotenv` — Env loading
- `@prisma/client` — Database client
- `zod` — Runtime validation (env vars)

### Development
- `typescript` — TS compiler
- `@types/express` — Express type defs
- `@types/cors` — CORS type defs
- `@types/node` — Node type defs
- `tsx` — Fast TS execution (dev server)
- `prisma` — CLI for migrations

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| PostgreSQL not installed locally | Document install steps, use Docker alternative |
| Prisma migration issues | Start with simple schema, iterate |
| CORS misconfiguration | Test from frontend immediately |

## RESEARCH COMPLETE

Documents written: 1
Ready for planning.
