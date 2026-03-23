import { Tag, Category, UserPermissionOverride } from '@/types/settings';

// TODO: substituir por chamada real quando backend estiver pronto

export const MOCK_TAGS: Tag[] = [
  {
    id: 'tag-1',
    name: 'Aluno',
    color: '#0f62fe',
    description: 'Acesso básico para busca e solicitação de empréstimos',
    permissions: {
      ver_itens: true,
      pedir_emprestimos: true,
      ver_notificacoes: true,
      manipular_estoque: false,
      gerar_relatorios: false,
      aprovar_emprestimos: false,
      gerenciar_itens: false,
      gerenciar_usuarios: false,
      gerenciar_roles: false,
      gerenciar_categorias: false,
      gerenciar_permissoes: false,
    },
    userCount: 156,
  },
  {
    id: 'tag-2',
    name: 'Estagiário',
    color: '#f1c21b',
    description: 'Auxilia na gestão de estoque e relatórios',
    permissions: {
      ver_itens: true,
      pedir_emprestimos: true,
      ver_notificacoes: true,
      manipular_estoque: true,
      gerar_relatorios: true,
      aprovar_emprestimos: true,
      gerenciar_itens: false,
      gerenciar_usuarios: false,
      gerenciar_roles: false,
      gerenciar_categorias: false,
      gerenciar_permissoes: false,
    },
    userCount: 4,
  },
  {
    id: 'tag-3',
    name: 'Laboratorista',
    color: '#24a148',
    description: 'Acesso admin completo a todos os módulos do sistema',
    permissions: {
      ver_itens: true,
      pedir_emprestimos: true,
      ver_notificacoes: true,
      manipular_estoque: true,
      gerar_relatorios: true,
      aprovar_emprestimos: true,
      gerenciar_itens: true,
      gerenciar_usuarios: true,
      gerenciar_roles: true,
      gerenciar_categorias: true,
      gerenciar_permissoes: true,
    },
    userCount: 2,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Microcontroladores', createdAt: '2025-01-10T10:00:00Z', linkedItemsCount: 0 },
  { id: 'cat-2', name: 'Instrumentação', createdAt: '2025-01-11T12:30:00Z', linkedItemsCount: 3 },
  { id: 'cat-3', name: 'Sensores', createdAt: '2025-01-12T09:15:00Z', linkedItemsCount: 5 },
  { id: 'cat-4', name: 'Computadores', createdAt: '2025-01-15T14:45:00Z', linkedItemsCount: 0 },
];

export const MOCK_PERMISSION_OVERRIDES: UserPermissionOverride[] = [
  {
    userId: 'user-2', // Bruno Lima — Aluno com override
    tagId: 'tag-1',
    customOverrides: {
      manipular_estoque: true, // Override: pode ver estoque
    },
  },
];
