---
phase: 07
phase_name: crud-inventario-emprestimos
status: secured
threats_total: 8
threats_open: 0
threats_closed: 8
audited_at: "2026-04-22T14:22:00Z"
---

# Phase 7: Security Threat Verification

## Trust Boundaries

1. **Client → API**: All mutation requests require JWT auth via `requireAuth` middleware
2. **API → Database**: Prisma ORM with parameterized queries (no raw SQL)
3. **Client → File System**: Multer with disk storage, file type filter, and size limit

## Threat Register

| ID | Category | Component | Threat | Disposition | Status | Evidence |
|----|----------|-----------|--------|-------------|--------|----------|
| T7-01 | Tampering | File Upload | Unrestricted file type upload | MITIGATE | CLOSED | `fileFilter` restricts to `image/jpeg`, `image/png`, `image/webp`, `image/gif` in `inventory.routes.ts` |
| T7-02 | Denial of Service | File Upload | Oversized file upload (DoS) | MITIGATE | CLOSED | `limits: { fileSize: 5MB }` configured in multer |
| T7-03 | Spoofing | Inventory Routes | Unauthenticated read access to catalog | ACCEPTED | CLOSED | Intentional — catalog browsing is a public feature |
| T7-04 | Elevation of Privilege | Inventory Routes | Unauthorized CRUD on inventory | MITIGATE | CLOSED | `requireAuth` + `requirePermission('manipular_estoque')` on POST/PUT/DELETE |
| T7-05 | Elevation of Privilege | Loan Routes | Unauthorized loan status changes | MITIGATE | CLOSED | `requirePermission('aprovar_emprestimos')` on PUT /:id/status |
| T7-06 | Tampering | Loan Creation | Race condition on stock deduction | MITIGATE | CLOSED | `prisma.$transaction` with serialized reads/writes in `createLoan` |
| T7-07 | Denial of Service | Loan Creation | Negative or zero quantity in loan request | MITIGATE | CLOSED | Zod schema enforces `z.number().int().min(1)` on quantity |
| T7-08 | Information Disclosure | Loan List | Users viewing other users' loans | MITIGATE | CLOSED | Controller filters by `borrowerId` for non-admin users |

## Accepted Risks

| ID | Risk | Rationale |
|----|------|-----------|
| T7-03 | Public inventory catalog read access | Core feature — students need to browse available items without login |

## Security Audit 2026-04-22

| Metric | Count |
|--------|-------|
| Threats found | 8 |
| Closed | 8 |
| Open | 0 |

### Mitigations Applied During Audit

- **T7-01 + T7-02**: Added `fileFilter` (image-only MIME types) and `limits` (5MB max) to multer configuration in `inventory.routes.ts`
