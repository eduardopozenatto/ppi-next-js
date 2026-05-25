# Roadmap: LabControl

## Milestones

- ✅ **v1.0 Frontend Prototype** — Phases 1-4 (concluído)
- ✅ **v2.0 Backend API + Integração** — Phases 5-10 (shipped 2026-05-12)

## Phases

<details>
<summary>✅ v1.0 Frontend Prototype (Phases 1-4) — CONCLUÍDO</summary>

### Phase 1: Fundação do Frontend
**Goal**: Estrutura base do projeto Next.js com App Router, sistema de design tokens, componentes primitivos e layout responsivo
**Depends on**: Nothing (first phase)
**Requirements**: [FAUTH-04, FAUTH-05, FNAV-01, FNAV-02, FNAV-03, FNAV-04, FNAV-05]
**Status**: Complete

Plans:
- [x] 01-01: Configuração do projeto Next.js + TypeScript + Tailwind + ESLint
- [x] 01-02: Componentes primitivos (Button, Input, Link) e design tokens CSS
- [x] 01-03: Layout principal (AppShell, AppSidebar, AuthGate, AdminGate)
- [x] 01-04: Sistema de navegação baseado em permissões

### Phase 2: Autenticação e Páginas Públicas
**Goal**: Fluxo completo de login, registro e recuperação de senha com mock auth
**Depends on**: Phase 1
**Requirements**: [FAUTH-01, FAUTH-02, FAUTH-03]
**Status**: Complete

Plans:
- [x] 02-01: AuthContext com mock users (login, register, logout)
- [x] 02-02: Páginas públicas (landing, login, register, recovery)

### Phase 3: Módulos Core (Inventário, Empréstimos, Carrinho)
**Goal**: Interfaces completas de catálogo, estoque, criação de empréstimos e carrinho
**Depends on**: Phase 2
**Requirements**: [FINV-01, FINV-02, FINV-03, FINV-04, FINV-05, FLOAN-01, FLOAN-02, FLOAN-03, FLOAN-04, FLOAN-05]
**Status**: Complete

Plans:
- [x] 03-01: Catálogo de itens (grid, busca, filtros, detalhe)
- [x] 03-02: Gestão de estoque (tabela admin, formulário de novo item)
- [x] 03-03: Empréstimos (listagem, tabs, formulário, detalhe, badges)
- [x] 03-04: Carrinho de empréstimos

### Phase 4: Administração e Configurações
**Goal**: Painel admin completo com aprovações, gestão de usuários, relatórios, tags, permissões e categorias
**Depends on**: Phase 3
**Requirements**: [FADM-01, FADM-02, FADM-03, FADM-04, FADM-05, FADM-06]
**Status**: Complete

Plans:
- [x] 04-01: Painel de aprovações (aprovar/rejeitar empréstimos)
- [x] 04-02: Gestão de usuários e relatórios com KPIs
- [x] 04-03: Configurações admin (tags, categorias, permissões, overrides)
- [x] 04-04: Configurações de perfil e notificações do usuário

</details>

### ✅ v2.0 Backend API + Integração (SHIPPED 2026-05-12)

<details>
<summary>View Phase Details (Phases 5-10)</summary>

**Milestone Goal:** Criar o backend REST API completo em Node.js/Express/TypeScript com PostgreSQL, implementando todas as rotas definidas no contrato frontend e substituir os mocks por chamadas reais.

- [x] Phase 5: Fundação do Backend (2/2 plans)
- [x] Phase 6: Autenticação e Autorização (1/1 plan)
- [x] Phase 7: CRUD de Inventário e Empréstimos (1/1 plan)
- [x] Phase 8: Usuários, Permissões, Notificações e Relatórios (1/1 plan)
- [x] Phase 9: Integração Frontend ↔ Backend (1/1 plan)
- [x] Phase 10: Verification Debt Closure (1/1 plan)

</details>

### v3.0 Correções e Funcionalidades Pendentes

### Phase 11: Correções Críticas e Funcionalidades Pendentes
**Goal**: Corrigir 5 problemas reais: foto de perfil, alteração de senha via email, exclusão real de usuários, exportação de relatórios em XLSX, e alinhar notificações/aprovações
**Depends on**: Phase 10
**Requirements**: [FAUTH-03, FADM-01, FADM-02, FADM-05, FADM-06]
**Status**: Complete

Plans:
- [x] 11-01: Upload de foto de perfil (backend + frontend)
- [x] 11-02: Alteração de senha via email com código de verificação
- [x] 11-03: Exclusão real (hard delete) de usuários pelo admin
- [x] 11-04: Exportação real de relatórios em XLSX
- [x] 11-05: Correção do mecanismo de notificações e aprovações

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8 → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Fundação Frontend | v1.0 | 4/4 | Complete | ✅ |
| 2. Auth e Páginas Públicas | v1.0 | 2/2 | Complete | ✅ |
| 3. Módulos Core | v1.0 | 4/4 | Complete | ✅ |
| 4. Administração e Config | v1.0 | 4/4 | Complete | ✅ |
| 5. Fundação Backend | v2.0 | 2/2 | Complete | 2026-04-14 |
| 6. Auth e Autorização | v2.0 | 1/1 | Complete | 2026-04-14 |
| 7. CRUD Inventário e Empréstimos | v2.0 | 1/1 | Complete | 2026-04-22 |
| 8. Usuários, Permissões, Notif. | v2.0 | 1/1 | Complete   | 2026-04-22 |
| 9. Integração Front ↔ Back | v2.0 | 1/1 | Complete | 2026-05-12 |
| 10. Verification Debt Closure | v2.0 | 1/1 | Complete    | 2026-05-12 |
| 11. Correções Críticas e Funcionalidades | v3.0 | 5/5 | Complete | 2026-05-25 |
| 12. Regras e Validação de Empréstimos | v4.0 | 2/2 | Complete | 2026-05-25 |
| 13. Gestão de Usuários e Segurança Admin | v4.0 | 0/3 | Pending | |
| 14. Estoque, Soft Delete e Ativação | v4.0 | 0/2 | Pending | |
| 15. Polimento de UI e Auditoria | v4.0 | 0/2 | Pending | |

### v4.0 Consistência Lógica e Regras de Negócio

### Phase 12: Regras e Validação de Empréstimos
**Goal**: Validar datas de empréstimo (futuro, limites) e travar dados do solicitante no frontend com base no usuário autenticado.
**Depends on**: Phase 11
**Requirements**: [REQ-401, REQ-402]
**Status**: Complete

Plans:
- [x] 12-01: Validação de datas (futuro, limite de duração) no backend e frontend
- [x] 12-02: Auto-preenchimento e bloqueio de dados do solicitante na criação do empréstimo

### Phase 13: Gestão de Usuários e Segurança Administrativa
**Goal**: Implementar criação administrativa de usuários, unicidade de e-mail/matrícula e troca obrigatória de senha provisória.
**Depends on**: Phase 12
**Requirements**: [REQ-403, REQ-404, REQ-405]
**Status**: Pending

Plans:
- [ ] 13-01: Rota POST /users para criação admin com perfil/tags e status ativação
- [ ] 13-02: Validação de email e matrícula únicos no cadastro e edição
- [ ] 13-03: Rastreamento e redirecionamento obrigatório para alteração de senha provisória (mustChangePassword)

### Phase 14: Estoque, Soft Delete e Ativação de Itens
**Goal**: Permitir desativar/ocultar itens do estoque sem excluí-los do banco de dados.
**Depends on**: Phase 13
**Requirements**: [REQ-406]
**Status**: Pending

Plans:
- [ ] 14-01: Filtro de exibição de itens ativos (soft hide) na listagem pública
- [ ] 14-02: Toggle de ativação/desativação de itens no painel administrativo do estoque

### Phase 15: Polimento de Interface (UI) e Auditoria Preventiva
**Goal**: Corrigir alinhamentos de UI e bloquear overdrafts ou manipulações lógicas incoerentes.
**Depends on**: Phase 14
**Requirements**: [REQ-407, REQ-408]
**Status**: Pending

Plans:
- [ ] 15-01: Correção de alinhamentos na tela de detalhes do item e setas de filtros
- [ ] 15-02: Auditoria e bloqueio de auto-aprovação de empréstimo e pedidos de estoque zerado/negativo


