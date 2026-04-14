import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { sendCreated, sendSuccess } from '../utils/response';
import { hashPassword, comparePassword } from '../utils/crypto';
import { signToken } from '../utils/jwt';
import { registerSchema, loginSchema } from '../schemas/auth.schema';
import { z } from 'zod';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      throw new AppError('Este e-mail já está em uso', 400);
    }

    const hashedPassword = await hashPassword(data.password);

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        matricula: data.matricula,
        // O ID da tag default ou aprovação da conta será lidado de acordo com o Admin na tela.
      },
    });

    // O Frontend nao aguarda Auto-Login caso venha do MockRegister.
    // Ele aguarda Null se der bom, ou uma string de erro limitante.
    sendCreated(res, { id: newUser.id }, 'Usuário criado com sucesso');
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

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user || !(await comparePassword(data.password, user.password))) {
      throw new AppError('E-mail ou senha incorretos', 401);
    }

    if (!user.isActive) {
      throw new AppError('Esta conta foi desativada', 403);
    }

    // Gerar JWT e assinalar ao HttpOnly Cookie
    const token = signToken(user.id);
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    sendSuccess(res, { id: user.id }, 'Login realizado com sucesso');
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

export async function logout(
  _req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  res.cookie('token', 'loggedout', {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 1000), // expira quase instantaneamente
  });
  sendSuccess(res, null, 'Logout realizado com sucesso');
}

export async function getMe(
  req: Request,
  res: Response,
  _next: NextFunction
): Promise<void> {
  // A tipagem vem injetada no req.user pelo *requireAuth*
  if (!req.user) {
    throw new AppError('Falha ao obter sessão do usuário', 401);
  }
  
  // Como o payload de User requerido pelo `frontend/contexts/AuthContext` é o obj abaixo, exportamos ele da mesma forma:
  sendSuccess(
    res,
    {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      matricula: req.user.matricula,
      tag: req.user.tag,
      userPermissions: req.user.userPermissions,
    },
    'Sessão ativa recuperada'
  );
}
