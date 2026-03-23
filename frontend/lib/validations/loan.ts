import { z } from "zod";

export const newLoanSchema = z.object({
  borrowerName: z.string().min(2, "Nome obrigatório"),
  borrowerEmail: z.string().email("E-mail inválido"),
  itemId: z.string().min(1, "Selecione um item"),
  quantity: z.number().int().min(1).max(99),
  dueDate: z.string().min(1, "Data prevista obrigatória"),
  notes: z.string().optional(),
});

export type NewLoanFormValues = z.infer<typeof newLoanSchema>;
