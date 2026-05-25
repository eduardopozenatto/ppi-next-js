import type { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/database';
import { AppError } from '../middlewares/errorHandler';
import { sendCreated, sendSuccess } from '../utils/response';
import { hashPassword, comparePassword } from '../utils/crypto';
import { signToken } from '../utils/jwt';
import {
  registerSchema,
  loginSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from '../schemas/auth.schema';
import { sendResetCodeEmail } from '../utils/email';
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

    // Buscar a tag padrão "Aluno" para atribuir a novos usuários
    const defaultTag = await prisma.tag.findFirst({
      where: { name: { equals: 'Aluno', mode: 'insensitive' } },
    });

    const newUser = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        matricula: data.matricula,
        tagId: defaultTag?.id, // Atribui a tag "Aluno" por padrão
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
      avatarUrl: req.user.avatarUrl,
      tag: req.user.tag,
      userPermissions: req.user.userPermissions,
    },
    'Sessão ativa recuperada'
  );
}

/* ─── Avatar Upload ────────────────────────────────── */

export async function uploadAvatarHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.file) {
      throw new AppError('Nenhum arquivo enviado', 400);
    }
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const avatarUrl = `uploads/avatars/${req.file.filename}`;

    await prisma.user.update({
      where: { id: req.user.id },
      data: { avatarUrl },
    });

    sendSuccess(res, { avatarUrl }, 'Foto de perfil atualizada');
  } catch (err) {
    next(err);
  }
}

/* ─── Change Password (logged-in user) ────────────── */

export async function changePassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const data = changePasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const isValid = await comparePassword(data.currentPassword, user.password);
    if (!isValid) {
      throw new AppError('Senha atual incorreta', 400);
    }

    const hashedNew = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: hashedNew },
    });

    sendSuccess(res, null, 'Senha alterada com sucesso');
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

/* ─── Forgot Password (public) ────────────────────── */

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = forgotPasswordSchema.parse(req.body);

    // Buscar user — se não encontrado, retorna sucesso mesmo assim (segurança)
    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (user) {
      // Invalidar códigos anteriores
      await prisma.passwordResetCode.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      });

      // Gerar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();

      // Criar registro
      await prisma.passwordResetCode.create({
        data: {
          code,
          userId: user.id,
          expiresAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutos
        },
      });

      // Enviar email
      try {
        await sendResetCodeEmail(user.email, code);
      } catch (emailErr) {
        console.error('[forgotPassword] Falha ao enviar email:', emailErr);
        // Log do código para debug em dev quando SMTP não está configurado
        console.log(`[forgotPassword] Código de reset para ${user.email}: ${code}`);
      }
    }

    sendSuccess(res, null, 'Se o email existir, um código foi enviado');
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

/* ─── Reset Password (public — with code) ─────────── */

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = resetPasswordSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      throw new AppError('Código inválido ou expirado', 400);
    }

    const resetCode = await prisma.passwordResetCode.findFirst({
      where: {
        code: data.code,
        userId: user.id,
        used: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!resetCode) {
      throw new AppError('Código inválido ou expirado', 400);
    }

    // Marcar como usado
    await prisma.passwordResetCode.update({
      where: { id: resetCode.id },
      data: { used: true },
    });

    // Atualizar senha
    const hashedNew = await hashPassword(data.newPassword);
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedNew },
    });

    sendSuccess(res, null, 'Senha redefinida com sucesso');
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
