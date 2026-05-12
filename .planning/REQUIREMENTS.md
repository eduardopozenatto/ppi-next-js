# Requirements: LabControl

**Defined:** 2026-04-14
**Core Value:** Alunos podem solicitar empréstimos de equipamentos e laboratoristas podem gerenciar estoque e aprovações de forma centralizada.

## Milestone 1 Requirements (Frontend — Concluído)

### Autenticação (Frontend)

- [x] **FAUTH-01**: Usuário pode fazer login com email e senha (mock)
- [x] **FAUTH-02**: Usuário pode registrar nova conta com nome, email, matrícula e senha
- [x] **FAUTH-03**: Página de recuperação de senha existe (UI pronta, sem backend)
- [x] **FAUTH-04**: Sessão do usuário persiste via React Context (in-memory)
- [x] **FAUTH-05**: Rotas protegidas redirecionam para login quando não autenticado

### Inventário (Frontend)

- [x] **FINV-01**: Catálogo de itens com grid de cards e busca
- [x] **FINV-02**: Filtro por categoria no catálogo
- [x] **FINV-03**: Tabela de gestão de estoque para admin
- [x] **FINV-04**: Formulário para adicionar novo item ao estoque
- [x] **FINV-05**: Página de detalhe do item com informações completas

### Empréstimos (Frontend)

- [x] **FLOAN-01**: Listagem de empréstimos com tabs (ativos, pendentes, histórico)
- [x] **FLOAN-02**: Formulário de novo empréstimo com validação Zod
- [x] **FLOAN-03**: Badge de status colorido (pending, active, overdue, returned, cancelled)
- [x] **FLOAN-04**: Carrinho de empréstimo com múltiplos itens
- [x] **FLOAN-05**: Página de detalhe do empréstimo

### Administração (Frontend)

- [x] **FADM-01**: Painel de aprovação de empréstimos (aprovar/rejeitar)
- [x] **FADM-02**: Gerenciamento de usuários com lista e status toggle
- [x] **FADM-03**: Relatórios com KPIs e exportação
- [x] **FADM-04**: Gerenciamento de tags/roles com permissões
- [x] **FADM-05**: Gerenciamento de categorias de estoque
- [x] **FADM-06**: Gerenciamento de permissões por usuário (overrides)

### Layout e Navegação (Frontend)

- [x] **FNAV-01**: Sidebar responsiva com navegação baseada em permissões
- [x] **FNAV-02**: AppShell com layout desktop (sidebar) e mobile (drawer)
- [x] **FNAV-03**: AuthGate para rotas autenticadas
- [x] **FNAV-04**: AdminGate para rotas administrativas
- [x] **FNAV-05**: Sistema de toast para feedback ao usuário

## Milestone 2 Requirements (Backend — Pendente)

### Infraestrutura Backend

- [x] **BINF-01**: Projeto Node.js/Express com TypeScript configurado
- [x] **BINF-02**: Configuração de variáveis de ambiente (.env)
- [x] **BINF-03**: Conexão com PostgreSQL via ORM (Prisma ou outro)
- [x] **BINF-04**: Sistema de migrations para schema do banco
- [x] **BINF-05**: Middleware de tratamento de erros global
- [x] **BINF-06**: Logger estruturado para requests e erros
- [x] **BINF-07**: CORS configurado para aceitar requests do frontend (localhost:3000)

### Autenticação Backend

- [x] **BAUTH-01**: Endpoint POST /api/auth/register com hash de senha (bcrypt)
- [x] **BAUTH-02**: Endpoint POST /api/auth/login com retorno de JWT
- [x] **BAUTH-03**: Endpoint POST /api/auth/logout (invalidação de token)
- [x] **BAUTH-04**: Endpoint GET /api/auth/me com dados do usuário autenticado
- [x] **BAUTH-05**: Middleware de autenticação JWT para rotas protegidas
- [x] **BAUTH-06**: Endpoint POST /api/auth/recovery (reset de senha)

### Inventário Backend

- [x] **BINV-01**: Endpoint GET /api/inventory com paginação (PaginatedResponse)
- [x] **BINV-02**: Endpoint GET /api/inventory/:id (ApiResponse)
- [x] **BINV-03**: Endpoint POST /api/inventory (criar item, admin only)
- [x] **BINV-04**: Endpoint PUT /api/inventory/:id (atualizar item, admin only)
- [x] **BINV-05**: Endpoint DELETE /api/inventory/:id (remover item, admin only)
- [x] **BINV-06**: Upload de imagem para item do inventário

### Empréstimos Backend

- [x] **BLOAN-01**: Endpoint GET /api/loans com paginação e filtros
- [x] **BLOAN-02**: Endpoint GET /api/loans/:id
- [x] **BLOAN-03**: Endpoint POST /api/loans (solicitar empréstimo)
- [x] **BLOAN-04**: Endpoint PUT /api/loans/:id (aprovar, rejeitar, devolver, cancelar)
- [x] **BLOAN-05**: Lógica de atualização de quantidade disponível/emprestada ao aprovar/devolver

### Usuários e Permissões Backend

- [x] **BUSER-01**: Endpoint GET /api/users com paginação (admin only)
- [x] **BUSER-02**: Endpoint GET /api/users/:id (admin only)
- [x] **BUSER-03**: Endpoint PUT /api/users/:id (atualizar perfil, tag, status)
- [x] **BUSER-04**: Endpoint DELETE /api/users/:id (desativar usuário, admin only)
- [x] **BPERM-01**: CRUD de Tags com permissões (11 chaves de permissão)
- [x] **BPERM-02**: CRUD de Categorias de estoque
- [x] **BPERM-03**: Middleware de autorização baseado em permissões da tag do usuário
- [x] **BPERM-04**: Override de permissões por usuário individual

### Notificações Backend

- [x] **BNOTIF-01**: Endpoint GET /api/notifications (listar notificações do usuário)
- [x] **BNOTIF-02**: Endpoint PUT /api/notifications/:id (marcar como lida)
- [x] **BNOTIF-03**: Criação automática de notificação ao aprovar/rejeitar empréstimo
- [x] **BNOTIF-04**: Configurações de preferência de notificação por usuário

### Relatórios Backend

- [x] **BREP-01**: Endpoint GET /api/reports/loans (relatório de empréstimos)
- [x] **BREP-02**: Endpoint GET /api/reports/inventory (relatório de inventário)

### Integração Frontend ↔ Backend

- [x] **BINT-01**: Substituir mocks do frontend por chamadas reais à API
- [x] **BINT-02**: Configurar AuthContext para usar JWT do backend
- [x] **BINT-03**: Tratamento de erros consistente entre front e back
- [x] **BINT-04**: Seed do banco com dados de demonstração (equivalente aos mocks atuais)

## Out of Scope

| Feature | Reason |
|---------|--------|
| WebSockets / Real-time | Complexidade desnecessária para v1, polling é suficiente |
| Email real (SMTP) | Protótipo acadêmico, simulação de email é suficiente |
| Upload para cloud (S3) | Armazenamento local é suficiente para protótipo |
| Rate limiting avançado | Não necessário para uso acadêmico |
| Testes E2E completos | Foco na implementação funcional primeiro |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| BINF-01..07 | Phase 10 | Pending |
| BAUTH-01..06 | Phase 10 | Pending |
| BINV-01..06 | Phase 7 | Pending |
| BLOAN-01..05 | Phase 7 | Pending |
| BUSER-01..04 | Phase 10 | Pending |
| BPERM-01..04 | Phase 10 | Pending |
| BNOTIF-01..04 | Phase 10 | Pending |
| BREP-01..02 | Phase 10 | Pending |
| BINT-01..04 | Phase 9 | Pending |

**Coverage:**
- Milestone 1 (frontend) requirements: 27 total — all Complete ✓
- Milestone 2 (backend) requirements: 37 total
- Mapped to phases: 37
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-14*
*Last updated: 2026-04-14 after GSD initialization*
