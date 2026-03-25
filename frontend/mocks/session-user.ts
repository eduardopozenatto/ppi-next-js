import type { LabSessionUser } from "@/types/lab-session";

// TODO: substituir por chamada real quando backend estiver pronto
// import { getCurrentUser } from '@/lib/api/auth'

/** Laboratorista — acesso completo a todos os módulos */
export const MOCK_LABORATORISTA: LabSessionUser = {
  id: 1,
  name: "Prof. Eduardo Pozenatto",
  email: "labcontrol.admin@gmail.com",
  password: "1234",
  tag: {
    name: "laboratorista",
    colorClass: "text-emerald-700",
  },
  userPermissions: {
    verItens: true,
    pedirEmprestimos: true,
    VerNotificacoes: true,
    VerEstoque: true,
    GerarRelatorios: true,
    AprovEmprestimos: true,
    CriarItens: true,
    GerenciarItens: true,
    GerenciarUsuarios: true,
    GerenciarTag: true,
    GerenciarCat: true,
    GerenciarPermissoes: true,
  },
};

/** Estagiário — acesso intermediário (visualiza estoque, relatórios, aprova empréstimos) */
export const MOCK_ESTAGIARIO: LabSessionUser = {
  id: 2,
  name: "Maria Santos",
  email: "maria.estagiaria@gmail.com",
  password: "1234",
  tag: {
    name: "estagiário",
    colorClass: "text-yellow-700",
  },
  userPermissions: {
    verItens: true,
    pedirEmprestimos: true,
    VerNotificacoes: true,
    VerEstoque: true,
    GerarRelatorios: true,
    AprovEmprestimos: true,
    CriarItens: false,
    GerenciarItens: false,
    GerenciarUsuarios: false,
    GerenciarTag: false,
    GerenciarCat: false,
    GerenciarPermissoes: false,
  },
};

/** Aluno — acesso básico (buscar itens, pedir empréstimos, notificações) */
export const MOCK_ALUNO: LabSessionUser = {
  id: 3,
  name: "Carlos Silva",
  email: "carlos.aluno.lab@gmail.com",
  password: "1234",
  tag: {
    name: "aluno",
    colorClass: "text-azure-800",
  },
  userPermissions: {
    verItens: true,
    pedirEmprestimos: true,
    VerNotificacoes: true,
    VerEstoque: false,
    GerarRelatorios: false,
    AprovEmprestimos: false,
    CriarItens: false,
    GerenciarItens: false,
    GerenciarUsuarios: false,
    GerenciarTag: false,
    GerenciarCat: false,
    GerenciarPermissoes: false,
  },
};

export const MOCK_NEW_USERS: LabSessionUser[] = [
  {
    id: 1,
    name: "Carlos Silva",
    email: "carlos.aluno.lab@gmail.com",
    password: "1234",
    tag: {
      name: "aluno",
      colorClass: "text-azure-800",
    },
    userPermissions: {
      verItens: true,
      pedirEmprestimos: true,
      VerNotificacoes: true,
      VerEstoque: false,
      GerarRelatorios: false,
      AprovEmprestimos: false,
      CriarItens: false,
      GerenciarItens: false,
      GerenciarUsuarios: false,
      GerenciarTag: false,
      GerenciarCat: false,
      GerenciarPermissoes: false,
    },
  },

];

/** Todos os usuários mock — usado pelo login para buscar por email */
export const MOCK_USERS_DB: LabSessionUser[] = [
  MOCK_LABORATORISTA,
  MOCK_ESTAGIARIO,
  MOCK_ALUNO,
];

/** Compatibilidade — exporta o laboratorista como default */
export const MOCK_SESSION_USER = MOCK_LABORATORISTA;
