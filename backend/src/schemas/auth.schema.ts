import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres'),
  email: z.string().email('E-mail inválido'),
  password: z.string().min(6, 'A senha deve ter no mínimo 6 caracteres'),
  matricula: z.string().optional(),
});

export const loginSchema = z.object({
  user: z.string().optional(),
  pass: z.string().optional(),
  tipo: z.enum(['L', 'S', 'local']).optional(),
  email: z.string().optional(),
  password: z.string().optional(),
}).refine((data) => {
  return Boolean((data.user && data.pass) || (data.email && data.password));
}, {
  message: 'Informe o usuário/CPF e senha para autenticação',
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual é obrigatória'),
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
});

export const resetPasswordSchema = z.object({
  email: z.string().email('E-mail inválido'),
  code: z.string().length(6, 'Código deve ter 6 dígitos'),
  newPassword: z.string().min(6, 'Nova senha deve ter no mínimo 6 caracteres'),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter no mínimo 2 caracteres').optional(),
  phone: z.string().optional(),
});

export const requestEmailChangeSchema = z.object({
  newEmail: z.string().email('E-mail inválido'),
});

export const confirmEmailChangeSchema = z.object({
  newEmail: z.string().email('E-mail inválido'),
  code: z.string().length(6, 'O código deve ter 6 dígitos'),
});

export const requestPhoneChangeSchema = z.object({
  newPhone: z.string().min(8, 'Número de telefone inválido'),
});

export const confirmPhoneChangeSchema = z.object({
  newPhone: z.string().min(8, 'Número de telefone inválido'),
  code: z.string().length(6, 'O código deve ter 6 dígitos'),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type RequestEmailChangeInput = z.infer<typeof requestEmailChangeSchema>;
export type ConfirmEmailChangeInput = z.infer<typeof confirmEmailChangeSchema>;
export type RequestPhoneChangeInput = z.infer<typeof requestPhoneChangeSchema>;
export type ConfirmPhoneChangeInput = z.infer<typeof confirmPhoneChangeSchema>;

