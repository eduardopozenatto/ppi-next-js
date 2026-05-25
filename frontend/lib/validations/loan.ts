import { z } from "zod";

export const newLoanSchema = z.object({
  borrowerName: z.string().min(2, "Nome obrigatório"),
  borrowerEmail: z.string().email("E-mail inválido"),
  itemId: z.string().min(1, "Selecione um item"),
  quantity: z.number().int().min(1).max(99),
  dueDate: z.string()
    .min(1, "Data prevista obrigatória")
    .refine((val) => {
      const selected = new Date(val + "T00:00:00");
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return selected >= today;
    }, "A data de devolução não pode ser no passado")
    .refine((val) => {
      const selected = new Date(val + "T00:00:00");
      const maxDate = new Date();
      maxDate.setDate(maxDate.getDate() + 30);
      maxDate.setHours(23, 59, 59, 999);
      return selected <= maxDate;
    }, "O período de empréstimo não pode exceder 30 dias"),
  notes: z.string().optional(),
});

export type NewLoanFormValues = z.infer<typeof newLoanSchema>;
