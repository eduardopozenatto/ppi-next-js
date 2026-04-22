# Phase 8: Usuários, Permissões, Notificações e Relatórios - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning

<domain>
## Phase Boundary

CRUD de usuários e tags, override de permissões por usuário, notificações automáticas acionadas por mudanças de status, e endpoints agregadores de relatórios (KPIs de estoque e empréstimos).

</domain>

<decisions>
## Implementation Decisions

### Notificações
- **D-01:** **Triggers limitados ao ROADMAP**: Para a Phase 8, notificações automáticas disparam apenas no **Approve** e **Reject** de um empréstimo (inseridos no `updateLoanStatus` existente). Tipos como "overdue" ou "reminder" ficam reservados para jobs/cron ou ações futuras, fora do escopo atual.

### Relatórios (KPIs)
- **D-02:** **Agregações DB**: `GET /api/reports/loans` filtra por `?period` (7|30|90|all) e retorna totais (total, ativos, atrasados). `GET /api/reports/inventory` retorna agregações por categoria (`itemsByCategory`) e os itens mais emprestados (`mostBorrowed`). Sem exportação server-side (frontend cuida disso via CSV download client-side).

### Usuários e Desativação
- **D-03:** **Soft Delete Simples**: Deletar um usuário (`DELETE /api/users/:id`) define `isActive: false`. Nenhum cascade é aplicado aos seus empréstimos ativos (eles permanecem no sistema para o laboratório finalizar manualmente se necessário). Usuários inativos já são bloqueados pelo middleware de autenticação (Phase 6).

### the agent's Discretion
- Rotas exatas e schemas Zod para validação dos endpoints de Reports (que são somente de leitura) podem ser inferidos a partir dos mocks do frontend.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos
- `.planning/ROADMAP.md` — Requisitos e critério de aceite (Phase 8)
- `.planning/REQUIREMENTS.md` — Rastreamento de BUSER-*, BPERM-*, BNOTIF-*, BREP-*

### Frontend Mocks (Data Contracts)
- `frontend/app/(auth)/admin/reports/page.tsx` — Tipagem esperada dos agregados de relatório e KPIs.
- `frontend/mocks/notifications.ts` — Mock que define os tipos de notificação e estrutura `NotificationType`.
- `frontend/types/settings.ts` — Interface `TagPermissions` (as 11 chaves obrigatórias).

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `PaginatedResponse` / `sendPaginated` (`src/utils/response.ts`): Para listar usuários, tags e notificações.
- `getParam` (`src/utils/params.ts`): Para parse seguro de parâmetros do Express 5.
- `$transaction` (Prisma): Para overrides de permissões ou fluxos que exijam atomicidade.
- `requirePermission()` (`src/middlewares/auth.middleware.ts`): Será amplamente usado para proteger os controllers de admin (`gerenciar_usuarios`, `gerenciar_roles`, etc).

### Integration Points
- `src/controllers/loans.controller.ts` (`updateLoanStatus`): Onde a criação das notificações de Approve/Reject será injetada.

</code_context>

<specifics>
## Specific Ideas

- O frontend possui 11 chaves exatas de permissão (`ver_itens`, `pedir_emprestimos`, etc). O CRUD de Tags no backend deve refletir exatamente essas 11 chaves em colunas booleanas correspondentes, validando via schema.

</specifics>

<deferred>
## Deferred Ideas

- Jobs automáticos diários para envio de notificações do tipo `overdue` e `reminder` (podem ser planejados em uma fase futura focada em agendamento/crons).

</deferred>

---

*Phase: 08-usu-rios-permiss-es-notifica-es-e-relat-rios*
*Context gathered: 2026-04-22*
