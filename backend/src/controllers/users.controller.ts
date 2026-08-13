import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendPaginated } from '../utils/response';
import { getParam } from '../utils/params';
import { updateUserSchema, updatePermissionOverrideSchema, createUserSchema } from '../schemas/user.schema';
import { hashPassword } from '../utils/crypto';

export const getUsers = async (req: Request, res: Response) => {
  try {
    const page = Number(getParam(req.query.page)) || 1;
    const limit = Number(getParam(req.query.limit)) || 10;
    const name = getParam(req.query.name);
    const email = getParam(req.query.email);

    const where: any = {};
    if (name) where.name = { contains: name, mode: 'insensitive' };
    if (email) where.email = { contains: email, mode: 'insensitive' };

    const users = await prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        tag: true,
        permissionOverrides: true,
      },
    });

    const total = await prisma.user.count({ where });

    // Omit passwords from the response
    const sanitizedUsers = users.map(({ password, ...user }) => user);

    return sendPaginated(res, sanitizedUsers, total, page, limit);
  } catch (error) {
    console.error('[getUsers]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar usuários', errors: [String(error)] });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        tag: true,
        permissionOverrides: true,
      },
    });

    if (!user) return res.status(404).json({ success: false, message: 'Usuário não encontrado' });

    const { password, ...sanitizedUser } = user;
    return res.json({ success: true, message: 'Usuário encontrado', data: sanitizedUser });
  } catch (error) {
    console.error('[getUserById]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar usuário', errors: [String(error)] });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const validatedData = updateUserSchema.parse(req.body);

    // If the requesting user is not an admin, they cannot update admin-restricted fields
    if (req.user?.role !== 'admin') {
      delete validatedData.email;
      delete validatedData.tagId;
      delete validatedData.role;
      delete validatedData.isActive;
    }

    if (validatedData.email) {
      const normalizedEmail = validatedData.email.trim().toLowerCase();
      const existingEmail = await prisma.user.findFirst({
        where: {
          email: { equals: normalizedEmail, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (existingEmail) {
        return res.status(400).json({ success: false, message: 'Este e-mail já está em uso por outro usuário' });
      }
      validatedData.email = normalizedEmail;
    }

    if (validatedData.matricula) {
      const normalizedMatricula = validatedData.matricula.trim();
      const existingMatricula = await prisma.user.findFirst({
        where: {
          matricula: { equals: normalizedMatricula, mode: 'insensitive' },
          id: { not: id },
        },
      });
      if (existingMatricula) {
        return res.status(400).json({ success: false, message: 'Matrícula já está em uso por outro usuário' });
      }
      validatedData.matricula = normalizedMatricula;
    }

    const user = await prisma.user.update({
      where: { id },
      data: validatedData,
      include: { tag: true },
    });

    const { password, ...sanitizedUser } = user;
    return res.json({ success: true, message: 'Usuário atualizado com sucesso', data: sanitizedUser });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Este e-mail ou matrícula já está em uso por outro usuário' });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[updateUser]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao atualizar usuário', errors: [String(error)] });
  }
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const validatedData = createUserSchema.parse(req.body);
    const normalizedEmail = validatedData.email.trim().toLowerCase();
    const normalizedMatricula = validatedData.matricula ? validatedData.matricula.trim() : '';

    // 1. Check if email is in use
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: normalizedEmail, mode: 'insensitive' } },
    });
    if (existingEmail) {
      return res.status(400).json({ success: false, message: 'Este e-mail já está em uso por outro usuário' });
    }

    // 2. Check if matricula is in use
    if (normalizedMatricula) {
      const existingMatricula = await prisma.user.findFirst({
        where: { matricula: { equals: normalizedMatricula, mode: 'insensitive' } },
      });
      if (existingMatricula) {
        return res.status(400).json({ success: false, message: 'Matrícula já está em uso por outro usuário' });
      }
    }

    // 3. Encrypt password "1234"
    const hashedPassword = await hashPassword('1234');

    // 4. Create user
    const user = await prisma.user.create({
      data: {
        name: validatedData.name,
        email: normalizedEmail,
        matricula: normalizedMatricula || null,
        tagId: validatedData.tagId,
        role: validatedData.role || 'user',
        isActive: validatedData.isActive !== undefined ? validatedData.isActive : true,
        password: hashedPassword,
        mustChangePassword: true,
      },
      include: { tag: true },
    });

    const { password, ...sanitizedUser } = user;
    return res.status(201).json({ success: true, message: 'Usuário criado com sucesso', data: sanitizedUser });
  } catch (error: any) {
    if (error.code === 'P2002') {
      return res.status(400).json({ success: false, message: 'Este e-mail ou matrícula já está em uso por outro usuário' });
    }
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[createUser]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao criar usuário', errors: [String(error)] });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    // Impedir exclusão do próprio usuário
    if (req.user?.id === id) {
      return res.status(400).json({ success: false, message: 'Você não pode excluir sua própria conta' });
    }

    // Deletar em transação para garantir atomicidade
    await prisma.$transaction(async (tx) => {
      // 1. Restabelecer estoque de empréstimos pendentes ou ativos do usuário
      const activeOrPendingLoans = await tx.loan.findMany({
        where: {
          borrowerId: id,
          status: { in: ['pending', 'active', 'overdue'] },
        },
        include: { items: true },
      });

      for (const loan of activeOrPendingLoans) {
        if (loan.status === 'pending') {
          for (const item of loan.items) {
            await tx.inventoryItem.update({
              where: { id: item.inventoryItemId },
              data: { availableQuantity: { increment: item.quantity } },
            });
          }
        } else if (loan.status === 'active' || loan.status === 'overdue') {
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

      // 2. Buscar IDs de todos os empréstimos do usuário
      const allLoans = await tx.loan.findMany({
        where: {
          borrowerId: id,
        },
        select: { id: true },
      });

      const loanIds = allLoans.map((l) => l.id);

      // 3. Deletar LoanItems desses empréstimos (deleteMany não faz cascade)
      if (loanIds.length > 0) {
        await tx.loanItem.deleteMany({
          where: { loanId: { in: loanIds } },
        });

        // 4. Deletar os empréstimos
        await tx.loan.deleteMany({
          where: { id: { in: loanIds } },
        });
      }

      // 4. Hard delete do usuário — cascata em notifications, permissionOverrides, passwordResetCodes
      await tx.user.delete({
        where: { id },
      });
    });

    return res.json({ success: true, message: 'Usuário excluído permanentemente' });
  } catch (error: any) {
    if (error.code === 'P2025') {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
    }
    if (error.code === 'P2003') {
      return res.status(400).json({ success: false, message: 'Não é possível excluir: existem registros vinculados ao usuário. Verifique empréstimos e tente novamente.' });
    }
    console.error('[deleteUser]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao excluir usuário', errors: [String(error)] });
  }
};

export const updateUserPermissionOverride = async (req: Request, res: Response) => {
  try {
    const userId = getParam(req.params.id);
    const tagId = getParam(req.params.tagId);
    
    if (!userId || !tagId) return res.status(400).json({ success: false, message: 'User ID ou Tag ID não fornecido' });

    const validatedData = updatePermissionOverrideSchema.parse(req.body);

    const override = await prisma.userPermissionOverride.upsert({
      where: {
        userId_tagId: {
          userId,
          tagId,
        },
      },
      update: {
        customOverrides: validatedData.customOverrides as any,
      },
      create: {
        userId,
        tagId,
        customOverrides: validatedData.customOverrides as any,
      },
    });

    return res.json({ success: true, message: 'Override de permissões atualizado', data: override });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[updateUserPermissionOverride]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao atualizar override', errors: [String(error)] });
  }
};
