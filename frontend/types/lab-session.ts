/** Utilizador da sessão no app do laboratório (mock até existir GET /api/auth/me). */
export interface LabUserPermissions {
  verItens: boolean;
  pedirEmprestimos: boolean;
  VerNotificacoes: boolean;
  VerEstoque: boolean;
  GerarRelatorios: boolean;
  AprovEmprestimos: boolean;
  CriarItens: boolean;
  GerenciarItens: boolean;
  GerenciarUsuarios: boolean;
  GerenciarTag: boolean;
  GerenciarCat: boolean;
  GerenciarPermissoes: boolean;
}

export interface LabUserTag {
  name: string;
  /** Classe Tailwind para cor do texto (ex.: text-azure-800). */
  colorClass: string;
}

export interface LabSessionUser {
  id: number;
  name: string;
  email: string;
  password: string;
  tag: LabUserTag;
  userPermissions: LabUserPermissions;
}
