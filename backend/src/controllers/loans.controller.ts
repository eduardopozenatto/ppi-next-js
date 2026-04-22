import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { sendPaginated, sendSuccess, sendCreated } from '../utils/response';
import {
  createLoanSchema,
  updateLoanStatusSchema,
  loanQuerySchema,
} from '../schemas/loan.schema';
import { z } from 'zod';
import { LoanStatus } from '../generated/prisma/enums';

/**
 * Helper to safely extract a single string param from Express 5 params.
 */
function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? '';
}

export async function listLoans(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { status, page, limit } = loanQuerySchema.parse(req.query);

    const whereClause: any = {};

    // Se o usuário não tem permissão para gerenciar empréstimos de todos, ele só vê os dele.
    if (
      !req.user?.userPermissions.aprovar_emprestimos &&
      !req.user?.userPermissions.gerenciar_itens
    ) {
      whereClause.borrowerId = req.user?.id;
    }

    if (status) {
      whereClause.status = status;
    }

    const total = await prisma.loan.count({ where: whereClause });
    const loans = await prisma.loan.findMany({
      where: whereClause,
      include: {
        borrower: {
          select: { name: true, email: true },
        },
        items: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { loanDate: 'desc' },
    });

    // Formatar de acordo com Loan no Frontend (O frontend espera arrays de `items`, `borrowerName` string root).
    const formattedLoans = loans.map((l) => ({
      id: l.id,
      borrowerId: l.borrowerId,
      borrowerName: l.borrower.name,
      borrowerEmail: l.borrower.email,
      items: l.items.map((i) => ({
        inventoryItemId: i.inventoryItemId,
        inventoryItemName: i.inventoryItemName,
        quantity: i.quantity,
      })),
      status: l.status,
      loanDate: l.loanDate.toISOString(),
      dueDate: l.dueDate.toISOString(),
      returnedDate: l.returnedDate?.toISOString(),
      notes: l.notes,
      labObservation: l.labObservation,
      returnedLate: l.returnedLate,
      createdAt: l.createdAt.toISOString(),
      updatedAt: l.updatedAt.toISOString(),
    }));

    sendPaginated(res, formattedLoans, total, page, limit);
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(
        new AppError('Parâmetros inválidos', 400, err.flatten().fieldErrors as any)
      );
    } else {
      next(err);
    }
  }
}

export async function createLoan(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = createLoanSchema.parse(req.body);

    if (!req.user?.id) {
      throw new AppError('Usuário não autenticado', 401);
    }

    // Cria a transação pois os dados devem ser decrementados da availableQuantity de cada Item
    const result = await prisma.$transaction(async (tx) => {
      // Confirma e captura todos os items solicitados
      const itensComDetalhes = [];

      for (const loanReq of data.items) {
        const itemDb = await tx.inventoryItem.findUnique({
          where: { id: loanReq.inventoryItemId },
        });

        if (!itemDb || !itemDb.isActive) {
          throw new AppError(
            `Item ${loanReq.inventoryItemId} não encontrado ou está desativado`,
            400
          );
        }

        if (itemDb.availableQuantity < loanReq.quantity) {
          throw new AppError(
            `Quantidade solicitada (${loanReq.quantity}) do item '${itemDb.name}' é maior que a disponível (${itemDb.availableQuantity})`,
            400
          );
        }

        itensComDetalhes.push({
          id: itemDb.id,
          name: itemDb.name,
          requestedQty: loanReq.quantity,
        });

        // Deduz da available Quantity (como uma Reserva)
        await tx.inventoryItem.update({
          where: { id: itemDb.id },
          data: {
            availableQuantity: { decrement: loanReq.quantity },
          },
        });
      }

      // Se tudo ocorreu bem, cria e atrela
      const newLoan = await tx.loan.create({
        data: {
          borrowerId: req.user!.id,
          status: LoanStatus.pending,
          loanDate: new Date(),
          dueDate: new Date(data.dueDate),
          notes: data.notes,
          items: {
            create: itensComDetalhes.map((i) => ({
              inventoryItemId: i.id,
              inventoryItemName: i.name,
              quantity: i.requestedQty,
            })),
          },
        },
      });

      return newLoan;
    });

    sendCreated(res, result, 'Pedido de empréstimo realizado');
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(
        new AppError('Dados de entrada inválidos', 400, err.flatten().fieldErrors as any)
      );
    } else {
      next(err);
    }
  }
}

export async function updateLoanStatus(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req.params.id);
    const { status, labObservation } = updateLoanStatusSchema.parse(req.body);

    await prisma.$transaction(async (tx) => {
      const loan = await tx.loan.findUnique({
        where: { id },
        include: { items: true },
      });

      if (!loan) throw new AppError('Empréstimo não encontrado', 404);

      if (loan.status === status) {
        throw new AppError('O empréstimo já está neste estado', 400);
      }

      const updatePayload: any = { status, labObservation };

      // Regras de negócio de estoque:
      if (loan.status === LoanStatus.pending) {
        // Se pending -> active: aumenta o loanedQuantity
        if (status === LoanStatus.active) {
          for (const item of loan.items) {
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: { loanedQuantity: { increment: item.quantity } },
            });
          }
        }
        // Se pending -> rejected/cancelled: readiciona a availableQuantity retida (desmarca reserva)
        else if (status === LoanStatus.cancelled || status === LoanStatus.returned) {
          for (const item of loan.items) {
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: { availableQuantity: { increment: item.quantity } },
            });
          }
        }
      } else if (loan.status === LoanStatus.active || loan.status === LoanStatus.overdue) {
        // Se active -> returned: aumenta available, reduz loaned
        if (status === LoanStatus.returned) {
          for (const item of loan.items) {
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: {
                availableQuantity: { increment: item.quantity },
                loanedQuantity: { decrement: item.quantity },
              },
            });
          }
          updatePayload.returnedDate = new Date();
          // Calcula atraso
          if (loan.dueDate < new Date()) {
            updatePayload.returnedLate = true;
          }
        }
        // Se active -> cancelled: como não houve retirada no meio do caminho ou desistiu
        else if (status === LoanStatus.cancelled) {
          for (const item of loan.items) {
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: {
                availableQuantity: { increment: item.quantity },
                loanedQuantity: { decrement: item.quantity },
              },
            });
          }
        }
      }

      const updatedLoan = await tx.loan.update({
        where: { id },
        data: updatePayload,
      });

      // Fase 8: Notificações
      if (status === LoanStatus.active) {
        await tx.notification.create({
          data: {
            title: 'Empréstimo Aprovado',
            body: `Seu pedido de empréstimo (ID: ${updatedLoan.id.slice(0, 8)}) foi aprovado.`,
            type: 'approval',
            userId: updatedLoan.borrowerId,
          },
        });
      } else if (status === LoanStatus.cancelled || status === LoanStatus.returned) {
        // Here LoanStatus.cancelled from pending means rejected
        if (loan.status === LoanStatus.pending && status === LoanStatus.cancelled) {
           await tx.notification.create({
            data: {
              title: 'Empréstimo Rejeitado',
              body: `Seu pedido de empréstimo (ID: ${updatedLoan.id.slice(0, 8)}) foi rejeitado. Observação: ${labObservation || 'Nenhuma'}`,
              type: 'rejection',
              userId: updatedLoan.borrowerId,
            },
          });
        }
      }
    });

    sendSuccess(res, null, 'Status do empréstimo atualizado');
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(
        new AppError('Status inválido', 400, err.flatten().fieldErrors as any)
      );
    } else {
      next(err);
    }
  }
}
