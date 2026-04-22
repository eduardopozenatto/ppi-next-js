import type { TagPermissions } from "./settings";

/** Permissões do utilizador na sessão (segue shape da API GET /api/auth/me). */
export type LabUserPermissions = TagPermissions;

export interface LabUserTag {
  name: string;
  /** Classe Tailwind para cor do texto (ex.: text-azure-800). */
  colorClass: string;
}

export interface LabSessionUser {
  id: number;
  name: string;
  email: string;
  matricula?: string;
  tag: LabUserTag;
  userPermissions: LabUserPermissions;
}
