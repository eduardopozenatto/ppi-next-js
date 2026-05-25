---
status: passed
phase: 11-correcoes-e-funcionalidades-v3
source: [11-06-SUMMARY.md, 11-07-SUMMARY.md, 11-08-SUMMARY.md, 11-09-SUMMARY.md, 11-10-SUMMARY.md]
started: 2026-05-25T13:59:00Z
updated: 2026-05-25T17:41:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

All tests completed successfully.

## Tests

### 1. Avatar in users table
expected: Na página `/admin/users`, a tabela deve exibir a foto de perfil do usuário se ele tiver enviado uma, em vez de apenas a letra inicial.
result: pass

### 2. DevCode in forgot-password
expected: Ao usar "Esqueci minha senha" em ambiente local, um toast deve aparecer com o `devCode` para podermos redefinir a senha sem precisar do servidor de email.
result: skipped

### 3. User hard delete cascade
expected: Como admin, excluir um usuário que possua empréstimos ativos/pendentes deve funcionar, excluindo todos os empréstimos em cascata sem erro.
result: pass

### 4. Report export functionality
expected: O botão de exportar relatórios de empréstimos (na aba Empréstimos) deve baixar o arquivo XLSX com TODOS os empréstimos e exibir corretamente o Nome e Email do solicitante.
result: pass

### 5. Catalog Search, Filter, UI, and Admin Filter
expected: Na aba de buscar itens (`/items`), a imagem deve aparecer corretamente, a barra de pesquisa deve filtrar instantaneamente, e o filtro de categoria também. Na UI de ver o item, a imagem e texto devem estar bem alinhados. No estoque (admin), excluir o item deve removê-lo da lista (itens inativos não devem aparecer).
result: pass

## Summary

total: 5
passed: 4
issues: 0
pending: 0
skipped: 1

## Gaps

