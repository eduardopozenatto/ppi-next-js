# LabControl Frontend (Aplicação Web)

Esta é a interface de usuário da plataforma **LabControl**, desenvolvida para proporcionar uma navegação fluida, responsiva (Mobile-First) e integrada com suporte completo a Tema Claro e Tema Escuro (Dark Mode).

---

## 🛠️ Tecnologias Utilizadas (Stack)

- **React 19** & **Next.js** (App Router)
- **TypeScript** (Tipagem estática em toda a aplicação)
- **Tailwind CSS v4** (Estilização via tokens semânticos de CSS)
- **Context API** (Gerenciamento global de autenticação, carrinho, tema e toasts)

---

## ⚙️ Configuração de Variáveis de Ambiente (`.env.local`)

Na raiz da pasta `frontend/`, crie um arquivo chamado `.env.local` contendo a URL da API backend:

```env
# URL da API Backend local
NEXT_PUBLIC_API_URL="http://localhost:3001/api"
```

---

## 🚀 Como Executar Localmente

### 1. Instalar Dependências
```bash
npm install
```

### 2. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```

Abra o seu navegador e acesse `http://localhost:3000`.

---

## 📁 Estrutura da Aplicação

- `app/`: Estrutura de rotas do Next.js App Router (páginas públicas e rotas autenticadas).
- `components/`: Componentes visuais reutilizáveis (botões, modais, cartões, tabelas, cabeçalhos, sidebar).
- `contexts/`: Contextos globais da aplicação (`AuthContext`, `CartContext`, `ThemeContext`).
- `hooks/`: Hooks customizados para facilitação de lógica (`useAuth`, `useCart`, `useTheme`).
- `lib/`: Cliente de requisições HTTP (`api`) e funções utilitárias.
- `types/`: Interfaces e definições de tipos em TypeScript.
