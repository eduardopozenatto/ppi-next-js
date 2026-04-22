import { z } from 'zod';

export const tagPermissionsSchema = z.object({
  ver_itens: z.boolean(),
  pedir_emprestimos: z.boolean(),
  ver_notificacoes: z.boolean(),
  manipular_estoque: z.boolean(),
  gerar_relatorios: z.boolean(),
  aprovar_emprestimos: z.boolean(),
  gerenciar_itens: z.boolean(),
  gerenciar_usuarios: z.boolean(),
  gerenciar_roles: z.boolean(),
  gerenciar_categorias: z.boolean(),
  gerenciar_permissoes: z.boolean(),
}).strict();

export const createTagSchema = z.object({
  name: z.string().min(2, 'O nome da tag deve ter no mínimo 2 caracteres'),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Cor inválida (deve ser hexadecimal)'),
  description: z.string().min(5, 'A descrição deve ter no mínimo 5 caracteres'),
  permissions: tagPermissionsSchema,
});

export const updateTagSchema = createTagSchema.partial();

export type TagPermissionsInput = z.infer<typeof tagPermissionsSchema>;
export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
