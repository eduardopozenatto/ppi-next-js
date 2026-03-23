import type { User } from "@/types/user";

// TODO: substituir por chamada real quando backend estiver pronto

export const MOCK_ADMIN_USERS: User[] = [
  {
    id: "user-1",
    name: "Carlos Silva",
    email: "carlos@discente.uf.br",
    role: "user",
    matricula: "2021001234",
    tagId: "tag-1",
    createdAt: "2024-09-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "user-2",
    name: "Bruno Lima",
    email: "bruno@discente.uf.br",
    role: "user",
    matricula: "2021005678",
    tagId: "tag-1",
    createdAt: "2024-09-15T00:00:00Z",
    isActive: true,
  },
  {
    id: "user-3",
    name: "Maria Santos",
    email: "maria@discente.uf.br",
    role: "user",
    matricula: "2022001122",
    tagId: "tag-2",
    createdAt: "2024-10-01T00:00:00Z",
    isActive: true,
  },
  {
    id: "admin-1",
    name: "Prof. Eduardo (Laboratorista)",
    email: "eduardo@siape.uf.br",
    role: "admin",
    matricula: "SIAPE-9876",
    tagId: "tag-3",
    createdAt: "2024-01-10T00:00:00Z",
    isActive: true,
  },
  {
    id: "user-4",
    name: "Ana Costa",
    email: "ana@discente.uf.br",
    role: "user",
    matricula: "2023003344",
    tagId: "tag-1",
    createdAt: "2025-02-01T00:00:00Z",
    isActive: false,
  },
];
