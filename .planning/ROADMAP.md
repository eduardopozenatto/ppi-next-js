# Roadmap: LabControl

## Milestones

- ✅ **v1.0 Frontend Prototype** — Phases 1-4 (concluído)
- 🚧 **v2.0 Backend API + Integração** — Phases 5-9 (pendente)

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

### 🚧 v2.0 Backend API + Integração (Pendente)

**Milestone Goal:** Criar o backend REST API completo em Node.js/Express/TypeScript com PostgreSQL, implementando todas as rotas definidas no contrato frontend e substituir os mocks por chamadas reais.

#### Phase 5: Fundação do Backend
**Goal**: Projeto Node.js/Express/TypeScript configurado com PostgreSQL, ORM, migrations e middleware base
**Depends on**: Phase 4
**Requirements**: [BINF-01, BINF-02, BINF-03, BINF-04, BINF-05, BINF-06, BINF-07]
**Success Criteria** (what must be TRUE):
  1. ✅ `pnpm dev` inicia o servidor Express na porta 3001 sem erros
  2. ✅ GET /api/health retorna `{ "status": "ok" }` com status 200
  3. ✅ Conexão com PostgreSQL funciona e tabelas base são criadas via migration
  4. ✅ Middleware de CORS aceita requests de localhost:3000
  5. ✅ Middleware de erro global retorna respostas no formato ApiError
**Status**: Complete

Plans:
- [x] 05-01: Express + TypeScript scaffolding, env config, CORS, error handling, request logging, health endpoint
- [x] 05-02: Prisma 7 schema (8 models, 3 enums), client singleton, pg adapter, seed script

#### Phase 6: Autenticação e Autorização
**Goal**: Registro, login, JWT, middleware de auth e sistema de permissões baseado em tags
**Depends on**: Phase 5
**Requirements**: [BAUTH-01, BAUTH-02, BAUTH-03, BAUTH-04, BAUTH-05, BAUTH-06, BPERM-03]
**Success Criteria** (what must be TRUE):
  1. ✅ POST /api/auth/register cria usuário com senha hasheada no banco
  2. ✅ POST /api/auth/login retorna JWT válido para credenciais corretas
  3. ✅ GET /api/auth/me retorna dados do usuário autenticado com tag e permissões
  4. ✅ Rotas protegidas retornam 401 sem token e 403 sem permissão
  5. ✅ Middleware de permissão valida as 11 chaves de TagPermissions
**Status**: Complete

Plans:
- [x] 06-01: Autenticação e Autorização (JWT, Bcrypt, Middlewares e Controller)

#### Phase 7: CRUD de Inventário e Empréstimos
**Goal**: Endpoints completos de inventário e empréstimos com lógica de negócio (quantidade disponível, aprovação, devolução)
**Depends on**: Phase 6
**Requirements**: [BINV-01, BINV-02, BINV-03, BINV-04, BINV-05, BINV-06, BLOAN-01, BLOAN-02, BLOAN-03, BLOAN-04, BLOAN-05]
**Success Criteria** (what must be TRUE):
  1. CRUD completo de inventário funciona com paginação (PaginatedResponse)
  2. Upload de imagem funciona para itens do inventário
  3. Empréstimo criado desconta quantidade disponível do item
  4. Aprovação/devolução atualiza status e quantidades corretamente
  5. Filtros por status funcionam no GET /api/loans
**Plans**: TBD

#### Phase 8: Usuários, Permissões, Notificações e Relatórios
**Goal**: CRUD de usuários e tags, override de permissões por usuário, notificações automáticas e endpoints de relatórios
**Depends on**: Phase 7
**Requirements**: [BUSER-01, BUSER-02, BUSER-03, BUSER-04, BPERM-01, BPERM-02, BPERM-04, BNOTIF-01, BNOTIF-02, BNOTIF-03, BNOTIF-04, BREP-01, BREP-02]
**Success Criteria** (what must be TRUE):
  1. Admin pode listar, editar e desativar usuários
  2. CRUD de tags/roles funciona com as 11 permissões
  3. Override de permissão por usuário sobrescreve permissão da tag
  4. Notificação é criada automaticamente ao aprovar/rejeitar empréstimo
  5. Relatórios retornam KPIs de empréstimos e inventário
**Plans**: TBD

#### Phase 9: Integração Frontend ↔ Backend
**Goal**: Substituir todos os mocks do frontend por chamadas reais à API, configurar autenticação JWT no frontend e seed do banco com dados de demonstração
**Depends on**: Phase 8
**Requirements**: [BINT-01, BINT-02, BINT-03, BINT-04]
**Success Criteria** (what must be TRUE):
  1. Nenhum import de `mocks/` resta no código do frontend
  2. Login/registro funciona end-to-end (frontend → backend → PostgreSQL)
  3. CRUD de inventário e empréstimos funciona via API real
  4. Seed do banco popula os mesmos dados que existem nos mocks atuais
  5. Erros da API são tratados e exibidos ao usuário via Toast
**Plans**: TBD

## Progress

**Execution Order:**
Phases execute in numeric order: 5 → 6 → 7 → 8 → 9

| Phase | Milestone | Plans Complete | Status | Completed |
|-------|-----------|----------------|--------|-----------|
| 1. Fundação Frontend | v1.0 | 4/4 | Complete | ✅ |
| 2. Auth e Páginas Públicas | v1.0 | 2/2 | Complete | ✅ |
| 3. Módulos Core | v1.0 | 4/4 | Complete | ✅ |
| 4. Administração e Config | v1.0 | 4/4 | Complete | ✅ |
| 5. Fundação Backend | v2.0 | 2/2 | Complete | ✅ |
| 6. Auth e Autorização | v2.0 | 1/1 | Complete | ✅ |
| 7. CRUD Inventário e Empréstimos | v2.0 | 0/? | Not started | - |
| 8. Usuários, Permissões, Notif. | v2.0 | 1/1 | Complete   | 2026-04-22 |
| 9. Integração Front ↔ Back | v2.0 | 0/? | Not started | - |
