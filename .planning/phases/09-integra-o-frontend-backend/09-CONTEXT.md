# Phase 9: Integração Frontend ↔ Backend - Context

**Gathered:** 2026-04-22
**Status:** Ready for planning
**Source:** System defaults (bypassed interactive discussion)

<domain>
## Phase Boundary

Substituir todos os mocks do frontend por chamadas reais à API REST (http://localhost:3001/api).
Integrar autenticação JWT usando cookies httpOnly.
Tratar erros da API e exibi-los no frontend via Toasts.
</domain>

<decisions>
## Implementation Decisions

### API Client Strategy
- Criar um wrapper nativo de `fetch` (ex: `frontend/lib/api.ts`) para padronizar chamadas.
- Deve incluir automaticamente `credentials: 'include'` em todas as requisições para enviar o cookie JWT.
- Deve prefixar chamadas com `process.env.NEXT_PUBLIC_API_URL` (padrão: `http://localhost:3001/api`).

### Data Fetching Architecture
- Manter o padrão atual de Client Components onde houver interatividade.
- Onde dados forem buscados (ex: listagens, dashboard), utilizar hooks simples (`useEffect` + `useState`) com o wrapper `api.ts`.
- O `AuthContext` deve ser refatorado para fazer POST real para `/auth/login` e GET para `/auth/me` no carregamento (verificando a sessão atual).

### Global Error Handling (Toasts)
- O wrapper `api.ts` deve interceptar respostas não-2xx, extrair a mensagem de erro do body (formato `ApiError`) e lançar um Error padrão.
- Os componentes devem fazer try/catch e utilizar o sistema de Toast existente (ex: `toast.error(err.message)`) para exibir o problema visualmente.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Requisitos e Domínio
- `.planning/REQUIREMENTS.md` — Lista de requisitos a serem integrados (BINT-01 a BINT-04).
- `.planning/ROADMAP.md` — Visão geral da fase e critérios de sucesso.
</canonical_refs>

<specifics>
## Specific Ideas
- O mock local `frontend/mocks/` deve ser completamente deletado após a refatoração, garantindo que o critério de sucesso (Nenhum import de `mocks/` resta no código) seja atingido.
</specifics>

<deferred>
## Deferred Ideas
None
</deferred>
