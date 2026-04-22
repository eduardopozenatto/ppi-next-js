import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendPaginated } from '../utils/response';
import { getParam } from '../utils/params';
import { createCategorySchema, updateCategorySchema } from '../schemas/category.schema';

export const getCategories = async (req: Request, res: Response) => {
  try {
    const page = Number(getParam(req.query.page)) || 1;
    const limit = Number(getParam(req.query.limit)) || 10;
    const name = getParam(req.query.name);

    const where = name ? { name: { contains: name, mode: 'insensitive' as const } } : {};

    const categories = await prisma.category.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    const total = await prisma.category.count({ where });

    // Format the response to match the frontend expectations
    const formattedCategories = categories.map((cat) => ({
      ...cat,
      linkedItemsCount: cat._count.items,
    }));

    return sendPaginated(res, formattedCategories, total, page, limit);
  } catch (error) {
    console.error('[getCategories]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar categorias', errors: [String(error)] });
  }
};

export const getCategoryById = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const category = await prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { items: true },
        },
      },
    });

    if (!category) return res.status(404).json({ success: false, message: 'Categoria não encontrada' });

    const formattedCategory = { ...category, linkedItemsCount: category._count.items };
    return res.json({ success: true, message: 'Categoria encontrada', data: formattedCategory });
  } catch (error) {
    console.error('[getCategoryById]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar categoria', errors: [String(error)] });
  }
};

export const createCategory = async (req: Request, res: Response) => {
  try {
    const validatedData = createCategorySchema.parse(req.body);

    const existingCategory = await prisma.category.findUnique({
      where: { name: validatedData.name },
    });

    if (existingCategory) {
      return res.status(409).json({ success: false, message: 'Já existe uma categoria com este nome' });
    }

    const category = await prisma.category.create({
      data: validatedData,
    });

    return res.status(201).json({ success: true, message: 'Categoria criada com sucesso', data: category });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[createCategory]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao criar categoria', errors: [String(error)] });
  }
};

export const updateCategory = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const validatedData = updateCategorySchema.parse(req.body);

    if (validatedData.name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      });

      if (existingCategory) {
        return res.status(409).json({ success: false, message: 'Já existe outra categoria com este nome' });
      }
    }

    const category = await prisma.category.update({
      where: { id },
      data: validatedData,
    });

    return res.json({ success: true, message: 'Categoria atualizada com sucesso', data: category });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[updateCategory]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao atualizar categoria', errors: [String(error)] });
  }
};

export const deleteCategory = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const categoryInUse = await prisma.inventoryItem.findFirst({
      where: { categoryId: id },
    });

    if (categoryInUse) {
      return res.status(409).json({ success: false, message: 'Não é possível excluir uma categoria que está em uso por itens de estoque' });
    }

    await prisma.category.delete({
      where: { id },
    });

    return res.json({ success: true, message: 'Categoria excluída com sucesso' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Categoria não encontrada' });
    }
    console.error('[deleteCategory]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao excluir categoria', errors: [String(error)] });
  }
};
