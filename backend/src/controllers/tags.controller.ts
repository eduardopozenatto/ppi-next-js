import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendPaginated } from '../utils/response';
import { getParam } from '../utils/params';
import { createTagSchema, updateTagSchema } from '../schemas/tag.schema';

export const getTags = async (req: Request, res: Response) => {
  try {
    const page = Number(getParam(req.query.page)) || 1;
    const limit = Number(getParam(req.query.limit)) || 10;
    const name = getParam(req.query.name);

    const where = name ? { name: { contains: name, mode: 'insensitive' as const } } : {};

    const tags = await prisma.tag.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    const total = await prisma.tag.count({ where });

    // Format the response to match the frontend expectations
    const formattedTags = tags.map((tag) => ({
      ...tag,
      userCount: tag._count.users,
    }));

    return sendPaginated(res, formattedTags, total, page, limit);
  } catch (error) {
    console.error('[getTags]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar tags', errors: [String(error)] });
  }
};

export const getTagById = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const tag = await prisma.tag.findUnique({
      where: { id },
      include: {
        _count: {
          select: { users: true },
        },
      },
    });

    if (!tag) return res.status(404).json({ success: false, message: 'Tag não encontrada' });

    const formattedTag = { ...tag, userCount: tag._count.users };
    return res.json({ success: true, message: 'Tag encontrada', data: formattedTag });
  } catch (error) {
    console.error('[getTagById]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar tag', errors: [String(error)] });
  }
};

export const createTag = async (req: Request, res: Response) => {
  try {
    const validatedData = createTagSchema.parse(req.body);

    const existingTag = await prisma.tag.findUnique({
      where: { name: validatedData.name },
    });

    if (existingTag) {
      return res.status(409).json({ success: false, message: 'Já existe uma tag com este nome' });
    }

    const tag = await prisma.tag.create({
      data: {
        name: validatedData.name,
        color: validatedData.color,
        description: validatedData.description,
        permissions: validatedData.permissions as any,
      },
    });

    return res.status(201).json({ success: true, message: 'Tag criada com sucesso', data: tag });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[createTag]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao criar tag', errors: [String(error)] });
  }
};

export const updateTag = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const validatedData = updateTagSchema.parse(req.body);

    if (validatedData.name) {
      const existingTag = await prisma.tag.findFirst({
        where: {
          name: validatedData.name,
          id: { not: id },
        },
      });

      if (existingTag) {
        return res.status(409).json({ success: false, message: 'Já existe outra tag com este nome' });
      }
    }

    const tag = await prisma.tag.update({
      where: { id },
      data: {
        ...validatedData,
        permissions: validatedData.permissions ? (validatedData.permissions as any) : undefined,
      },
    });

    return res.json({ success: true, message: 'Tag atualizada com sucesso', data: tag });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Tag não encontrada' });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[updateTag]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao atualizar tag', errors: [String(error)] });
  }
};

export const deleteTag = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const tagInUse = await prisma.user.findFirst({
      where: { tagId: id },
    });

    if (tagInUse) {
      return res.status(409).json({ success: false, message: 'Não é possível excluir uma tag que está em uso por usuários' });
    }

    await prisma.tag.delete({
      where: { id },
    });

    return res.json({ success: true, message: 'Tag excluída com sucesso' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Tag não encontrada' });
    }
    console.error('[deleteTag]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao excluir tag', errors: [String(error)] });
  }
};
