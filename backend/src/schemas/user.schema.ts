import { z } from 'zod';
import { UserRole } from '../generated/prisma/enums';
import { tagPermissionsSchema } from './tag.schema';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres').optional(),
  email: z.string().email('E-mail inválido').optional(),
  phone: z.string().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
  matricula: z.string().nullable().optional(),
  // Campos restritos a admin / gerenciar_usuarios
  tagId: z.string().nullable().optional(),
  role: z.nativeEnum(UserRole, { message: 'Role inválido' }).optional(),
  isActive: z.boolean().optional(),
});

// Para o override de permissões
export const updatePermissionOverrideSchema = z.object({
  customOverrides: tagPermissionsSchema.partial(),
});

export const createUserSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  matricula: z.string().min(1, 'Matrícula é obrigatória'),
  tagId: z.string().min(1, 'Perfil/Tag é obrigatória'),
  role: z.nativeEnum(UserRole, { message: 'Role inválido' }).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateUserInput = z.infer<typeof updateUserSchema>;
export type UpdatePermissionOverrideInput = z.infer<typeof updatePermissionOverrideSchema>;
export type CreateUserInput = z.infer<typeof createUserSchema>;
