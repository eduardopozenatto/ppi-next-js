# LabControl — Gestão de Estoque e Empréstimos de Laboratório

O **LabControl** é um sistema web desenvolvido como projeto de **Prática Profissional Integrada (PPI)** para automatizar a gestão de componentes de hardware e o controle de empréstimos de equipamentos do laboratório de informática.

Ele permite que alunos solicitem materiais com facilidade, enquanto laboratoristas, estagiários e professores gerenciam o estoque, aprovam pedidos e acompanham as devoluções em um único lugar.

---

## 🚀 Como Rodar o Projeto Localmente

O projeto é dividido em duas partes principais:
1. **API Backend** (`/backend`): Servidor REST construído em Node.js com Express e Prisma ORM (PostgreSQL).
2. **Aplicação Frontend** (`/frontend`): Interface web construída em Next.js (React) com Tailwind CSS.

### Pré-requisitos Básicos
- **Node.js** (versão 20 ou superior)
- **Git**
- Banco de dados **PostgreSQL** rodando (localmente ou via serviço em nuvem como o Supabase)

---

## 🛠️ Passo a Passo Rápido para Inicialização

### 1. Clonar o Repositório
```bash
git clone https://github.com/eduardopozenatto/ppi-next-js.git
cd ppi-next-js
```

### 2. Configurar e Iniciar o Backend
Navegue até a pasta `backend/`, instale as dependências, configure as variáveis de ambiente e inicie a API:
```bash
cd backend
npm install
# Crie o arquivo .env conforme as instruções em backend/README.md
npx prisma db push
npm run dev
```
Para obter detalhes completos da API e das variáveis de ambiente, acesse a [Documentação do Backend](backend/README.md).

### 3. Configurar e Iniciar o Frontend
Em outro terminal, navegue até a pasta `frontend/`, instale as dependências e inicie a aplicação web:
```bash
cd frontend
npm install
# Crie o arquivo .env.local conforme as instruções em frontend/README.md
npm run dev
```
Abra o navegador em `http://localhost:3000` para utilizar o sistema. Para mais informações da interface, acesse a [Documentação do Frontend](frontend/README.md).

---

## 📚 Documentações Específicas

- ⚙️ [Documentação e Guia do Backend (`backend/README.md`)](backend/README.md)
- 💻 [Documentação e Guia do Frontend (`frontend/README.md`)](frontend/README.md)
- ☁️ [Guia de Deploy em Produção (`docs/DEPLOYMENT_GUIDE.md`)](docs/DEPLOYMENT_GUIDE.md)

---

## 👥 Projeto Acadêmico (PPI)
Desenvolvido pela equipe do curso de Ciência da Computação / Informática no Instituto Federal Farroupilha (IFFarroupilha).