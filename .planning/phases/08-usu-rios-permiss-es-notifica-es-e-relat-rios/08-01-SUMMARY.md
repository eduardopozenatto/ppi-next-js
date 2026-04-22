---
phase: 8
plan: 1
subsystem: Users, Permissions, Notifications, Reports
requires: [Phase 7 Security/Loans]
provides: [Users CRUD, Tags CRUD, Categories CRUD, Notifications endpoints, Reports endpoints]
affects: [Auth Middleware, Loans Controller]
tech-stack.added: []
tech-stack.patterns: [Express 5 routers, Prisma transactions, Zod validations]
key-files.created:
  - backend/src/schemas/user.schema.ts
  - backend/src/schemas/tag.schema.ts
  - backend/src/schemas/category.schema.ts
  - backend/src/schemas/notification.schema.ts
  - backend/src/controllers/users.controller.ts
  - backend/src/controllers/tags.controller.ts
  - backend/src/controllers/categories.controller.ts
  - backend/src/controllers/notifications.controller.ts
  - backend/src/controllers/reports.controller.ts
  - backend/src/routes/users.routes.ts
  - backend/src/routes/tags.routes.ts
  - backend/src/routes/categories.routes.ts
  - backend/src/routes/notifications.routes.ts
  - backend/src/routes/reports.routes.ts
key-files.modified:
  - backend/src/controllers/loans.controller.ts
  - backend/src/routes/index.ts
  - backend/src/middlewares/auth.ts
key-decisions:
  - Extracted getParam to src/utils/params.ts to resolve Express 5 typing issues across controllers.
  - Implemented Soft Delete for users using isActive: false to preserve loan references.
  - Injected Notification triggers exactly within the Prisma $transaction inside updateLoanStatus for strict consistency.
  - Added role tracking onto Express.Request.user so controllers don't require redundant database queries for authorization gates.
requirements:
  - BUSER-01
  - BUSER-02
  - BUSER-03
  - BUSER-04
  - BPERM-01
  - BPERM-02
  - BPERM-04
  - BNOTIF-01
  - BNOTIF-02
  - BNOTIF-03
  - BNOTIF-04
  - BREP-01
  - BREP-02
---

# Phase 8 Plan 1: Usuários, Permissões, Notificações e Relatórios Summary

Implemented full CRUD endpoints for Users, Tags, and Categories, including the necessary permission-checking middlewares and Zod validation schemas. Developed real-time notification endpoints along with the Prisma hooks inside the Loans controller transaction to trigger alerts on status changes. Built aggregation-based KPI endpoints for the inventory and loan reports. 

## Execution Details
- **Duration**: ~8 min
- **Completed**: 2026-04-22T09:55:00Z
- **Tasks Executed**: 4 Waves completed.
- **Files Touched**: 17 files created/modified.

## Deviations from Plan

**[Rule 1 - Bug] Express 5 typings and global objects**
- **Found during:** Wave 4 Typescript check
- **Issue:** Controllers failed strict type checking because `getParam` was isolated to loans.controller, `req.user.role` was missing from the `Express.Request` type override, and `Router` instances required explicit typings.
- **Fix:** Moved `getParam` to `utils/params.ts`. Added `role` to `req.user` in `middlewares/auth.ts`. Typed `router: RouterType` explicitly in all route files.
- **Files modified:** `utils/params.ts`, `middlewares/auth.ts`, `controllers/*`, `routes/*`
- **Verification:** `pnpm tsc --noEmit` passed.

**Total deviations:** 1 auto-fixed. **Impact:** Low. Allowed typescript compiler to pass cleanly.

## Self-Check: PASSED
- `key-files.created` exist on disk
- Project compiles successfully.

Phase complete, ready for next step.
