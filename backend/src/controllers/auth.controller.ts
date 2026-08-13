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
  updateProfileSchema,
  requestEmailChangeSchema,
  confirmEmailChangeSchema,
  requestPhoneChangeSchema,
  confirmPhoneChangeSchema,
} from '../schemas/auth.schema';
import { sendResetCodeEmail } from '../utils/email';
import { z } from 'zod';
import { env } from '../config/env';

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

    if (data.matricula) {
      const existingMatricula = await prisma.user.findUnique({
        where: { matricula: data.matricula },
      });
      if (existingMatricula) {
        throw new AppError('Matrícula já está em uso', 400);
      }
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

interface InstitutionalAuthResult {
  authenticated: boolean;
  name?: string;
  email?: string;
}

async function authenticateInstitutional(
  userStr: string,
  passStr: string,
  tipoStr: 'L' | 'S'
): Promise<InstitutionalAuthResult> {
  try {
    if (!userStr || !userStr.trim() || !passStr || !passStr.trim()) {
      return { authenticated: false };
    }

    const params = new URLSearchParams();
    params.append('user', userStr.trim());
    params.append('pass', passStr.trim());
    params.append('tipo', tipoStr);

    const response = await fetch('https://www3.fw.iffarroupilha.edu.br/auth/index.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      body: params.toString(),
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      console.warn('[authenticateInstitutional] HTTP error:', response.status);
      return { authenticated: false };
    }

    const responseText = await response.text();

    // Tentar interpretar resposta como JSON
    try {
      const json = JSON.parse(responseText);

      if (json.status !== undefined) {
        const statusLower = String(json.status).toLowerCase();
        if (
          statusLower === 'fail' ||
          statusLower === 'error' ||
          statusLower === 'false' ||
          statusLower === '0'
        ) {
          return { authenticated: false };
        }
        if (
          statusLower === 'success' ||
          statusLower === 'ok' ||
          statusLower === 'true' ||
          statusLower === '1'
        ) {
          return {
            authenticated: true,
            name: json.name || json.nome,
            email: json.email,
          };
        }
      }

      if (json.success === false) {
        return { authenticated: false };
      }
      if (json.success === true) {
        return {
          authenticated: true,
          name: json.name || json.nome,
          email: json.email,
        };
      }
    } catch {
      // Se não for JSON, aplica verificação estrita por substring no texto
    }

    const lower = responseText.toLowerCase();
    const isFailure =
      lower.includes('fail') ||
      lower.includes('error') ||
      lower.includes('erro') ||
      lower.includes('inválid') ||
      lower.includes('invalid') ||
      lower.includes('incorret') ||
      lower.includes('falha');

    return { authenticated: !isFailure && responseText.trim().length > 0 };
  } catch (error) {
    console.error('[authenticateInstitutional] Connection error:', error);
    return { authenticated: false };
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const data = loginSchema.parse(req.body);
    const userIdentifier = data.user || data.email || '';
    const passwordInput = data.pass || data.password || '';
    const tipo = data.tipo || 'local';

    let user;

    if (tipo === 'L' || tipo === 'S') {
      const authResult = await authenticateInstitutional(
        userIdentifier,
        passwordInput,
        tipo
      );

      if (!authResult.authenticated) {
        throw new AppError('CPF/Matrícula ou senha incorretos no portal institucional', 401);
      }

      const generatedEmail = authResult.email || (userIdentifier.includes('@')
        ? userIdentifier
        : `${userIdentifier}@iffarroupilha.edu.br`);

      // Se autenticado com sucesso no portal institucional, busca ou auto-provisiona no PostgreSQL local
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { matricula: userIdentifier },
            { email: userIdentifier },
            { email: generatedEmail },
          ],
        },
      });

      if (!user) {
        const defaultTag = await prisma.tag.findFirst({
          where: { name: { equals: 'Aluno', mode: 'insensitive' } },
        });

        const randomPassword = await hashPassword(
          Math.random().toString(36).slice(-8) + Date.now().toString()
        );

        try {
          user = await prisma.user.create({
            data: {
              name: authResult.name || `Usuário ${userIdentifier}`,
              email: generatedEmail,
              matricula: userIdentifier,
              password: randomPassword,
              role: 'user',
              tagId: defaultTag?.id,
              isActive: true,
              mustChangePassword: false,
            },
          });
        } catch (createErr) {
          console.warn('[login] Auto-provisioning fallback triggered:', createErr);
          user = await prisma.user.findFirst({
            where: {
              OR: [
                { matricula: userIdentifier },
                { email: generatedEmail },
              ],
            },
          });
          if (!user) {
            throw new AppError('Não foi possível finalizar o auto-cadastro da sua conta no banco de dados local.', 500);
          }
        }
      }
    } else {
      // Login local tradicional (Conta Local / Admin)
      const sanitizedIdentifier = userIdentifier.trim();
      user = await prisma.user.findFirst({
        where: {
          OR: [
            { email: { equals: sanitizedIdentifier, mode: 'insensitive' } },
            { matricula: { equals: sanitizedIdentifier, mode: 'insensitive' } },
          ],
        },
      });

      if (!user || !(await comparePassword(passwordInput, user.password))) {
        throw new AppError('E-mail/Matrícula ou senha incorretos', 401);
      }
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
      phone: req.user.phone,
      matricula: req.user.matricula,
      avatarUrl: req.user.avatarUrl,
      tag: req.user.tag,
      userPermissions: req.user.userPermissions,
      mustChangePassword: req.user.mustChangePassword,
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
      data: {
        password: hashedNew,
        mustChangePassword: false,
      },
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
    console.log('[DEBUG] forgotPassword user lookup:', data.email, user ? user.id : 'NOT_FOUND');

    let devCode: string | undefined;

    if (user) {
      // Invalidar códigos anteriores
      await prisma.passwordResetCode.updateMany({
        where: { userId: user.id, used: false },
        data: { used: true },
      });

      // Gerar código de 6 dígitos
      const code = Math.floor(100000 + Math.random() * 900000).toString();
      devCode = code;

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

    // Se não houver SMTP configurado ou não estiver em produção, mas o SMTP não estiver ativo,
    // consideramos como ambiente de teste/local para retornar o devCode no toast.
    // Se o desenvolvedor configurar SMTP_USER e SMTP_PASS, ele quer testar o fluxo real de email,
    // então isTestEnv será false para ocultar o código do response e forçar o envio e recebimento real.
    const isTestEnv = env.NODE_ENV !== 'production' && (!env.SMTP_PASS || !env.SMTP_USER);

    sendSuccess(
      res,
      isTestEnv && devCode ? { devCode } : null,
      'Se o email existir, um código foi enviado'
    );
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
      data: {
        password: hashedNew,
        mustChangePassword: false,
      },
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

/* ─── Profile & Contact Verification Handlers ───────── */

export async function updateProfile(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const data = updateProfileSchema.parse(req.body);

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(data.name ? { name: data.name } : {}),
        ...(data.phone !== undefined ? { phone: data.phone } : {}),
      },
    });

    sendSuccess(
      res,
      {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
      },
      'Perfil atualizado com sucesso'
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(new AppError('Dados inválidos', 400, err.flatten().fieldErrors as any));
    } else {
      next(err);
    }
  }
}

export async function requestEmailChange(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const data = requestEmailChangeSchema.parse(req.body);

    const existing = await prisma.user.findUnique({
      where: { email: data.newEmail },
    });

    if (existing && existing.id !== req.user.id) {
      throw new AppError('Este e-mail já está em uso por outra conta', 400);
    }

    await prisma.passwordResetCode.updateMany({
      where: { userId: req.user.id, used: false },
      data: { used: true },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.passwordResetCode.create({
      data: {
        code,
        userId: req.user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    try {
      await sendResetCodeEmail(data.newEmail, code);
    } catch (emailErr) {
      console.log(`[requestEmailChange] Código para ${data.newEmail}: ${code}`);
    }

    const isTestEnv = env.NODE_ENV !== 'production' && (!env.SMTP_PASS || !env.SMTP_USER);

    sendSuccess(
      res,
      isTestEnv ? { devCode: code } : null,
      'Código de verificação enviado para o novo e-mail'
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(new AppError('Dados inválidos', 400, err.flatten().fieldErrors as any));
    } else {
      next(err);
    }
  }
}

export async function confirmEmailChange(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const data = confirmEmailChangeSchema.parse(req.body);

    const resetCode = await prisma.passwordResetCode.findFirst({
      where: {
        code: data.code,
        userId: req.user.id,
        used: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!resetCode) {
      throw new AppError('Código inválido ou expirado', 400);
    }

    await prisma.passwordResetCode.update({
      where: { id: resetCode.id },
      data: { used: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { email: data.newEmail },
    });

    sendSuccess(
      res,
      { email: updatedUser.email },
      'E-mail alterado com sucesso'
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(new AppError('Dados inválidos', 400, err.flatten().fieldErrors as any));
    } else {
      next(err);
    }
  }
}

export async function requestPhoneChange(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const data = requestPhoneChangeSchema.parse(req.body);

    await prisma.passwordResetCode.updateMany({
      where: { userId: req.user.id, used: false },
      data: { used: true },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.passwordResetCode.create({
      data: {
        code,
        userId: req.user.id,
        expiresAt: new Date(Date.now() + 15 * 60 * 1000),
      },
    });

    console.log(`[requestPhoneChange] Código SMS enviado para ${data.newPhone}: ${code}`);

    sendSuccess(
      res,
      { devCode: code },
      'Código de verificação enviado via SMS para o novo número'
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(new AppError('Dados inválidos', 400, err.flatten().fieldErrors as any));
    } else {
      next(err);
    }
  }
}

export async function confirmPhoneChange(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (!req.user) {
      throw new AppError('Usuário não autenticado', 401);
    }

    const data = confirmPhoneChangeSchema.parse(req.body);

    const resetCode = await prisma.passwordResetCode.findFirst({
      where: {
        code: data.code,
        userId: req.user.id,
        used: false,
        expiresAt: { gte: new Date() },
      },
    });

    if (!resetCode) {
      throw new AppError('Código inválido ou expirado', 400);
    }

    await prisma.passwordResetCode.update({
      where: { id: resetCode.id },
      data: { used: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: req.user.id },
      data: { phone: data.newPhone },
    });

    sendSuccess(
      res,
      { phone: updatedUser.phone },
      'Telefone alterado e verificado com sucesso'
    );
  } catch (err) {
    if (err instanceof z.ZodError) {
      next(new AppError('Dados inválidos', 400, err.flatten().fieldErrors as any));
    } else {
      next(err);
    }
  }
}
