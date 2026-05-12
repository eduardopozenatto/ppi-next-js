# Retrospective

## Cross-Milestone Trends

| Milestone | Ph/Pl | Req Score | Integration | Speed |
|-----------|-------|-----------|-------------|-------|
| v2.0 | 6/7 | 37/37 | 100% | Fast |

## Milestone: v2.0 — Backend API + Integração

**Shipped:** 2026-05-12
**Phases:** 6 | **Plans:** 7

### What Was Built
- Fully functional Express/TS backend with PostgreSQL (Prisma).
- End-to-end integration with the React/Next.js frontend.
- JWT authentication with HTTPOnly cookies.
- Comprehensive CRUD and permission validations.

### What Worked
- **Strict Typing:** Validating API responses with Zod locally and sharing schemas or maintaining clear API contracts made the integration seamless.
- **Transactions:** Using Prisma `$transaction` for loans guarantees stock data integrity.

### What Was Inefficient
- **Verification Debt:** The actual tasks were done, but formal closure was skipped, requiring an extra administrative phase (Phase 10) to close out the milestone audit. We must verify alongside implementation.

### Patterns Established
- `credentials: "include"` for all fetch requests natively handles the JWT cookies.
- `req.user.role` overrides to avoid extra database trips in authorization gates.

### Key Lessons
- Formalize phase completion as soon as the code is merged, else the orchestrator halts the project's progression.
- Express 5 typing has some quirks with `req.params` needing to be parsed safely as string arrays.
