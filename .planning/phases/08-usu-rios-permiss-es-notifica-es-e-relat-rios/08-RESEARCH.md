# Phase 8: Usuários, Permissões, Notificações e Relatórios - Research

**Researched:** 2026-04-22
**Domain:** Backend CRUD, Prisma Aggregations, Access Control
**Confidence:** HIGH

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions
- **Triggers limitados ao ROADMAP**: Para a Phase 8, notificações automáticas disparam apenas no **Approve** e **Reject** de um empréstimo (inseridos no `updateLoanStatus` existente).
- **Agregações DB**: `GET /api/reports/loans` filtra por `?period` (7|30|90|all) e retorna totais (total, ativos, atrasados). `GET /api/reports/inventory` retorna agregações por categoria (`itemsByCategory`) e os itens mais emprestados (`mostBorrowed`). Sem exportação server-side.
- **Soft Delete Simples**: Deletar um usuário (`DELETE /api/users/:id`) define `isActive: false`. Nenhum cascade é aplicado aos seus empréstimos ativos.

### the agent's Discretion
- Rotas exatas e schemas Zod para validação dos endpoints de Reports (que são somente de leitura) podem ser inferidos a partir dos mocks do frontend.

### Deferred Ideas (OUT OF SCOPE)
- Jobs automáticos diários para envio de notificações do tipo `overdue` e `reminder` (podem ser planejados em uma fase futura focada em agendamento/crons).
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| BUSER-01 | Endpoint GET /api/users com paginação (admin only) | `findMany` Prisma query com `sendPaginated` helper |
| BUSER-02 | Endpoint GET /api/users/:id (admin only) | `findUnique` Prisma query |
| BUSER-03 | Endpoint PUT /api/users/:id (atualizar perfil, tag, status) | `update` Prisma query |
| BUSER-04 | Endpoint DELETE /api/users/:id (desativar usuário, admin only) | Soft delete (`isActive: false`), ignorando relacionamentos |
| BPERM-01 | CRUD de Tags com permissões (11 chaves de permissão) | Zod schema garantindo exatidão booleana; Prisma `findMany`/`create`/`update`/`delete` |
| BPERM-02 | CRUD de Categorias de estoque | Prisma `findMany`/`create`/`update`/`delete` em `Category` model |
| BPERM-04 | Override de permissões por usuário individual | Model `UserPermissionOverride`, integração com a resolução de tags |
| BNOTIF-01 | Endpoint GET /api/notifications (listar notificações do usuário) | Prisma `findMany` com paginação, filtrando por `userId` |
| BNOTIF-02 | Endpoint PUT /api/notifications/:id (marcar como lida) | Prisma `update` (`read: true`) filtrado por `userId` e `id` |
| BNOTIF-03 | Criação automática de notificação ao aprovar/rejeitar empréstimo | Prisma `$transaction` acoplada ao controller de empréstimos |
| BNOTIF-04 | Configurações de preferência de notificação por usuário | Atualização de campo ou relação no perfil do usuário |
| BREP-01 | Endpoint GET /api/reports/loans (relatório de empréstimos) | Prisma `groupBy` e queries de agregação customizadas |
| BREP-02 | Endpoint GET /api/reports/inventory (relatório de inventário) | Prisma `groupBy` por categoria e histórico de transações |
</phase_requirements>

## Summary

This phase involves building standard Express 5 CRUD endpoints using Prisma for four distinct entities (Users, Tags, Categories, Notifications) and implementing data aggregation endpoints for reports. The technical domain is straightforward, relying on established patterns from Phase 7 (such as Zod schemas, the `sendPaginated` helper, and Prisma's `$transaction`).

**Primary recommendation:** Use Prisma's `groupBy` and `count` for efficient report generation, and ensure that notification hooks are safely placed within the same `$transaction` block as the loan status update to guarantee data consistency.

## Standard Stack

### Core
| Library | Version | Purpose | Why Standard |
|---------|---------|---------|--------------|
| Express | 5.x | Web framework | Established in Phase 5 |
| Prisma | 6.x | ORM | Established in Phase 5 |
| Zod | 3.x | Validation | Established in Phase 5 (note: use `.catch` / native message strings, see Phase 7 fixes) |

## Architecture Patterns

### Pattern 1: Pagination and Routing
**What:** Use the existing `sendPaginated` and `getParam` helpers.
**When to use:** All `GET /` endpoints for lists (users, tags, categories, notifications).

### Pattern 2: Atomic Operations (Triggers)
**What:** Inject notification generation into an existing transaction.
**When to use:** In `updateLoanStatus` (Phase 7 controller).
**Example:**
```typescript
await prisma.$transaction(async (tx) => {
  const updatedLoan = await tx.loan.update({ ... });
  // Add notification hook:
  await tx.notification.create({
    data: {
      title: "Empréstimo Aprovado",
      body: "Seu pedido foi aprovado.",
      type: "approval",
      userId: updatedLoan.borrowerId
    }
  });
  // ... other logic
});
```

### Pattern 3: Data Aggregation
**What:** Using Prisma for grouping and counting without pulling all data into memory.
**When to use:** Generating KPIs for `reports` endpoints.
**Example:**
```typescript
const itemsByCategory = await prisma.inventoryItem.groupBy({
  by: ['categoryId'],
  _sum: { quantity: true, availableQuantity: true }
});
```

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Pagination | Custom offset logic | `sendPaginated` | Established project pattern |
| Param extraction | Custom `typeof req.params.id === 'string'` | `getParam(req.params.id)` | Protects against Express 5 query parameter array spoofing (fixed in Phase 7) |
| Validations | Custom conditional typing | Zod schemas | Keeps runtime boundaries safe |

## Common Pitfalls

### Pitfall 1: Breaking Zod v4+ Syntax Constraints
**What goes wrong:** Using deprecated Zod features like `errorMap` inside `nativeEnum`.
**Why it happens:** Copying old Zod documentation.
**How to avoid:** Use simple string objects `{ message: "..." }` and standard Zod syntax, as established in Phase 7's `loan.schema.ts` fixes.

### Pitfall 2: Memory Bloat in Reports
**What goes wrong:** Fetching thousands of `Loan` or `InventoryItem` records into a JS array to calculate totals.
**Why it happens:** Developer avoids Prisma's `groupBy` or `aggregate` methods.
**How to avoid:** Always use Prisma's DB-level aggregation methods. Only fetch rows if absolutely necessary.

### Pitfall 3: Not Using Proper Admin Guards
**What goes wrong:** User APIs (like deleting a user or editing a tag) exposed to non-admins.
**Why it happens:** Forgetting to chain the middleware.
**How to avoid:** Always attach `requireAuth` and `requirePermission('gerenciar_usuarios')` (or similar) to sensitive routes.

## Validation Architecture

### Test Framework
| Property | Value |
|----------|-------|
| Framework | Manual UAT / Postman |
| Config file | none — see Wave 0 |
| Quick run command | `pnpm dev` |
| Full suite command | `/gsd-verify-work 8` |

*(This project relies on conversational UAT rather than automated unit tests at this stage, matching previous phases).*

## Sources

### Primary (HIGH confidence)
- Project files (`schema.prisma`, `backend/src/utils/response.ts`)
- Mocks (`frontend/mocks/notifications.ts`, `frontend/app/(auth)/admin/reports/page.tsx`)

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - Dictated by earlier project phases.
- Architecture: HIGH - Matches exactly the established patterns.
- Pitfalls: HIGH - Directly based on issues fixed during Phase 7 (Zod syntax, Express 5 params).

**Research date:** 2026-04-22
**Valid until:** 30 days
