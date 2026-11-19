# Guia Completo de Hospedagem e Deploy — LabControl (Gratuito R$ 0,00)

Este documento descreve a arquitetura de publicação do **LabControl**, o passo a passo completo para hospedar o sistema do zero e os procedimentos para manutenção e deploys contínuos.

---

## 🏗️ 1. Arquitetura da Hospedagem

```text
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│     1. FRONTEND         │      │      2. BACKEND         │      │     3. BANCO DE DADOS   │
│       (Next.js)         │ ───► │   (Node.js/Express)     │ ───► │    (PostgreSQL 15+)     │
│   Hospedado na Vercel   │      │   Hospedado no Render   │      │  Hospedado no Supabase  │
│  (Totalmente Gratuito)  │      │  (Totalmente Gratuito)  │      │  (Totalmente Gratuito)  │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## Instalação local e primeiro acesso

Use Node.js 24.18.0 e pnpm 11.25.0 como versões de referência para a validação.
Execute os comandos de cada pacote dentro de `backend/` ou `frontend/`.

1. Instale as dependências nos dois pacotes com `pnpm install --frozen-lockfile --prod=false`.
2. No backend, use `.env.example` como referência. Defina `DATABASE_URL` para o PostgreSQL de desenvolvimento, `JWT_SECRET` com um segredo próprio e `CORS_ORIGIN=http://localhost:3000`. A porta padrão da API é `3001`.
3. Em `backend/`, execute `pnpm exec prisma migrate deploy` e `pnpm run db:generate`.
4. Disponibilize `LABCONTROL_ADMIN_NAME`, `LABCONTROL_ADMIN_EMAIL` e `LABCONTROL_ADMIN_PASSWORD` somente no ambiente do comando de provisionamento. Use uma senha aleatória e exclusiva, com no mínimo 16 caracteres e no máximo 72 bytes. Execute `pnpm exec prisma db seed -- --admin` em `backend/`. O comando cria o administrador com a tag Laboratorista e recusa um e-mail já cadastrado.
5. Inicie a API com `pnpm run dev` em `backend/`. Em `frontend/`, defina `NEXT_PUBLIC_API_URL=http://localhost:3001/api` e execute `pnpm run dev`. Essa URL também precisa estar disponível no build do frontend.
6. Abra a interface, selecione o acesso local, faça login e abra o catálogo. Execute `pnpm run lint` e `pnpm run build` em cada pacote para validar a instalação.

Para popular um banco descartável de desenvolvimento com dados de demonstração, execute `pnpm exec prisma db seed -- --demo` após migrar e gerar o cliente. O modo de demonstração é recusado com `NODE_ENV=production`. O servidor inicia sem executar seed.

Em `GET /api/health`, `data.database` informa a conectividade SQL. `data.readiness=ready` confirma que a API também consegue consultar as flags de primeiro acesso em `users`, inclusive quando a tabela está vazia. Com `not_ready`, confira a conexão e a aplicação das migrações. O endpoint mantém HTTP 200 nesses estados.

---

## 🗄️ 2. Passo a Passo — Banco de Dados e Armazenamento (Supabase)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Crie um novo projeto chamado `labcontrol-db` na região **South America (São Paulo)**.
3. Escolha uma senha forte para o banco de dados e guarde-a.
4. Em **Project Settings ⚙️ ➔ Database ➔ Connection String**, selecione **Transaction** para a conexão da API.
5. Copie a URL do Connection Pooler na porta **`6543`** (compatível com IPv4):
   ```text
   postgresql://postgres.xxxxxxxx:[SUA-SENHA]@aws-0-sa-east-1.pooler.supabase.com:6543/postgres
   ```
   *(⚠️ IMPORTANTE: Usar o Pooler na porta 6543 evita o erro `ENETUNREACH` no Render).*
6. No menu lateral do Supabase, acesse **Storage 📦 ➔ New Bucket**:
   - Crie o bucket `avatars` e marque a opção **Public bucket**.
   - Crie o bucket `items` e marque a opção **Public bucket**.
   *(Isso garante que as fotos de perfil e de equipamentos nunca sumam quando o container do Render reiniciar).*
7. Em **Project Settings ⚙️ ➔ API**, copie a **Project URL** e a chave secreta **service_role** (ou `anon` key).
8. Em `backend/`, disponibilize temporariamente em `DATABASE_URL` a conexão direta ou o pooler em modo **Session** aceito pelo provedor. Use a mesma base configurada para a API e execute as migrações versionadas:
   ```bash
   pnpm install --frozen-lockfile --prod=false
   pnpm exec prisma migrate deploy
   pnpm run db:generate
   ```
   Em uma base nova, disponibilize as três variáveis do administrador e execute `pnpm exec prisma db seed -- --admin` antes de iniciar o serviço.
   Se a base já foi criada por sincronização direta e não tem histórico de migrações, confira a equivalência do schema e prepare a linha de base do Prisma em uma cópia antes de atualizar o serviço.

---

### Contas de demonstração em bases existentes

Antes de atualizar uma base que recebeu o seed antigo, confirme que uma conta administrativa legítima consegue entrar e acessar a gestão de usuários. Identifique as contas de demonstração que ainda estão ativas, incluindo as administrativas. Desative as contas que não serão usadas e troque a senha das que precisarem ser mantidas. Preserve os registros e os vínculos de histórico dessas contas. Se houve uso de credenciais compartilhadas, trate as sessões existentes conforme a política de acesso da instituição.

A carga de demonstração é exclusiva do banco descartável `labcontrol_demo` em PostgreSQL local via TCP. Após aplicar as migrações e gerar o cliente, configure `DATABASE_URL` com a conexão local, sem parâmetros de consulta ou fragmento, e execute `pnpm exec prisma db seed -- --demo` em `backend/`. O comando recusa a execução em produção.

---

## 🚀 3. Passo a Passo — Backend (Render)

1. Acesse [render.com](https://render.com) e conecte sua conta do GitHub.
2. Clique em **New + ➔ Web Service** e selecione o repositório `ppi-next-js`.
3. Defina as configurações fundamentais:
   - **Name**: `labcontrol-backend`
   - **Root Directory**: `backend` *(⚠️ OBRIGATÓRIO: impede erro de package.json ausente)*
   - **Environment**: `Node`
   - **Build Command**: `pnpm install --frozen-lockfile --prod=false && pnpm run build`
   - **Start Command**: `pnpm start`
4. Em **Environment Variables**, insira:
   - `DATABASE_URL`: *(A URL do Supabase Connection Pooler obtida no Passo 2 na porta 6543)*
   - `SUPABASE_URL`: `https://xxxxxxxxxxxx.supabase.co` *(Project URL do Supabase)*
   - `SUPABASE_SERVICE_ROLE_KEY`: *(Chave service_role secreta obtida no Supabase)*
   - `JWT_SECRET`: *(Uma chave secreta com no mínimo 16 caracteres)*
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
   - `CORS_ORIGIN`: `https://ppi-next-js-one.vercel.app` *(⚠️ OBRIGATÓRIO: não usar `*` com cookies de sessão)*
   - `NODE_OPTIONS`: `--dns-result-order=ipv4first`
5. Clique em **Create Web Service**. Guarde a URL gerada (ex: `https://labcontrol-backend.onrender.com`).

---

## 🌐 4. Passo a Passo — Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub.
2. Clique em **Add New... ➔ Project** e importe o repositório `ppi-next-js`.
3. Na tela de configuração:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Clique em **Edit** ao lado de `./` e selecione a pasta **`frontend`** *(⚠️ OBRIGATÓRIO: impede erro No Next.js version detected)*.
   - **Install Command**: `pnpm install --frozen-lockfile --prod=false`
4. Em **Environment Variables**, insira:
   - `NEXT_PUBLIC_API_URL`: `https://labcontrol-backend.onrender.com/api`
5. Clique em **Deploy**.

---

## 🛠️ 5. Resolução de Problemas Comuns (Troubleshooting)

### 1. `Could not read package.json / ENOENT`
- **Causa**: O serviço de deploy tentou procurar o `package.json` na raiz do repositório monorepo.
- **Solução**: Garantir que o **Root Directory** no Render seja `backend` e na Vercel seja `frontend`.

### 2. `Could not find a declaration file for module 'express'` ou erro no build de TypeScript
- **Causa**: Uma instalação somente de produção pode omitir ferramentas necessárias ao build.
- **Solução**: Instale com `pnpm install --frozen-lockfile --prod=false` antes de rodar `pnpm run build`. O build do backend gera o cliente Prisma e compila com TypeScript.

### 3. `ERR_PNPM_OUTDATED_LOCKFILE` na Vercel
- **Causa**: O lockfile do pacote diverge do manifesto ou da versão do pnpm usada na instalação.
- **Solução**: Em uma atualização intencional de dependências, gere o lockfile no diretório do pacote com `pnpm install --lockfile-only` e confirme a instalação congelada antes de publicar.

### 4. Erro HTTP `404: NOT_FOUND` na Rota Raiz `/` na Vercel (Conflito de Middleware `proxy.ts`)
- **Causa**: Existência de arquivo com nome inconsistente como `proxy.ts` no frontend. O Next.js com Turbopack reconhece o arquivo como Middleware global, mas por não usar o nome padrão `middleware.ts`, intercepta a rota `/` e retorna HTTP 404 em produção.
- **Solução**: O arquivo `proxy.ts` foi removido do projeto. A autenticação de rotas no LabControl é tratada nativamente no estado global (`AuthContext`) e nos layouts protegidos (`(auth)/layout.tsx`), dispensando interceptadores globais que possam causar 404.

### 5. Bloqueio ou Timeout na Autenticação Institucional (SIGAA / LDAP)
- **Causa**: O servidor do IFFarroupilha rejeita conexões de nuvem (como Render/AWS) se não houver um `User-Agent` de navegador identificado.
- **Solução**: Inclusão do cabeçalho `User-Agent` de navegador e `AbortSignal.timeout(10000)` no proxy de autenticação do backend (`auth.controller.ts`).

### 6. Erro HTTP 500 no Auto-Cadastro de Usuários Institucionais
- **Causa**: Colisão de chave única no banco de dados (e-mail/matrícula) ou ausência de inserção inicial das tags de permissão.
- **Solução**: Confira o estado das migrações e se as tags padrão foram criadas pelo provisionamento explícito. Se já houver contas com os mesmos dados, confira a colisão no cadastro.

### 7. Erro `connect ENETUNREACH 2600:1f14:...` no Render (Conexão IPv6 do PostgreSQL)
- **Causa**: O Node.js tenta se conectar ao hostname do Supabase via IPv6. Os servidores do Render não possuem roteamento de saída em IPv6 na camada gratuita.
- **Solução**: O backend em `database.ts` força a resolução de nomes priorizando IPv4 (`dns.setDefaultResultOrder('ipv4first')`). Adicionalmente, utiliza-se a conexão com o Supabase Pooler na porta `6543` (Transaction Mode).

---

## 🔄 6. Atualizações Contínuas (Workflow de Manutenção)

Sempre que você fizer alterações no código e enviar para a branch `main` do GitHub (`git push origin main`):
- **O Render** fará a compilação e publicação automática do backend.
- **A Vercel** fará a compilação e publicação automática do frontend.
