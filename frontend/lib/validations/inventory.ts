import { z } from "zod";

export const newInventoryItemSchema = z.object({
  name: z.string().min(2, "Nome obrigatório"),
  category: z.string().min(1, "Categoria obrigatória"),
  description: z.string().optional(),
  totalQuantity: z.number().int().min(0),
  availableQuantity: z.number().int().min(0),
  image: z.string().optional(),
});

export type NewInventoryItemFormValues = z.infer<typeof newInventoryItemSchema>;
