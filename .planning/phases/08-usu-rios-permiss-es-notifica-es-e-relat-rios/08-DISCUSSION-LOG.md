# Phase 8: Usuários, Permissões, Notificações e Relatórios - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-22
**Phase:** 08-Usuários, Permissões, Notificações e Relatórios
**Areas discussed:** Notification triggers, Report KPI calculations, User deactivation side effects

---

## Notification Triggers

| Option | Description | Selected |
|--------|-------------|----------|
| Mínimo (Approve/Reject) | Apenas no updateLoanStatus conforme roadmap. | ✓ |
| Completo | Todas as transições, incluindo overdue (requer cron job). | |

**User's choice:** Mínimo (Approve/Reject)
**Notes:** Decisão sugerida pelo assistente e aceita em lote pelo usuário via "all" e "create".

---

## Report KPI calculations

| Option | Description | Selected |
|--------|-------------|----------|
| Agregações Simples | Endpoints via Prisma groupBy/count. Exportação via Frontend. | ✓ |
| Relatórios Server-side | Backend gera os arquivos CSV/XLSX. | |

**User's choice:** Agregações Simples
**Notes:** Decisão sugerida pelo assistente e aceita em lote pelo usuário via "all" e "create".

---

## User deactivation side effects

| Option | Description | Selected |
|--------|-------------|----------|
| Soft Delete | `isActive: false` sem cascade para empréstimos. | ✓ |
| Soft Delete com Cascade | Cancela empréstimos ativos pendentes/ativos do usuário na desativação. | |

**User's choice:** Soft Delete
**Notes:** Decisão sugerida pelo assistente e aceita em lote pelo usuário via "all" e "create".

---

## the agent's Discretion

- Rotas exatas e validações Zod.

## Deferred Ideas

- Notificações de overdue via Cron.
