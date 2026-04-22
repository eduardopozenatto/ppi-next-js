---
phase: 8
slug: usu-rios-permiss-es-notifica-es-e-relat-rios
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-04-22
---

# Phase 8 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

---

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Manual UAT / Postman |
| **Config file** | none — Wave 0 installs |
| **Quick run command** | `pnpm dev` |
| **Full suite command** | `/gsd-verify-work 8` |
| **Estimated runtime** | ~60 seconds |

---

## Sampling Rate

- **After every task commit:** Run `pnpm dev`
- **After every plan wave:** Run `/gsd-verify-work 8`
- **Before `/gsd-verify-work`:** Full suite must be green
- **Max feedback latency:** 60 seconds

---

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Threat Ref | Secure Behavior | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|------------|-----------------|-----------|-------------------|-------------|--------|
| 08-01-01 | 01 | 1 | REQ-ALL | — | N/A | manual | `/gsd-verify-work 8` | ✅ W0 | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

---

## Wave 0 Requirements

*Existing infrastructure covers all phase requirements.*

---

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| API Endpoints | BUSER-01..04, BPERM-01..04, BNOTIF-01..04, BREP-01..02 | Project convention (UAT vs Automated Tests) | Use `/gsd-verify-work 8` |

---

## Validation Sign-Off

- [x] All tasks have `<automated>` verify or Wave 0 dependencies
- [x] Sampling continuity: no 3 consecutive tasks without automated verify
- [x] Wave 0 covers all MISSING references
- [x] No watch-mode flags
- [x] Feedback latency < 60s
- [x] `nyquist_compliant: true` set in frontmatter

**Approval:** approved 2026-04-22
