export interface TagPermissions {
  ver_itens: boolean;
  pedir_emprestimos: boolean;
  ver_notificacoes: boolean;
  manipular_estoque: boolean;
  gerar_relatorios: boolean;
  aprovar_emprestimos: boolean;
  gerenciar_itens: boolean;
  gerenciar_usuarios: boolean;
  gerenciar_roles: boolean;
  gerenciar_categorias: boolean;
  gerenciar_permissoes: boolean;
}

export interface Tag {
  id: string;
  name: string;
  color: string;
  description: string;
  permissions: TagPermissions;
  userCount?: number;
}

export interface Category {
  id: string;
  name: string;
  createdAt: string;
  /** Quantidade de itens do estoque vinculados a esta categoria (mock) */
  linkedItemsCount?: number;
}

export interface UserPermissionOverride {
  userId: string;
  tagId: string;
  customOverrides: Partial<TagPermissions>;
}
