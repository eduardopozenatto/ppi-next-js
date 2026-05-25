---
status: passed
phase: 12-regras-e-validacao-de-emprestimos
source: [12-01-PLAN.md, 12-02-PLAN.md]
started: 2026-05-25T18:46:00Z
updated: 2026-05-25T18:55:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

All tests completed successfully.

## Tests

### 1. Date in the past
expected: Ao tentar criar um empréstimo em `/loans/new` com uma data de devolução prevista no passado, o frontend deve bloquear o envio e exibir um erro amigável de validação ("A data de devolução não pode ser no passado").
result: pass

### 2. Date exceeds 30 days
expected: Ao tentar criar um empréstimo em `/loans/new` com uma data de devolução prevista superior a 30 dias no futuro, o frontend deve bloquear o envio e exibir um erro de validação ("O período de empréstimo não pode exceder 30 dias").
result: pass

### 3. Borrower details read-only for Aluno
expected: Logado como Aluno (ex: `carlos.aluno.lab@gmail.com`), os campos de Nome e E-mail em `/loans/new` devem estar pré-preenchidos e bloqueados (read-only), impedindo que o aluno faça solicitações se passando por outro usuário.
result: pass

### 4. Borrower details editable for Admin
expected: Logado como Laboratorista (ex: `labcontrol.admin@gmail.com`), os campos de Nome e E-mail em `/loans/new` devem estar liberados para edição, permitindo preencher o e-mail de outro usuário. Ao submeter, o empréstimo deve ser criado no nome do usuário correspondente no backend.
result: pass

## Summary

total: 4
passed: 4
issues: 0
pending: 0
skipped: 0

## Gaps
