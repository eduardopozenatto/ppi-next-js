import { z } from 'zod';

export const createInventorySchema = z.object({
  name: z.string().min(2, 'Nome deve ter no mínimo 2 caracteres'),
  description: z.string().optional().default(''),
  isActive: z.boolean().optional().default(true),
  quantity: z.number().int().min(0, 'A quantidade não pode ser negativa'),
  categoryId: z.string().min(1, 'Categoria inválida').optional().nullable(),
  image: z.string().optional().nullable(),
});

export const updateInventorySchema = z.object({
  name: z.string().min(2).optional(),
  description: z.string().optional(),
  isActive: z.boolean().optional(),
  quantity: z.number().int().min(0).optional(),
  availableQuantity: z.number().int().min(0).optional(),
  loanedQuantity: z.number().int().min(0).optional(),
  categoryId: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
});

export const inventoryQuerySchema = z.object({
  search: z.string().optional(),
  category: z.string().optional(),
  page: z.union([z.string(), z.number()]).transform(Number).default(1),
  limit: z.union([z.string(), z.number()]).transform(Number).default(10),
});

export type CreateInventoryInput = z.infer<typeof createInventorySchema>;
export type UpdateInventoryInput = z.infer<typeof updateInventorySchema>;
export type InventoryQueryInput = z.infer<typeof inventoryQuerySchema>;
