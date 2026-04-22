# Phase 6 Research: Autenticação e Autorização

## Contexto
O frontend atual utiliza um `AuthContext` estático baseado no arquivo `frontend/mocks/session-user.ts`.
Precisamos criar as rotas da API que irão validar as credenciais e retornar JWTs, além dos middlewares de proteção de rotas (`requireAuth` e `requirePermission`).

## Requisitos do Contrato do Frontend
De acordo com `frontend/contexts/AuthContext.tsx` e `frontend/types/lab-session.ts`:

### 1. Modelo de Sessão (`LabSessionUser`)
O payload esperado ao buscar os dados da sessão (`GET /api/auth/me`) é:
```typescript
interface LabSessionUser {
  id: number; // NO BACKEND ISTO É STRING (CUID). Precisamos alinhar depois (Phase 9).
  name: string;
  email: string;
  matricula?: string;
  tag: {
    name: string;
    colorClass: string; // Cor
  };
  userPermissions: LabUserPermissions; // As 11 permissões (boolean)
}
```

### 2. Login (`POST /api/auth/login`)
Espera receber `email` e `password`.
Retorna o JWT (poderia ser um cookie, mas vamos retornar na resposta para Flexibilidade ou setar como HttpOnly cookie dependendo da escolha de design).
Como CORS já aceita credentials, usaremos JWT em **Cookie HttpOnly** para maior segurança.

### 3. Registro (`POST /api/auth/register`)
Espera receber `name`, `email`, `matricula`, e `password`.
Retorna apenas sucesso ou mensagem de erro. Não faz login automático (o frontend no mock também não faz).

### 4. Estrutura de Permissões
Temos 11 chaves de permissão booleanas:
- `ver_itens`
- `pedir_emprestimos`
- `ver_notificacoes`
- `manipular_estoque`
- `gerar_relatorios`
- `aprovar_emprestimos`
- `gerenciar_itens`
- `gerenciar_usuarios`
- `gerenciar_roles`
- `gerenciar_categorias`
- `gerenciar_permissoes`

O middleware deverá checar se a permissão é requerida. Note que as permissões devem combinar a `Tag.permissions` com as `UserPermissionOverride.customOverrides`.

### Decisões Técnicas:
1. **Bibliotecas:** `bcrypt` (hash de senhas), `jsonwebtoken` (geração e validação de tokens), `cookie-parser` (leitura dos cookies HTTP-only).
2. **Hash da Senha:** Ao registrar ou atualizar, usar salt de 10 rounds. (No banco os usuários do seed estão com hash plain-text `1234`, precisaremos de um script / utilitário para converter ou logar eles ignorando o compare temporariamente? Não, é mais fácil rodar um script que faz hash das senhas atuais no Seed).
3. **Middleware de Auth (`requireAuth`):** Lerá o token do cookie (ou Header de Authorization caso o token seja passado no Bearer). Se ok, injeta o id do user no request e busca no banco (incluindo as tag e permissões), populando `req.user`.
4. **Middleware de Autorização (`requirePermission`):** Função factory ex: `requirePermission('manipular_estoque')`. Lê o `req.user.userPermissions` e retorna 403 Forbidden se falso.

### Mudança necessária no Seed da Phase 5 (Apenas para senhas):
Ao invés de armazenar `"1234"` em texto puro no Seed, devemos gerar o hash ou permitir que o frontend teste com as contas mock. O ideal é o próprio seed inserir com o bcrypt hash de `"1234"` (que é `$2b$10$X...`). O seed precisará gerar bcrypt na hora. Deixaremos isso como um script de update na Phase 6 caso seja necessário testar autenticação.

## Plano de Implementação
Planejado em 3 partes lógicas (um único Plan document):
1. **Bibliotecas e Zod Schemas:** Instalar dependências auth e criar DTOs.
2. **Utils de Auth e Middlewares:** Token generatrion, password hashing, `requireAuth` e `requirePermission`.
3. **Controllers e Rotas:** `/login`, `/register`, `/logout`, `/me`, anexados ao entrypoint principal.
