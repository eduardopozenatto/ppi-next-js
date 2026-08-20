# LabControl Backend (API REST)

Este é o servidor de backend da plataforma **LabControl**, responsável por gerenciar a regra de negócio, persistência de dados, autenticação de usuários e integração institucional.

---

## 🛠️ Tecnologias Utilizadas (Stack)

- **Node.js** & **TypeScript**
- **Express.js** (Framework HTTP)
- **Prisma ORM** (Modelagem e manipulação do banco de dados)
- **PostgreSQL** (Banco de dados relacional)
- **JWT (JSON Web Token)** (Autenticação via HTTPOnly Cookies)
- **BcryptJS** (Criptografia segura de senhas)
- **Nodemailer** (Envio de e-mails de notificação/recuperação)
- **Twilio** (Envio de mensagens SMS)

---

## ⚙️ Configuração de Variáveis de Ambiente (`.env`)

Na raiz da pasta `backend/`, crie um arquivo chamado `.env` contendo as seguintes variáveis:

```env
# Porta de execução do servidor
PORT=3001
NODE_ENV=development

# Conexão com o Banco de Dados PostgreSQL (Exemplo com Supabase ou local)
DATABASE_URL="postgresql://usuario:senha@localhost:5432/labcontrol"

# Origem permitida no CORS (URL do Frontend)
CORS_ORIGIN="http://localhost:3000"

# Chave secreta para assinatura dos tokens JWT
JWT_SECRET="sua_chave_secreta_aqui"

# Configurações de E-mail (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASS=sua_senha_de_app
SMTP_FROM="LabControl" <noreply@labcontrol.app>

# Configurações de SMS (Twilio - Opcional)
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Armazenamento em Nuvem Supabase Storage (Opcional - para Render / Produção)
SUPABASE_URL=https://xxxxxxxxxxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_BUCKET_AVATARS=avatars
SUPABASE_BUCKET_ITEMS=items
```

---

## 🚀 Como Executar Localmente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Sincronizar o Banco de Dados
Certifique-se de que a variável `DATABASE_URL` no seu `.env` esteja apontando para um banco PostgreSQL válido. Em seguida, execute o comando abaixo para criar as tabelas e gerar o cliente do Prisma:
```bash
npx prisma db push
npx prisma generate
```

### 3. Iniciar o Servidor em Modo de Desenvolvimento
```bash
npm run dev
```
O servidor estará rodando em `http://localhost:3001`.

---

## 📋 Principais Funcionalidades da API

- **Autenticação**: Login local (e-mail/senha) e Proxy Institucional com o portal do IFFarroupilha (SIGAA/LDAP) com auto-provisionamento de alunos.
- **Gestão de Inventário**: CRUD completo de equipamentos, categorias e controle de quantidades (disponível vs emprestado).
- **Gerenciamento de Empréstimos**: Solicitação, aprovação, rejeição com justificativa, baixa em estoque e devoluções.
- **Controle de Acesso**: Permissões granulares divididas em 11 permissões distintas via Tags.
- **Notificações**: Sistema centralizado de avisos na plataforma (In-App), e-mails (SMTP) e mensagens SMS (Twilio).

---

## 🗺️ Mapa de Rotas da API

| Prefixo de Rota | Métodos HTTP | Descrição do Módulo |
|---|---|---|
| `/api/auth` | `POST`, `GET`, `PATCH` | Autenticação (Local e SIGAA/LDAP), recuperação de senha e alteração de dados |
| `/api/users` | `GET`, `POST`, `PUT`, `DELETE` | Gerenciamento administrativo de usuários, tags e permissões |
| `/api/inventory` | `GET`, `POST`, `PUT`, `DELETE` | Catálogo de itens do estoque, ativação/desativação e categorias |
| `/api/loans` | `GET`, `POST`, `PUT`, `DELETE` | Solicitações, aprovações, rejeições e devoluções de empréstimos |
| `/api/notifications` | `GET`, `PATCH`, `DELETE` | Central de notificações in-app dos usuários |
| `/api/reports` | `GET` | Relatórios com KPIs do sistema e exportação de planilhas XLSX |

