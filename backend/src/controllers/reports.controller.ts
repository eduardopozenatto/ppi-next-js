import { Request, Response } from 'express';
import { prisma } from '../config/database';

import { getParam } from '../utils/params';

export const getInventoryReport = async (_req: Request, res: Response) => {
  try {
    // 1. Total items and available quantity
    const totalItemsCount = await prisma.inventoryItem.count();
    const sumAgg = await prisma.inventoryItem.aggregate({
      _sum: {
        availableQuantity: true,
      },
    });
    const availableQuantity = sumAgg._sum.availableQuantity || 0;

    // 2. Active users count
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: { isActive: true },
    });

    // 3. Items by category
    const itemsByCategoryRaw = await prisma.inventoryItem.groupBy({
      by: ['categoryId'],
      _sum: {
        quantity: true,
        availableQuantity: true,
      },
      _count: {
        _all: true,
      },
    });

    // Get category names to format the result nicely
    const categories = await prisma.category.findMany({
      where: { id: { in: itemsByCategoryRaw.map((i) => i.categoryId) } },
    });
    
    const itemsByCategory = itemsByCategoryRaw.map((group) => {
      const category = categories.find((c) => c.id === group.categoryId);
      return {
        categoryName: category?.name || 'Unknown',
        totalItems: group._count._all,
        totalQuantity: group._sum.quantity || 0,
        availableQuantity: group._sum.availableQuantity || 0,
      };
    });

    // 4. Most borrowed items
    const mostBorrowedRaw = await prisma.loanItem.groupBy({
      by: ['inventoryItemId'],
      _sum: { quantity: true },
      orderBy: { _sum: { quantity: 'desc' } },
      take: 5,
    });

    const inventoryItems = await prisma.inventoryItem.findMany({
      where: { id: { in: mostBorrowedRaw.map((i) => i.inventoryItemId) } },
    });

    const mostBorrowed = mostBorrowedRaw.map((group) => {
      const item = inventoryItems.find((i) => i.id === group.inventoryItemId);
      return {
        itemName: item?.name || 'Unknown',
        borrowedQuantity: group._sum.quantity || 0,
      };
    });

    return res.json({
      success: true,
      message: 'Relatório de inventário gerado',
      data: {
        summary: {
          totalItems: totalItemsCount,
          availableQuantity,
          totalUsers,
          activeUsers,
        },
        itemsByCategory,
        mostBorrowed,
      }
    });
  } catch (error) {
    console.error('[getInventoryReport]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao gerar relatório', errors: [String(error)] });
  }
};

export const getLoansReport = async (req: Request, res: Response) => {
  try {
    const period = getParam(req.query.period) || 'all'; // 7, 30, 90, all

    let dateFilter = {};
    if (period !== 'all') {
      const days = parseInt(period, 10);
      if (!isNaN(days)) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        dateFilter = { loanDate: { gte: date } };
      }
    }

    // Status counts
    const loansByStatus = await prisma.loan.groupBy({
      by: ['status'],
      where: dateFilter,
      _count: { _all: true },
    });

    let totalLoans = 0;
    let activeLoans = 0;
    let overdueLoans = 0;
    let returnedLoans = 0;
    let pendingLoans = 0;

    loansByStatus.forEach((group) => {
      totalLoans += group._count._all;
      if (group.status === 'active') activeLoans = group._count._all;
      if (group.status === 'overdue') overdueLoans = group._count._all;
      if (group.status === 'returned') returnedLoans = group._count._all;
      if (group.status === 'pending') pendingLoans = group._count._all;
    });

    return res.json({
      success: true,
      message: 'Relatório de empréstimos gerado',
      data: {
        summary: {
          totalLoans,
          activeLoans,
          overdueLoans,
          returnedLoans,
          pendingLoans,
        },
      }
    });
  } catch (error) {
    console.error('[getLoansReport]', error);
    return res.status(500).json({ success: false, message: 'Erro interno ao gerar relatório', errors: [String(error)] });
  }
};
