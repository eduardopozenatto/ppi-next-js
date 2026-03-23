export type UserRole = "user" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  matricula?: string;
  tagId?: string;
  avatarUrl?: string;
  createdAt: string;
  isActive: boolean;
}
