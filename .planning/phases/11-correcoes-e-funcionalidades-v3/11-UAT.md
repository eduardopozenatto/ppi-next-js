---
status: complete
phase: 11-correcoes-e-funcionalidades-v3
source: [artifacts/phase_11_execution_summary.md, artifacts/v3_bugfix_report.md]
started: 2026-05-25T12:55:00.000Z
updated: 2026-05-25T13:35:24.000Z
---

## Current Test

[testing complete]

## Tests

### 1. Upload e Exibição de Foto de Perfil
expected: |
  Na página de Perfil (`/settings/profile`), ao enviar uma foto com limite de 2MB (JPG/PNG/WEBP):
  1. O upload deve ter sucesso (toast de confirmação).
  2. A pré-visualização deve funcionar perfeitamente.
  3. A foto na barra lateral (AppSidebar, no canto inferior esquerdo) e na própria página de perfil devem atualizar com a imagem carregada via backend (sem erro 404).
result: issue
reported: "na seção usuários, não aparece minha foto de perfil, só a sigla do início do nome. ex; Prof. Carlos Pozenatto, aparece P com o fundo azul mesmo eu tendo mudado a foto"
severity: minor

### 2. Recuperação de Senha via Email
expected: |
  Acessar `/recovery` sem estar logado:
  1. Informar um email existente no banco (ou o email configurado em ambiente dev).
  2. Um código de 6 dígitos será recebido via email (ou no console em dev, já que não temos SMTP no momento).
  3. Informar o código na UI, que deve aceitar e validar.
  4. Inserir a nova senha. Ao finalizar, tentar login com a nova senha deve funcionar.
result: issue
reported: "não recebi o email"
severity: major

### 3. Exclusão Permanente de Usuário (Hard Delete)
expected: |
  Como Admin, ir para a página de usuários (`/admin/users`) e clicar no ícone de exclusão:
  1. O modal deve exibir um ícone vermelho de alerta avisando sobre a exclusão permanente.
  2. Ao excluir um usuário sem empréstimos ativos ou pendentes, o usuário é deletado e **some** da tabela (a exclusão reflete no backend e a tabela recarrega instantaneamente).
  3. Tentar excluir a si mesmo deve retornar um erro claro e bloquear a ação.
result: issue
reported: "mas se a maioria dos usuarios possuem emprestimos, como excluo eles mesmo tendo empréstimos ativos caso eles saiam do iff mesmo com empréstimo ativo ou pendente? como faço?"
severity: major

### 4. Exportação XLSX de Relatórios
expected: |
  Na aba de relatórios (`/admin/reports`):
  1. Clicar em "Exportar" para Inventário ou Empréstimos.
  2. Um arquivo `.xlsx` real deve ser baixado.
  3. Ao abrir o arquivo no Excel ou Planilhas, o relatório possui cabeçalhos, filtros e linhas totais, sem aparecer apenas um "alert" na tela do navegador.
result: issue
reported: "O arquivo baixa, porém o estoque não puxa todos os itens e os empréstimos não puxa todas os usuários que fizeram empréstimo. Tem que puxar todos os detalhes"
severity: major

### 5. Edição de Estoque e Fotos do Inventário
expected: |
  No gerenciamento de estoque (`/inventory`):
  1. A tabela possui ícones para Ver (👁), Editar (✎) e Desativar (🗑) cada item.
  2. Clicando em Editar, é possível alterar o nome, disponibilidade, descrição e também enviar uma Imagem real.
  3. Ao salvar, a imagem nova aparecerá em miniatura na tabela.
  4. Na aba "Buscar itens" (`/items`), as imagens salvas do inventário são renderizadas corretamente ao invés de um logo genérico.
result: issue
reported: "a foto ainda não aparece na aba de buscar itens. Além disso, a UI de ver item está muito desalinhada, corrija-a. Quando aperto para excluir o item, aparece o toast de excluido com sucesso, porem ele não é excluido verdadeiramente pois n some da página de estoque, nem na de buscar itens. E outro detalhe que vi, a pesquisa na aba buscar itens não funciona, nem a filtragem por categoria, corrija isso também."
severity: major

### 6. Correções de Notificações e Aprovação de Empréstimos
expected: |
  Sobre aprovações e notificações:
  1. A data e a observação de devolução (`dueDate` e `labObservation`) são salvas na aprovação ou rejeição de empréstimos sem dar erro na requisição.
  2. Clicar em "Excluir" em uma notificação em `/notifications` de fato exclui do banco de dados permanentemente.
  3. Um contador de notificações não-lidas aparece no ícone "Notificações" da barra lateral e atualiza sozinho (ou no refresh).
result: skipped
reason: "não testei isso ainda, quero corrigir os outros erros primeiro"

## Summary

total: 6
passed: 0
issues: 5
pending: 0
skipped: 1

## Gaps

- truth: "Upload e Exibição de Foto de Perfil"
  status: failed
  reason: "User reported: na seção usuários, não aparece minha foto de perfil, só a sigla do início do nome. ex; Prof. Carlos Pozenatto, aparece P com o fundo azul mesmo eu tendo mudado a foto"
  severity: minor
  test: 1
  artifacts: []
  missing: []
- truth: "Recuperação de Senha via Email"
  status: failed
  reason: "User reported: não recebi o email"
  severity: major
  test: 2
  artifacts: []
  missing: []
- truth: "Exclusão Permanente de Usuário (Hard Delete)"
  status: failed
  reason: "User reported: mas se a maioria dos usuarios possuem emprestimos, como excluo eles mesmo tendo empréstimos ativos caso eles saiam do iff mesmo com empréstimo ativo ou pendente? como faço?"
  severity: major
  test: 3
  artifacts: []
  missing: []
- truth: "Exportação XLSX de Relatórios"
  status: failed
  reason: "User reported: O arquivo baixa, porém o estoque não puxa todos os itens e os empréstimos não puxa todas os usuários que fizeram empréstimo. Tem que puxar todos os detalhes"
  severity: major
  test: 4
  artifacts: []
  missing: []
- truth: "Edição de Estoque e Fotos do Inventário"
  status: failed
  reason: "User reported: a foto ainda não aparece na aba de buscar itens. Além disso, a UI de ver item está muito desalinhada, corrija-a. Quando aperto para excluir o item, aparece o toast de excluido com sucesso, porem ele não é excluido verdadeiramente pois n some da página de estoque, nem na de buscar itens. E outro detalhe que vi, a pesquisa na aba buscar itens não funciona, nem a filtragem por categoria, corrija isso também."
  severity: major
  test: 5
  artifacts: []
  missing: []
