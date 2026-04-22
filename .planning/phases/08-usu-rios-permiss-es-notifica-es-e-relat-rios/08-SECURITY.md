---
phase: 08
slug: usu-rios-permiss-es-notifica-es-e-relat-rios
status: verified
threats_open: 0
asvs_level: 1
created: 2026-04-22T14:35:00Z
---

# Phase 08 — Security

> Per-phase security contract: threat register, accepted risks, and audit trail.

---

## Trust Boundaries

| Boundary | Description | Data Crossing |
|----------|-------------|---------------|
| Client → API | User authentication and role-based access control | JWT token, user credentials, permission overrides |
| API → Database | Prisma ORM queries protecting tenant isolation for notifications | Notification IDs, user IDs |

---

## Threat Register

| Threat ID | Category | Component | Disposition | Mitigation | Status |
|-----------|----------|-----------|-------------|------------|--------|
| T-08-01 | Elevation of Privilege | Users Profile Edit | mitigate | Validate admin vs owner editing. Ignore `role` and `tagId` changes for non-admins | closed |
| T-08-02 | Tampering | Notifications | mitigate | Force `where: { userId: req.user.id }` via ORM in `PUT /api/notifications/:id` | closed |
| T-08-03 | Information Disclosure | Reports KPI | mitigate | Protect `/api/reports/*` with `requirePermission('gerar_relatorios')` | closed |

*Status: open · closed*
*Disposition: mitigate (implementation required) · accept (documented risk) · transfer (third-party)*

---

## Accepted Risks Log

No accepted risks.

---

## Security Audit Trail

| Audit Date | Threats Total | Closed | Open | Run By |
|------------|---------------|--------|------|--------|
| 2026-04-22 | 3 | 3 | 0 | gsd-security-auditor |

---

## Sign-Off

- [x] All threats have a disposition (mitigate / accept / transfer)
- [x] Accepted risks documented in Accepted Risks Log
- [x] `threats_open: 0` confirmed
- [x] `status: verified` set in frontmatter

**Approval:** verified 2026-04-22
