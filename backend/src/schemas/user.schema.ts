import { z } from 'zod';
import { UserRole } from '../generated/prisma/enums';
import { tagPermissionsSchema } from './tag.schema';

export const updateUserSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres').optional(),
  phone: z.string().optional(),
  avatarUrl: z.string().url('URL de avatar inválida').optional(),
  matricula: z.string().optional(),
  // Campos restritos a admin
  tagId: z.string().optional(),
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
