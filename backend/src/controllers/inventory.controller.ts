import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { sendPaginated, sendSuccess } from '../utils/response';
import {
  createInventorySchema,
  updateInventorySchema,
  inventoryQuerySchema,
} from '../schemas/inventory.schema';
import { z } from 'zod';

/**
 * Helper to safely extract a single string param from Express 5 params.
 * Express 5 params can be string | string[] | undefined.
 */
function getParam(value: string | string[] | undefined): string {
  if (Array.isArray(value)) return value[0];
  return value ?? '';
}

export async function listItems(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { search, category, page, limit } = inventoryQuerySchema.parse(
      req.query
    );

    const whereClause: any = {};

    if (search) {
      whereClause.name = { contains: search, mode: 'insensitive' };
    }

    if (category) {
      // O front pode mandar id ou nome. Filtramos por nome se não for um CUID/UUID.
      whereClause.category = {
        name: { equals: category, mode: 'insensitive' },
      };
    }

    const total = await prisma.inventoryItem.count({ where: whereClause });
    const items = await prisma.inventoryItem.findMany({
      where: whereClause,
      include: { category: true },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { name: 'asc' },
    });

    // Mapeamos para o formato esperado pelo frontend (LabInventoryListItem)
    const formattedItems = items.map((item) => ({
      id: item.id,
      name: item.name,
      isActive: item.isActive,
      quantity: item.quantity,
      availableQuantity: item.availableQuantity,
      loanedQuantity: item.loanedQuantity,
      image: item.image || '',
      category: item.category?.name || '',
      description: item.description,
    }));

    sendPaginated(res, formattedItems, total, page, limit);
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(
        new AppError(
          'Parâmetros de busca inválidos',
          400,
          err.flatten().fieldErrors as any
        )
      );
    } else {
      next(err);
    }
  }
}

export async function getItemById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req.params.id);
    const item = await prisma.inventoryItem.findUnique({
      where: { id },
      include: { category: true },
    });

    if (!item) {
      throw new AppError('Item não encontrado', 404);
    }

    const formattedItem = {
      id: item.id,
      name: item.name,
      isActive: item.isActive,
      quantity: item.quantity,
      availableQuantity: item.availableQuantity,
      loanedQuantity: item.loanedQuantity,
      image: item.image || '',
      category: item.category?.name || '',
      description: item.description,
    };

    sendSuccess(res, formattedItem, 'Item recuperado');
  } catch (err) {
    next(err);
  }
}

export async function createItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = createInventorySchema.parse(req.body);

    const newItem = await prisma.inventoryItem.create({
      data: {
        name: data.name,
        description: data.description,
        isActive: data.isActive,
        quantity: data.quantity,
        availableQuantity: data.quantity, // Na criação, 100% está available
        image: data.image ?? undefined,
        categoryId: data.categoryId ?? undefined,
      },
      include: { category: true },
    });

    sendSuccess(res, newItem, 'Item criado com sucesso', 201);
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(
        new AppError('Dados inválidos', 400, err.flatten().fieldErrors as any)
      );
    } else {
      next(err);
    }
  }
}

export async function updateItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req.params.id);
    const data = updateInventorySchema.parse(req.body);

    const itemExists = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!itemExists) {
      throw new AppError('Item não encontrado', 404);
    }

    // Convert null to undefined for Prisma compatibility
    const updateData: any = { ...data };
    if (updateData.categoryId === null) {
      updateData.categoryId = undefined;
    }
    if (updateData.image === null) {
      updateData.image = undefined;
    }

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: updateData,
      include: { category: true },
    });

    sendSuccess(res, updatedItem, 'Item atualizado com sucesso');
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(
        new AppError('Dados inválidos', 400, err.flatten().fieldErrors as any)
      );
    } else {
      next(err);
    }
  }
}

export async function deleteItem(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = getParam(req.params.id);

    // Apenas desativa (Soft Delete logic para manter o histórico de Loans)
    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: { isActive: false },
    });

    sendSuccess(res, updatedItem, 'Item desativado com sucesso');
  } catch (err) {
    next(err);
  }
}

export async function uploadImage(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new AppError('Nenhum arquivo enviado', 400);
    }
    const id = getParam(req.params.id);
    // req.file.filename é mantido pelo multer
    const imagePath = `uploads/${req.file.filename}`;

    const updatedItem = await prisma.inventoryItem.update({
      where: { id },
      data: { image: imagePath },
    });

    sendSuccess(res, updatedItem, 'Imagem atualizada com sucesso');
  } catch (err) {
    next(err);
  }
}
