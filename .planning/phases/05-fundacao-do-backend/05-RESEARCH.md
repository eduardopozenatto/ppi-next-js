# Phase 5: Fundação do Backend — Research

## Research Summary

Deep investigation of the frontend codebase contract (types, mocks, API client) and best practices for Express + TypeScript + Prisma + PostgreSQL backend setup. This re-research specifically maps every frontend type field to the database schema to prevent mismatches.

## Frontend Contract Analysis (Source of Truth)

### API Response Formats (from `frontend/types/api.ts`)

```typescript
interface ApiResponse<T>      { data: T; message: string; success: boolean }
interface PaginatedResponse<T> { data: T[]; total: number; page: number; perPage: number; totalPages: number }
interface ApiError             { message: string; statusCode: number; errors?: Record<string, string[]> }
```

### Base URL (from `frontend/lib/api/client.ts`)
```
http://localhost:3001/api
```

### Frontend → Backend Type Mapping

#### LabSessionUser (`types/lab-session.ts`) → User table + Tag join
| Frontend field | Type | DB column | Notes |
|---------------|------|-----------|-------|
| `id` | `number` | `id` (String/cuid) | **ID mismatch**: frontend uses numeric ids (1, 2, 3), backend will use cuid. Frontend needs update in Phase 9. |
| `name` | `string` | `name` | Direct map |
| `email` | `string` | `email` (unique) | Direct map |
| `password` | `string` | `password` | Will be hashed via bcrypt in Phase 6 |
| `matricula` | `string?` | `matricula` | Optional |
| `tag.name` | `string` | Tag → `name` via FK | Joined |
| `tag.colorClass` | `string` | Tag → `color` | **Mismatch**: frontend stores Tailwind class (`text-emerald-700`), mock settings stores hex (`#24a148`). Backend stores hex, frontend adapts. |
| `userPermissions` | `TagPermissions` | Computed: Tag.permissions merged with UserPermissionOverride | Business logic in backend |

#### User (`types/user.ts`) → User table (admin list view)
| Frontend field | Type | DB column |
|---------------|------|-----------|
| `id` | `string` | `id` |
| `name` | `string` | `name` |
| `email` | `string` | `email` |
| `role` | `"user" \| "admin"` | `role` (enum) |
| `matricula` | `string?` | `matricula` |
| `tagId` | `string?` | `tagId` (FK) |
| `avatarUrl` | `string?` | `avatarUrl` |
| `phone` | `string?` | `phone` |
| `createdAt` | `string` | `createdAt` (DateTime → ISO string) |
| `isActive` | `boolean` | `isActive` |

#### LabInventoryListItem (`types/lab-inventory.ts`) → InventoryItem table
| Frontend field | Type | DB column | Notes |
|---------------|------|-----------|-------|
| `id` | `string` | `id` | Direct |
| `name` | `string` | `name` | Direct |
| `isActive` | `boolean` | `isActive` | Direct |
| `quantity` | `number` | `quantity` | Total count |
| `availableQuantity` | `number` | `availableQuantity` | Computed in future |
| `loanedQuantity` | `number` | `loanedQuantity` | Computed in future |
| `image` | `string` | `image` | URL/path |
| `category` | `string` | Category → `name` via FK | **Important**: frontend stores category NAME as string, not ID. API response must include category name. |
| `description` | `string` | `description` | Direct |

#### Loan (`types/loan.ts`) → Loan table + LoanItem join
| Frontend field | Type | DB column | Notes |
|---------------|------|-----------|-------|
| `id` | `string` | `id` | Direct |
| `borrowerName` | `string` | User → `name` via FK | Denormalized in response |
| `borrowerEmail` | `string` | User → `email` via FK | Denormalized in response |
| `borrowerId` | `string` | `borrowerId` (FK) | Direct |
| `items` | `LoanItem[]` | LoanItem relation | Nested join |
| `status` | `LoanStatus` | `status` (enum) | Direct |
| `loanDate` | `string` | `loanDate` (DateTime) | ISO string |
| `dueDate` | `string` | `dueDate` (DateTime) | ISO string |
| `returnedDate` | `string?` | `returnedDate` (DateTime?) | ISO string |
| `notes` | `string?` | `notes` | Direct |
| `labObservation` | `string?` | `labObservation` | Direct |
| `returnedLate` | `boolean?` | `returnedLate` | Default false |
| `createdAt` | `string` | `createdAt` | ISO string |
| `updatedAt` | `string` | `updatedAt` | ISO string |

#### Tag (`types/settings.ts`) → Tag table
| Frontend field | Type | DB column | Notes |
|---------------|------|-----------|-------|
| `id` | `string` | `id` | Direct |
| `name` | `string` | `name` (unique) | Direct |
| `color` | `string` | `color` | Hex color like `#0f62fe` |
| `description` | `string` | `description` | Direct |
| `permissions` | `TagPermissions` | `permissions` (Json) | 11 boolean keys |
| `userCount` | `number?` | Computed: `_count.users` | Not stored, aggregated |

#### Category (`types/settings.ts`) → Category table
| Frontend field | Type | DB column |
|---------------|------|-----------|
| `id` | `string` | `id` |
| `name` | `string` | `name` (unique) |
| `createdAt` | `string` | `createdAt` |
| `linkedItemsCount` | `number?` | Computed: `_count.items` |

#### LabNotification (`mocks/notifications.ts`) → Notification table
| Frontend field | Type | DB column |
|---------------|------|-----------|
| `id` | `string` | `id` |
| `title` | `string` | `title` |
| `body` | `string` | `body` |
| `read` | `boolean` | `read` |
| `type` | `NotificationType` | `type` (enum) |
| `createdAt` | `string` | `createdAt` |

#### UserPermissionOverride (`types/settings.ts`) → UserPermissionOverride table
| Frontend field | Type | DB column |
|---------------|------|-----------|
| `userId` | `string` | `userId` (FK) |
| `tagId` | `string` | `tagId` (FK) |
| `customOverrides` | `Partial<TagPermissions>` | `customOverrides` (Json) |

### Known Data Inconsistencies in Frontend Mocks

1. **LabSessionUser.id is `number`** but User.id is `string` — backend uses `string` (cuid), frontend fix in Phase 9
2. **Tag color**: `mocks/settings.ts` uses hex (`#0f62fe`), `mocks/session-user.ts` uses Tailwind class (`text-azure-800`) — backend stores hex
3. **Tag name casing**: `mocks/settings.ts` uses capitalized (`Aluno`, `Estagiário`), `mocks/session-user.ts` uses lowercase (`aluno`, `laboratorista`) — backend stores capitalized, frontend `isLabAdmin()` check needs case-insensitive comparison (Phase 9 fix)
4. **Inventory category**: stored as string name, not FK — backend uses FK, API response includes `category` as string name
5. **Loan items reference inv-5 and inv-6** which don't exist in `mocks/inventory-items.ts` — seed will only create items inv-1 through inv-4

## Architecture Decision: Layered MVC

```
backend/
├── prisma/
│   ├── schema.prisma         # Database schema
│   ├── seed.ts               # Seed script
│   └── migrations/           # Auto-generated
├── src/
│   ├── config/
│   │   ├── env.ts            # Zod-validated env vars
│   │   └── database.ts       # Prisma client singleton
│   ├── controllers/          # (empty for Phase 5, populated in Phase 6+)
│   ├── services/             # (empty for Phase 5, populated in Phase 6+)
│   ├── routes/
│   │   ├── index.ts          # Route aggregator
│   │   └── health.ts         # Health check endpoint
│   ├── middlewares/
│   │   ├── errorHandler.ts   # AppError class + error handler
│   │   ├── notFound.ts       # 404 handler
│   │   └── requestLogger.ts  # Request/response logging
│   ├── types/
│   │   └── api.ts            # ApiResponse, PaginatedResponse, ApiError (mirror frontend)
│   ├── utils/
│   │   └── response.ts       # sendSuccess(), sendPaginated(), sendError()
│   ├── app.ts                # Express app (middleware chain)
│   └── server.ts             # Entry point (listen + graceful shutdown)
├── .env
├── .env.example
├── .gitignore
├── package.json
└── tsconfig.json
```

**Rationale:** Simple controllers → services → Prisma chain is sufficient for this CRUD API. Clean Architecture is overkill.

## Technology Choices

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Runtime | Node.js 20+ LTS | Stable, TypeScript support |
| Framework | Express 4.x | Mature, well-known, matches team experience |
| Language | TypeScript 5.x (strict) | Type safety, matches frontend |
| ORM | Prisma 6.x | Auto-generated types from schema, declarative migrations, great DX |
| Database | PostgreSQL 16+ | Robust, free, relational data model fits perfectly |
| Dev runner | `tsx` (watch mode) | Fast TS execution without compilation, hot-reload |
| Env validation | `dotenv` + `zod` | Fail-fast on missing env vars, already using Zod in frontend |
| CORS | `cors` package | Standard Express middleware |
| Package manager | pnpm | Same as frontend |

## Dependencies

### Production
| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.21 | HTTP framework |
| `cors` | ^2.8 | CORS middleware |
| `dotenv` | ^16.4 | Environment variable loading |
| `@prisma/client` | ^6.x | Type-safe database client |
| `zod` | ^3.23 | Runtime validation (env, later request bodies) |

### Development
| Package | Version | Purpose |
|---------|---------|---------|
| `typescript` | ^5.x | TypeScript compiler |
| `@types/express` | ^5.x | Express type definitions |
| `@types/cors` | ^2.8 | CORS type definitions |
| `@types/node` | ^22.x | Node.js type definitions |
| `tsx` | ^4.x | Fast TypeScript execution for dev |
| `prisma` | ^6.x | Prisma CLI (migrations, generate) |

## Risks & Mitigations

| Risk | Impact | Mitigation |
|------|--------|------------|
| PostgreSQL not installed | Blocks all DB work | Document install steps in README, provide Docker alternative |
| Prisma generate fails | No type-safe client | Validate schema first with `prisma validate` |
| CORS misconfiguration | Frontend can't connect | Test from frontend immediately after setup |
| Type mismatches front↔back | Runtime errors | Mirror frontend types exactly in backend, test with curl |

## RESEARCH COMPLETE

Research artifacts:
- Complete type mapping: all 8 frontend type files → DB schema
- 5 known data inconsistencies documented for Phase 9 resolution
- Full dependency list with versions
- Architecture with directory tree
- Ready for planning
