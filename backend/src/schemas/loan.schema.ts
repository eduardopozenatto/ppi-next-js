import { z } from 'zod';
import { LoanStatus } from '../generated/prisma/enums';

export const createLoanSchema = z.object({
  items: z
    .array(
      z.object({
        inventoryItemId: z.string(),
        quantity: z.number().int().min(1, 'Quantidade deve ser no mínimo 1'),
      })
    )
    .min(1, 'Você deve solicitar ao menos um item'),
  dueDate: z.string().datetime({ message: 'Data de devolução inválida' }),
  notes: z.string().optional(),
});

export const updateLoanStatusSchema = z.object({
  status: z.nativeEnum(LoanStatus, { message: 'Status inválido' }),
  labObservation: z.string().optional(),
});

export const loanQuerySchema = z.object({
  status: z.nativeEnum(LoanStatus).optional(),
  page: z.union([z.string(), z.number()]).transform(Number).default(1),
  limit: z.union([z.string(), z.number()]).transform(Number).default(10),
});

export type CreateLoanInput = z.infer<typeof createLoanSchema>;
export type UpdateLoanStatusInput = z.infer<typeof updateLoanStatusSchema>;
export type LoanQueryInput = z.infer<typeof loanQuerySchema>;
