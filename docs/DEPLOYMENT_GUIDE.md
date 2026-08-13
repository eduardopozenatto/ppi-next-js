# Guia Completo de Hospedagem e Deploy — LabControl (Gratuito R$ 0,00)

Este documento descreve a arquitetura de publicação do **LabControl**, o passo a passo completo para hospedar o sistema do zero e os procedimentos para manutenção e deploys contínuos.

---

## 🏗️ 1. Arquitetura da Hospedagem

```text
┌─────────────────────────┐      ┌─────────────────────────┐      ┌─────────────────────────┐
│     1. FRONTEND         │      │      2. BACKEND         │      │     3. BANCO DE DADOS   │
│     (Next.js 15)        │ ───► │   (Node.js/Express)     │ ───► │    (PostgreSQL 15+)     │
│   Hospedado na Vercel   │      │   Hospedado no Render   │      │  Hospedado no Supabase  │
│  (Totalmente Gratuito)  │      │  (Totalmente Gratuito)  │      │  (Totalmente Gratuito)  │
└─────────────────────────┘      └─────────────────────────┘      └─────────────────────────┘
```

---

## 🗄️ 2. Passo a Passo — Banco de Dados (Supabase)

1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita.
2. Crie um novo projeto chamado `labcontrol-db` na região **South America (São Paulo)**.
3. Escolha uma senha forte para o banco e guarde-a.
4. Em **Project Settings ⚙️ ➔ Database ➔ Connection String (URI)**, copie a URL no formato:
   ```text
   postgresql://postgres:[SUA-SENHA]@db.xxxxxxxx.supabase.co:5432/postgres
   ```
5. No seu computador local, abra o arquivo `backend/.env` e cole a URL na variável `DATABASE_URL`.
6. No terminal dentro da pasta `backend/`, execute as migrações e o seed inicial:
   ```bash
   # Aplica a estrutura de tabelas no Supabase
   npx prisma db push

   # Popula os dados iniciais (admin, tags, categorias e itens de teste)
   npx prisma db seed
   ```

---

## 🚀 3. Passo a Passo — Backend (Render)

1. Acesse [render.com](https://render.com) e conecte sua conta do GitHub.
2. Clique em **New + ➔ Web Service** e selecione o repositório `ppi-next-js`.
3. Defina as configurações fundamentais:
   - **Name**: `labcontrol-backend`
   - **Root Directory**: `backend` *(⚠️ OBRIGATÓRIO: impede erro de package.json ausente)*
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
4. Em **Environment Variables**, insira:
   - `DATABASE_URL`: *(A URL do Supabase obtida no Passo 2)*
   - `JWT_SECRET`: *(Uma chave secreta para tokens)*
   - `NODE_ENV`: `production`
   - `PORT`: `3001`
   - `CORS_ORIGIN`: `*` *(ou a URL do frontend na Vercel)*
5. Clique em **Create Web Service**. Guarde a URL gerada (ex: `https://labcontrol-backend.onrender.com`).

---

## 🌐 4. Passo a Passo — Frontend (Vercel)

1. Acesse [vercel.com](https://vercel.com) e faça login com o GitHub.
2. Clique em **Add New... ➔ Project** e importe o repositório `ppi-next-js`.
3. Na tela de configuração:
   - **Framework Preset**: `Next.js`
   - **Root Directory**: Clique em **Edit** ao lado de `./` e selecione a pasta **`frontend`** *(⚠️ OBRIGATÓRIO: impede erro No Next.js version detected)*.
4. Em **Environment Variables**, insira:
   - `NEXT_PUBLIC_API_URL`: `https://labcontrol-backend.onrender.com/api`
5. Clique em **Deploy**.

---

## 🛠️ 5. Resolução de Problemas Comuns (Troubleshooting)

### 1. `Could not read package.json / ENOENT`
- **Causa**: O serviço de deploy tentou procurar o `package.json` na raiz do repositório monorepo.
- **Solução**: Garantir que o **Root Directory** no Render seja `backend` e na Vercel seja `frontend`.

### 2. `Could not find a declaration file for module 'express'` ou erro no build de TypeScript
- **Causa**: O `npm install` em ambientes de produção (`NODE_ENV=production`) ignora `devDependencies`.
- **Solução**: Pacotes de tipagem (`@types/*`) e o `prisma` foram movidos para `dependencies` no `backend/package.json`. O script de build executa obrigatoriamente `"build": "prisma generate && tsc"`.

### 3. `ERR_PNPM_OUTDATED_LOCKFILE` na Vercel
- **Causa**: Presença de um arquivo `pnpm-lock.yaml` legado ou desatualizado no `frontend`.
- **Solução**: O arquivo `pnpm-lock.yaml` foi removido do repositório para que a Vercel utilize o `npm` com `package.json` limpo.

### 4. Erro HTTP `404: NOT_FOUND` na Rota Raiz `/` na Vercel (Conflito de Middleware `proxy.ts`)
- **Causa**: Existência de arquivo com nome inconsistente como `proxy.ts` no frontend. O Next.js com Turbopack reconhece o arquivo como Middleware global, mas por não usar o nome padrão `middleware.ts`, intercepta a rota `/` e retorna HTTP 404 em produção.
- **Solução**: O arquivo `proxy.ts` foi removido do projeto. A autenticação de rotas no LabControl é tratada nativamente no estado global (`AuthContext`) e nos layouts protegidos (`(auth)/layout.tsx`), dispensando interceptadores globais que possam causar 404.

---

## 🔄 6. Atualizações Contínuas (Workflow de Manutenção)

Sempre que você fizer alterações no código e enviar para a branch `main` do GitHub (`git push origin main`):
- **O Render** fará a compilação e publicação automática do backend.
- **A Vercel** fará a compilação e publicação automática do frontend.
