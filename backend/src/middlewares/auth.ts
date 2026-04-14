import type { Request, Response, NextFunction } from 'express';
import { verifyToken } from '../utils/jwt';
import { prisma } from '../config/database';
import { AppError } from './errorHandler';

// Tipagem global para injetar o usuário no Request do Express
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        name: string;
        email: string;
        matricula: string | null;
        tag: {
          name: string;
          colorClass: string;
        } | null;
        userPermissions: Record<string, boolean>;
      };
    }
  }
}

/**
 * Middleware para validar o token JWT e popular req.user
 */
export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction
) {
  try {
    // 1. Obter o token dos cookies ou do Bearer
    let token: string | undefined = req.cookies?.token;

    if (!token && req.headers.authorization?.startsWith('Bearer ')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      throw new AppError('Você não está autenticado', 401);
    }

    // 2. Verificar a validade
    const decoded = verifyToken(token);

    // 3. Buscar o usuário com a Role/Tag e Overrides de Permissão
    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        tag: true,
        permissionOverrides: true,
      },
    });

    if (!currentUser || !currentUser.isActive) {
      throw new AppError(
        'O usuário ao qual este token pertence não existe ou está desativado',
        401
      );
    }

    // 4. Montar o dicionário final de permissões
    // Começa com as da tag se existir, e mescla com qualquer override de permissão que o usuário tiver.
    let resolvedPermissions: Record<string, boolean> = {};

    if (currentUser.tag) {
      const basePerms = currentUser.tag.permissions as Record<string, boolean>;
      resolvedPermissions = { ...basePerms };

      const overrideRecord = currentUser.permissionOverrides.find(
        (o) => o.tagId === currentUser.tagId
      );
      if (overrideRecord) {
        const overrides = overrideRecord.customOverrides as Record<
          string,
          boolean
        >;
        resolvedPermissions = { ...resolvedPermissions, ...overrides };
      }
    }

    // 5. Injetar req.user
    req.user = {
      id: currentUser.id,
      name: currentUser.name,
      email: currentUser.email,
      matricula: currentUser.matricula,
      tag: currentUser.tag
        ? {
            name: currentUser.tag.name,
            colorClass: currentUser.tag.color,
          }
        : null,
      userPermissions: resolvedPermissions,
    };

    next();
  } catch (err) {
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError('Token inválido ou expirado', 401));
    }
  }
}

/**
 * Factory para retornar um middleware que verifica se o usuário possui a permissão x.
 * Requer o "requireAuth" antes.
 */
export function requirePermission(permissionKey: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('Usuário não autenticado', 401));
    }

    if (req.user.userPermissions[permissionKey] !== true) {
      // Diferencie administradores totais - "gerenciar_roles" é a permissão máxima, se quiser liberar
      // Aqui seguiremos um checador restrito no booleano.
      return next(
        new AppError(`Acesso negado. Requer permissão: ${permissionKey}`, 403)
      );
    }

    next();
  };
}
