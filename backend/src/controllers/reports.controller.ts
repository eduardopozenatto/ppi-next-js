import { Request, Response } from 'express';
import { prisma } from '../config/database';
import ExcelJS from 'exceljs';

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

/* ─── XLSX Export Endpoints ────────────────────────── */

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pendente',
  active: 'Ativo',
  overdue: 'Atrasado',
  returned: 'Devolvido',
  cancelled: 'Cancelado',
};

export const exportInventoryXlsx = async (_req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: { category: true },
      orderBy: { name: 'asc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'LabControl';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Estoque');

    sheet.columns = [
      { header: 'Nome', key: 'name', width: 30 },
      { header: 'Categoria', key: 'category', width: 20 },
      { header: 'Quantidade Total', key: 'quantity', width: 18 },
      { header: 'Disponível', key: 'available', width: 15 },
      { header: 'Emprestado', key: 'loaned', width: 15 },
      { header: 'Status', key: 'status', width: 12 },
    ];

    // Style header row
    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    };

    items.forEach((item) => {
      sheet.addRow({
        name: item.name,
        category: item.category?.name || 'Sem categoria',
        quantity: item.quantity,
        available: item.availableQuantity,
        loaned: item.loanedQuantity,
        status: item.isActive ? 'Ativo' : 'Inativo',
      });
    });

    // Add summary row
    sheet.addRow({});
    const totalRow = sheet.addRow({
      name: 'TOTAL',
      quantity: items.reduce((sum, i) => sum + i.quantity, 0),
      available: items.reduce((sum, i) => sum + i.availableQuantity, 0),
      loaned: items.reduce((sum, i) => sum + i.loanedQuantity, 0),
    });
    totalRow.font = { bold: true };

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=estoque-${new Date().toISOString().split('T')[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
    return;
  } catch (error) {
    console.error('[exportInventoryXlsx]', error);
    return res.status(500).json({ success: false, message: 'Erro ao exportar relatório de estoque' });
  }
};

export const exportLoansXlsx = async (req: Request, res: Response) => {
  try {
    const period = getParam(req.query.period) || 'all';

    let dateFilter: any = {};
    if (period !== 'all') {
      const days = parseInt(period, 10);
      if (!isNaN(days)) {
        const date = new Date();
        date.setDate(date.getDate() - days);
        dateFilter = { loanDate: { gte: date } };
      }
    }

    const loans = await prisma.loan.findMany({
      where: dateFilter,
      include: {
        borrower: { select: { name: true, email: true } },
        items: true,
      },
      orderBy: { loanDate: 'desc' },
    });

    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'LabControl';
    workbook.created = new Date();

    const sheet = workbook.addWorksheet('Empréstimos');

    sheet.columns = [
      { header: 'Solicitante', key: 'borrower', width: 25 },
      { header: 'Email', key: 'email', width: 30 },
      { header: 'Itens', key: 'items', width: 40 },
      { header: 'Qtd Total', key: 'quantity', width: 12 },
      { header: 'Data Empréstimo', key: 'loanDate', width: 18 },
      { header: 'Devolução Prevista', key: 'dueDate', width: 18 },
      { header: 'Devolvido em', key: 'returnedDate', width: 18 },
      { header: 'Status', key: 'status', width: 14 },
      { header: 'Observação', key: 'notes', width: 30 },
    ];

    sheet.getRow(1).font = { bold: true, color: { argb: 'FFFFFFFF' }, size: 12 };
    sheet.getRow(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF4F46E5' },
    };

    loans.forEach((loan) => {
      sheet.addRow({
        borrower: loan.borrower.name,
        email: loan.borrower.email,
        items: loan.items.map((i) => i.inventoryItemName).join(', '),
        quantity: loan.items.reduce((sum, i) => sum + i.quantity, 0),
        loanDate: loan.loanDate.toLocaleDateString('pt-BR'),
        dueDate: loan.dueDate.toLocaleDateString('pt-BR'),
        returnedDate: loan.returnedDate?.toLocaleDateString('pt-BR') || '—',
        status: STATUS_LABELS[loan.status] || loan.status,
        notes: loan.notes || '',
      });
    });

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=emprestimos-${new Date().toISOString().split('T')[0]}.xlsx`);

    await workbook.xlsx.write(res);
    res.end();
    return;
  } catch (error) {
    console.error('[exportLoansXlsx]', error);
    return res.status(500).json({ success: false, message: 'Erro ao exportar relatório de empréstimos' });
  }
};
