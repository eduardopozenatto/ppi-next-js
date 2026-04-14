# LabControl

## What This Is

LabControl é um micro SaaS de código aberto para gerenciamento de estoque e empréstimos de equipamentos em laboratórios de informática. O sistema permite que alunos busquem e solicitem empréstimos de itens, enquanto laboratoristas e estagiários gerenciam inventário, aprovações e relatórios. Atualmente, o frontend funciona com dados mock; o backend REST API está sendo construído para tornar o sistema funcional.

## Core Value

Alunos podem solicitar empréstimos de equipamentos do laboratório e laboratoristas podem gerenciar o estoque e aprovar/rejeitar empréstimos de forma centralizada.

## Requirements

### Validated

<!-- Shipped and confirmed valuable (frontend already implemented). -->

- ✓ Interface de autenticação (login, registro, recuperação de senha) — Milestone 1
- ✓ Catálogo de itens com busca e filtro por categoria — Milestone 1
- ✓ Formulário de solicitação de empréstimo com carrinho — Milestone 1
- ✓ Listagem de empréstimos com tabs (ativos, pendentes, histórico) — Milestone 1
- ✓ Painel de aprovação de empréstimos para admin/estagiário — Milestone 1
- ✓ Gestão de estoque (adicionar, editar, visualizar itens) — Milestone 1
- ✓ Sistema de notificações — Milestone 1
- ✓ Gerenciamento de usuários (admin) — Milestone 1
- ✓ Configurações de perfil e notificações — Milestone 1
- ✓ Sistema de tags e permissões (11 permissões distintas) — Milestone 1
- ✓ Gerenciamento de categorias de estoque — Milestone 1
- ✓ Relatórios com KPIs e exportação — Milestone 1
- ✓ Sidebar responsiva com navegação baseada em permissões — Milestone 1

### Active

<!-- Current scope. Building toward these (Milestone 2: Backend). -->

- [ ] Backend REST API com Node.js/Express para todas as rotas definidas no contrato
- [ ] Banco de dados persistente (PostgreSQL) com migrations
- [ ] Autenticação real com JWT e hashing de senhas
- [ ] CRUD completo: Inventário, Empréstimos, Usuários, Tags, Categorias, Notificações
- [ ] Sistema de permissões no backend validado por middleware
- [ ] Upload de imagens para itens do inventário
- [ ] Integração frontend ↔ backend (substituir mocks por chamadas reais)

### Out of Scope

<!-- Explicit boundaries. -->

- Chat em tempo real — complexidade alta, não é core
- App mobile nativo — web-first, mobile responsive é suficiente para v1
- OAuth/SSO — email/senha é suficiente para o escopo acadêmico
- Deploy em produção/cloud — foco no protótipo local funcional

## Context

- Projeto acadêmico (PPI) desenvolvido por Eduardo Pozenatto
- Monorepo com pastas `frontend/` e `backend/` na raiz
- Frontend completo em Next.js 16 + React 19 + Tailwind v4 + TypeScript
- Frontend usa dados mock in-memory (8 arquivos em `mocks/`)
- Contrato de API já definido em `frontend_skills.md` (rotas, tipos, formatos de resposta)
- Backend esperado em `http://localhost:3001/api` (env: `NEXT_PUBLIC_API_URL`)
- Pasta `backend/` já criada, vazia — aguardando arquitetura e implementação
- Sistema de permissões com 11 chaves usando TagPermissions (tags definem base, overrides por usuário)

## Constraints

- **Stack do Backend**: Node.js + TypeScript + Express — alinhado com conhecimento do time
- **Banco de Dados**: PostgreSQL — robusto, gratuito, amplamente documentado
- **Contrato de API**: Deve seguir exatamente o formato definido em `frontend_skills.md` (ApiResponse<T>, PaginatedResponse<T>)
- **Porta do Backend**: 3001 (frontend já configurado para essa porta)
- **Idioma**: Interface e domínio em português brasileiro (permissões, labels, mensagens)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Next.js App Router para frontend | Routing moderno, layouts aninhados, SSR quando necessário | ✓ Good |
| Tailwind CSS v4 para estilização | Utility-first, rápido para prototipar | ✓ Good |
| Mock data layer separado em `mocks/` | Facilita transição para API real | ✓ Good |
| 11 permissões granulares via tags | Flexibilidade de controle de acesso | ✓ Good |
| Express para backend | Maduro, bem documentado, time familiar | — Pending |
| PostgreSQL como banco | Relacional, robusto, gratuito | — Pending |

---
*Last updated: 2026-04-14 after GSD initialization*
