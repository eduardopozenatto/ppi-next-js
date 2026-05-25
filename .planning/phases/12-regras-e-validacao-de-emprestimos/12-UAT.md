---
status: testing
phase: 12-regras-e-validacao-de-emprestimos
source: [12-01-PLAN.md, 12-02-PLAN.md]
started: 2026-05-25T18:46:00Z
updated: 2026-05-25T18:46:00Z
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Date in the past
expected: |
  Ao tentar criar um empréstimo em `/loans/new` com uma data de devolução prevista no passado, o frontend deve bloquear o envio e exibir um erro amigável de validação ("A data de devolução não pode ser no passado").
awaiting: user response

## Tests

### 1. Date in the past
expected: Ao tentar criar um empréstimo em `/loans/new` com uma data de devolução prevista no passado, o frontend deve bloquear o envio e exibir um erro amigável de validação ("A data de devolução não pode ser no passado").
result: pending

### 2. Date exceeds 30 days
expected: Ao tentar criar um empréstimo em `/loans/new` com uma data de devolução prevista superior a 30 dias no futuro, o frontend deve bloquear o envio e exibir um erro de validação ("O período de empréstimo não pode exceder 30 dias").
result: pending

### 3. Borrower details read-only for Aluno
expected: Logado como Aluno (ex: `carlos.aluno.lab@gmail.com`), os campos de Nome e E-mail em `/loans/new` devem estar pré-preenchidos e bloqueados (read-only), impedindo que o aluno faça solicitações se passando por outro usuário.
result: pending

### 4. Borrower details editable for Admin
expected: Logado como Laboratorista (ex: `labcontrol.admin@gmail.com`), os campos de Nome e E-mail em `/loans/new` devem estar liberados para edição, permitindo preencher o e-mail de outro usuário. Ao submeter, o empréstimo deve ser criado no nome do usuário correspondente no backend.
result: pending

## Summary

total: 4
passed: 0
issues: 0
pending: 4
skipped: 0

## Gaps
