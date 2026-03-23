import { Tag, Category, UserPermissionOverride } from '@/types/settings';

export const MOCK_TAGS: Tag[] = [
  {
    id: 'tag-1',
    name: 'Aluno',
    color: '#0f62fe', // primary blue
    description: 'Acesso básico para busca e solicitação de empréstimos',
    permissions: {
      viewItems: true,
      requestLoans: true,
      viewNotifications: true,
      viewInventory: false,
      generateReports: false,
      approveLoans: false,
      manageItems: false,
      deleteItems: false,
      manageUsers: false,
      manageTags: false,
      manageCategories: false,
      managePermissions: false,
    },
    userCount: 156,
  },
  {
    id: 'tag-2',
    name: 'Estagiário',
    color: '#f1c21b', // warning yellow
    description: 'Auxilia na gestão de estoque e relatórios',
    permissions: {
      viewItems: true,
      requestLoans: true,
      viewNotifications: true,
      viewInventory: true,
      generateReports: true,
      approveLoans: true,
      manageItems: false,
      deleteItems: false,
      manageUsers: false,
      manageTags: false,
      manageCategories: false,
      managePermissions: false,
    },
    userCount: 4,
  },
  {
    id: 'tag-3',
    name: 'Laboratorista',
    color: '#24a148', // success green
    description: 'Acesso admin completo a todos os módulos do sistema',
    permissions: {
      viewItems: true,
      requestLoans: true,
      viewNotifications: true,
      viewInventory: true,
      generateReports: true,
      approveLoans: true,
      manageItems: true,
      deleteItems: true,
      manageUsers: true,
      manageTags: true,
      manageCategories: true,
      managePermissions: true,
    },
    userCount: 2,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  { id: 'cat-1', name: 'Microcontroladores', createdAt: '2025-01-10T10:00:00Z' },
  { id: 'cat-2', name: 'Instrumentação', createdAt: '2025-01-11T12:30:00Z' },
  { id: 'cat-3', name: 'Sensores', createdAt: '2025-01-12T09:15:00Z' },
  { id: 'cat-4', name: 'Computadores', createdAt: '2025-01-15T14:45:00Z' },
];

export const MOCK_PERMISSION_OVERRIDES: UserPermissionOverride[] = [
  {
    userId: 'user-2', // ID of a mock user
    tagId: 'tag-1', // They are an 'Aluno'
    customOverrides: {
      viewInventory: true, // But they have an individual override to view inventory
    },
  },
];
