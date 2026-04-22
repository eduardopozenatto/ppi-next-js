import { Request, Response } from 'express';
import { prisma } from '../config/database';
import { sendPaginated } from '../utils/response';
import { getParam } from '../utils/params';
import { updateNotificationSchema } from '../schemas/notification.schema';

export const getNotifications = async (req: Request, res: Response) => {
  try {
    const page = Number(getParam(req.query.page)) || 1;
    const limit = Number(getParam(req.query.limit)) || 10;
    
    // Auth middleware ensures req.user exists
    const userId = req.user!.id;

    const where = { userId };

    const notifications = await prisma.notification.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    });

    const total = await prisma.notification.count({ where });

    return sendPaginated(res, notifications, total, page, limit);
  } catch (error) {
    console.error('[getNotifications]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao buscar notificações', errors: [String(error)] });
  }
};

export const markAsRead = async (req: Request, res: Response) => {
  try {
    const id = getParam(req.params.id);
    if (!id) return res.status(400).json({ success: false, message: 'ID não fornecido' });

    const userId = req.user!.id;

    const validatedData = updateNotificationSchema.parse(req.body);

    const existingNotification = await prisma.notification.findFirst({
      where: { id, userId }, // ensures the notification belongs to the user
    });

    if (!existingNotification) {
      return res.status(404).json({ success: false, message: 'Notificação não encontrada' });
    }

    const notification = await prisma.notification.update({
      where: { id },
      data: { read: validatedData.read },
    });

    return res.json({ success: true, message: 'Notificação atualizada com sucesso', data: notification });
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ success: false, message: 'Dados inválidos', errors: error.errors });
    }
    console.error('[markAsRead]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao atualizar notificação', errors: [String(error)] });
  }
};
