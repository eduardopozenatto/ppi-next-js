# Phase 7 Research: CRUD de Inventário e Empréstimos

## Contexto
O Phase 7 representa o *core business logic* da aplicação:
1. **Inventário**: Criação, listagem e controle de quantidade de itens. Inclui upload de imagem.
2. **Empréstimos**: Ciclo de vida de solicitações de empréstimo (criação, aprovação, devolução, recusa). O status do empréstimo afeta diretamente o campo `availableQuantity` e `loanedQuantity` do Inventário correspondente.

## Modelagem dos Dados 

### InventoryItem
O banco de dados guarda:
`id, name, description, isActive, quantity, availableQuantity, loanedQuantity, image, categoryId`

O Front-end aguarda a interface `LabInventoryListItem`:
`id, name, description, isActive, quantity, availableQuantity, loanedQuantity, image, category` (o nome da categoria como string).

### Loan
O banco de dados guarda:
`id, borrowerId, status (Enum), loanDate, dueDate, returnedDate, notes, labObservation, returnedLate, createdAt, updatedAt`
E a tabela N:N `LoanItem` com a quantidade do item na transação.

O Front-end aguarda `Loan`:
`id, borrowerName, borrowerEmail, borrowerId, items: [{inventoryItemId, inventoryItemName, quantity}], status, loanDate, dueDate, returnedDate, notes, labObservation, returnedLate, createdAt, updatedAt`.

## Lógica de Validação e Transações

### Criando Empréstimos (`POST /api/loans`)
1. **Autenticação**: Qualquer usuário com a permissão `pedir_emprestimos`.
2. **Validação**: Verifica se os itens existem no BD, e se `item.availableQuantity >= requestedQuantity`.
3. **Persistência**: Criação de um registro Transactional (Prisma `$transaction`), pois precisamos reduzir `availableQuantity` de N itens e inserir o `Loan` e `LoanItem`s em uma cartada só para evitar concorrência ou dados inconsistentes.

### Mudanças de Status (`PUT /api/loans/:id/status`)
1. **Aprovar**: Apenas marca como ativo. (Note que a quantidade foi separada em `availableQuantity` reduzida na CRIAÇÃO). Mas wait! Ou a quantidade deve ser deduzida na aprovação? 
> **Decisão de Negócio**: Como é `pending`, e o empréstimo pode ser rejeitado, a quantidade *disponível* DEVE ser deduzida no momento que o usuário submete o request (status pending) para "reservar" o sistema? O frontend subtrai imediatamente no carrinho virtual (mas ali é state client). Geralmente em bibliotecas, ao solicitar você retém a unidade provisoriamente, se o ADM dar denied (`cancelled`/`rejected`), a `availableQuantity` volta. E `loanedQuantity` só incrementa quando dá ACTIVE? No modelo, o Mock inicial faz `availableQuantity` ser a quantidade em estoque não alugada.
*No backend, reduziremos `availableQuantity` no PUT e aumentaremos `loanedQuantity`?* Sim, ou fazer a matemática com base na quantidade subtraída durante a reserva.
**Proposta**: `availableQuantity` DIMINUI assim que pedimos. Se `Rejected`, aumenta devolta. A `loanedQuantity` AUMENTA apenas quando vai de `Pending -> Active`. Quando devolvido (`Active -> Returned`), a `availableQuantity` AUMENTA e a `loanedQuantity` CAI.

### Upload de Arquivos (`POST /api/inventory/upload`) ou Multipart Form
Para salvar a `image` do inventário, o melhor caminho no Express é adicionar a biblioteca `multer`. Faremos setup de um endpoint `POST /api/inventory/:id/image` usando multer, salvando as imagens em `public/uploads/` e expondo `/uploads` como path estático.

## Endpoints Mapeados

**Inventário (`/api/inventory`)**
- `GET /` -> Lista itens com paginação (`limit`, `page`) e filtros `search` e `categoryId`
- `GET /:id` -> Detalhes do item
- `POST /` (Requer: manipular_estoque ou gerenciar_itens) -> Cria registro base
- `PUT /:id` (Requer: manipular_estoque ou gerenciar_itens) -> Edição base
- `PUT /:id/image` -> Recebe form-data para upload local de imagem.

**Empréstimos (`/api/loans`)**
- `POST /` (Requer: pedir_emprestimos) -> Cria o `Loan` e reserva itens DB.
- `GET /` -> Lista os loans, permitindo Admin ver todos (se `aprovar_emprestimos` ou `gerenciar_itens`) ou o User ver os próprios `borrowerId === req.user.id`. Filtro de `status` e paginação.
- `GET /:id`
- `PUT /:id/status` (Requer: aprovar_emprestimos) -> Muda ativo/devolvido/atrasado.

## Resumo Técnicas Adotadas
- **Transaction Prisma**: `$transaction` em Loans.
- **FS + Multer**: `npm i multer @types/multer`. Roteador stático do express para entregar as imagens publicadas.
