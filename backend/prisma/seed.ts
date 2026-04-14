import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../src/generated/prisma/client';
import {
  UserRole,
  LoanStatus,
  NotificationType,
} from '../src/generated/prisma/enums';
import { hashPassword } from '../src/utils/crypto';

// ─── Create a standalone Prisma client for seeding ────
const pool = new Pool({ connectionString: process.env['DATABASE_URL'] });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// ─── Permission sets matching frontend/mocks/session-user.ts ───

const ALUNO_PERMISSIONS = {
  ver_itens: true,
  pedir_emprestimos: true,
  ver_notificacoes: true,
  manipular_estoque: false,
  gerar_relatorios: false,
  aprovar_emprestimos: false,
  gerenciar_itens: false,
  gerenciar_usuarios: false,
  gerenciar_roles: false,
  gerenciar_categorias: false,
  gerenciar_permissoes: false,
};

const ESTAGIARIO_PERMISSIONS = {
  ver_itens: true,
  pedir_emprestimos: true,
  ver_notificacoes: true,
  manipular_estoque: true,
  gerar_relatorios: true,
  aprovar_emprestimos: true,
  gerenciar_itens: false,
  gerenciar_usuarios: false,
  gerenciar_roles: false,
  gerenciar_categorias: false,
  gerenciar_permissoes: false,
};

const LABORATORISTA_PERMISSIONS = {
  ver_itens: true,
  pedir_emprestimos: true,
  ver_notificacoes: true,
  manipular_estoque: true,
  gerar_relatorios: true,
  aprovar_emprestimos: true,
  gerenciar_itens: true,
  gerenciar_usuarios: true,
  gerenciar_roles: true,
  gerenciar_categorias: true,
  gerenciar_permissoes: true,
};

async function main() {
  console.log('🌱 Seeding LabControl database...\n');
  
  const defaultPassword = await hashPassword('1234');

  // ─── Tags (frontend/mocks/settings.ts MOCK_TAGS) ─────────
  const tagAluno = await prisma.tag.upsert({
    where: { name: 'Aluno' },
    update: {},
    create: {
      id: 'tag-1',
      name: 'Aluno',
      color: '#0f62fe',
      description: 'Acesso básico para busca e solicitação de empréstimos',
      permissions: ALUNO_PERMISSIONS,
    },
  });

  const tagEstagiario = await prisma.tag.upsert({
    where: { name: 'Estagiário' },
    update: {},
    create: {
      id: 'tag-2',
      name: 'Estagiário',
      color: '#f1c21b',
      description: 'Auxilia na gestão de estoque e relatórios',
      permissions: ESTAGIARIO_PERMISSIONS,
    },
  });

  const tagLaboratorista = await prisma.tag.upsert({
    where: { name: 'Laboratorista' },
    update: {},
    create: {
      id: 'tag-3',
      name: 'Laboratorista',
      color: '#24a148',
      description: 'Acesso admin completo a todos os módulos do sistema',
      permissions: LABORATORISTA_PERMISSIONS,
    },
  });

  console.log('   ✓ Tags:', [tagAluno.name, tagEstagiario.name, tagLaboratorista.name].join(', '));

  // ─── Categories (frontend/mocks/settings.ts MOCK_CATEGORIES + Alimentação) ─
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { name: 'Microcontroladores' },
      update: {},
      create: { id: 'cat-1', name: 'Microcontroladores' },
    }),
    prisma.category.upsert({
      where: { name: 'Instrumentação' },
      update: {},
      create: { id: 'cat-2', name: 'Instrumentação' },
    }),
    prisma.category.upsert({
      where: { name: 'Sensores' },
      update: {},
      create: { id: 'cat-3', name: 'Sensores' },
    }),
    prisma.category.upsert({
      where: { name: 'Computadores' },
      update: {},
      create: { id: 'cat-4', name: 'Computadores' },
    }),
    prisma.category.upsert({
      where: { name: 'Alimentação' },
      update: {},
      create: { id: 'cat-5', name: 'Alimentação' },
    }),
  ]);

  console.log('   ✓ Categories:', categories.map((c) => c.name).join(', '));

  // ─── Users (merged from mocks/session-user.ts + mocks/users.ts) ─
  // Passwords are plain text — will be hashed in Phase 6 (BAUTH-01)
  const admin = await prisma.user.upsert({
    where: { email: 'labcontrol.admin@gmail.com' },
    update: { password: defaultPassword },
    create: {
      id: 'admin-1',
      name: 'Prof. Eduardo Pozenatto',
      email: 'labcontrol.admin@gmail.com',
      password: defaultPassword,
      matricula: 'SIAPE-9876',
      role: UserRole.admin,
      phone: '(54) 99876-5432',
      tagId: tagLaboratorista.id,
    },
  });

  const carlos = await prisma.user.upsert({
    where: { email: 'carlos.aluno.lab@gmail.com' },
    update: { password: defaultPassword },
    create: {
      id: 'user-1',
      name: 'Carlos Silva',
      email: 'carlos.aluno.lab@gmail.com',
      password: defaultPassword,
      matricula: '2021001234',
      role: UserRole.user,
      tagId: tagAluno.id,
    },
  });

  const bruno = await prisma.user.upsert({
    where: { email: 'bruno@discente.uf.br' },
    update: { password: defaultPassword },
    create: {
      id: 'user-2',
      name: 'Bruno Lima',
      email: 'bruno@discente.uf.br',
      password: defaultPassword,
      matricula: '2021005678',
      role: UserRole.user,
      tagId: tagAluno.id,
    },
  });

  const maria = await prisma.user.upsert({
    where: { email: 'maria.estagiaria@gmail.com' },
    update: { password: defaultPassword },
    create: {
      id: 'user-3',
      name: 'Maria Santos',
      email: 'maria.estagiaria@gmail.com',
      password: defaultPassword,
      matricula: '2022001122',
      role: UserRole.user,
      tagId: tagEstagiario.id,
    },
  });

  const ana = await prisma.user.upsert({
    where: { email: 'ana@discente.uf.br' },
    update: { password: defaultPassword },
    create: {
      id: 'user-4',
      name: 'Ana Costa',
      email: 'ana@discente.uf.br',
      password: defaultPassword,
      matricula: '2023003344',
      role: UserRole.user,
      tagId: tagAluno.id,
      isActive: false,
    },
  });

  console.log('   ✓ Users:', [admin.name, carlos.name, bruno.name, maria.name, ana.name].join(', '));

  // ─── Permission Override (frontend/mocks/settings.ts) ────
  await prisma.userPermissionOverride.upsert({
    where: { userId_tagId: { userId: bruno.id, tagId: tagAluno.id } },
    update: {},
    create: {
      userId: bruno.id,
      tagId: tagAluno.id,
      customOverrides: { manipular_estoque: true },
    },
  });

  console.log('   ✓ Permission override: Bruno Lima → manipular_estoque: true');

  // ─── Inventory Items (frontend/mocks/inventory-items.ts) ──
  const inv1 = await prisma.inventoryItem.upsert({
    where: { id: 'inv-1' },
    update: {},
    create: {
      id: 'inv-1',
      name: 'Multímetro digital',
      description: 'Multímetro True RMS, medição de tensão, corrente e resistência.',
      quantity: 12,
      availableQuantity: 8,
      loanedQuantity: 4,
      image: 'buttonIcons/box.svg',
      categoryId: 'cat-2', // Instrumentação
    },
  });

  const inv2 = await prisma.inventoryItem.upsert({
    where: { id: 'inv-2' },
    update: {},
    create: {
      id: 'inv-2',
      name: 'Kit sensores',
      description: 'Conjunto com sensor de temperatura, luminosidade e proximidade.',
      quantity: 25,
      availableQuantity: 18,
      loanedQuantity: 7,
      image: 'buttonIcons/box.svg',
      categoryId: 'cat-3', // Sensores
    },
  });

  const inv3 = await prisma.inventoryItem.upsert({
    where: { id: 'inv-3' },
    update: {},
    create: {
      id: 'inv-3',
      name: 'Fonte regulada',
      description: 'Fonte DC 0–30 V, 5 A, com proteção contra curto-circuito.',
      quantity: 6,
      availableQuantity: 5,
      loanedQuantity: 1,
      image: 'buttonIcons/box.svg',
      categoryId: 'cat-5', // Alimentação
    },
  });

  const inv4 = await prisma.inventoryItem.upsert({
    where: { id: 'inv-4' },
    update: {},
    create: {
      id: 'inv-4',
      name: 'Osciloscópio portátil',
      description: '2 canais, 100 MHz, interface USB para captura de dados.',
      quantity: 4,
      availableQuantity: 2,
      loanedQuantity: 2,
      image: 'buttonIcons/box.svg',
      categoryId: 'cat-2', // Instrumentação
    },
  });

  console.log('   ✓ Inventory: 4 items');

  // ─── Loans (frontend/mocks/loans.ts — 7 loans) ───────────

  // loan-1: Ana Costa — active
  await prisma.loan.upsert({
    where: { id: 'loan-1' },
    update: {},
    create: {
      id: 'loan-1',
      borrowerId: ana.id,
      status: LoanStatus.active,
      loanDate: new Date('2025-03-10T09:00:00Z'),
      dueDate: new Date('2025-03-24T09:00:00Z'),
      notes: 'Projeto de circuitos — preciso do multímetro para testes em bancada.',
      labObservation: 'Aprovado. Devolva no balcão do lab 2.',
      createdAt: new Date('2025-03-10T09:00:00Z'),
      items: {
        create: [
          { inventoryItemId: inv1.id, inventoryItemName: 'Multímetro digital', quantity: 1 },
        ],
      },
    },
  });

  // loan-2: Bruno Lima — pending
  await prisma.loan.upsert({
    where: { id: 'loan-2' },
    update: {},
    create: {
      id: 'loan-2',
      borrowerId: bruno.id,
      status: LoanStatus.pending,
      loanDate: new Date('2025-03-18T14:00:00Z'),
      dueDate: new Date('2025-04-01T14:00:00Z'),
      notes: 'Trabalho de conclusão — sensores de temperatura e umidade',
      createdAt: new Date('2025-03-18T14:00:00Z'),
      items: {
        create: [
          { inventoryItemId: inv2.id, inventoryItemName: 'Kit sensores', quantity: 2 },
        ],
      },
    },
  });

  // loan-3: Carlos Silva — returned
  await prisma.loan.upsert({
    where: { id: 'loan-3' },
    update: {},
    create: {
      id: 'loan-3',
      borrowerId: carlos.id,
      status: LoanStatus.returned,
      loanDate: new Date('2025-02-01T10:00:00Z'),
      dueDate: new Date('2025-02-15T10:00:00Z'),
      returnedDate: new Date('2025-02-14T16:30:00Z'),
      notes: 'Fonte 12V para testes',
      createdAt: new Date('2025-02-01T10:00:00Z'),
      items: {
        create: [
          { inventoryItemId: inv3.id, inventoryItemName: 'Fonte regulada', quantity: 1 },
        ],
      },
    },
  });

  // loan-4: Maria Santos — overdue
  await prisma.loan.upsert({
    where: { id: 'loan-4' },
    update: {},
    create: {
      id: 'loan-4',
      borrowerId: maria.id,
      status: LoanStatus.overdue,
      loanDate: new Date('2025-02-20T08:00:00Z'),
      dueDate: new Date('2025-03-06T08:00:00Z'),
      notes: 'Projeto de automação residencial',
      labObservation: 'Aprovado. Devolver na recepção.',
      createdAt: new Date('2025-02-20T08:00:00Z'),
      items: {
        create: [
          { inventoryItemId: inv4.id, inventoryItemName: 'Osciloscópio portátil', quantity: 1 },
        ],
      },
    },
  });

  // loan-5: Carlos Silva — cancelled
  await prisma.loan.upsert({
    where: { id: 'loan-5' },
    update: {},
    create: {
      id: 'loan-5',
      borrowerId: carlos.id,
      status: LoanStatus.cancelled,
      loanDate: new Date('2025-03-01T09:00:00Z'),
      dueDate: new Date('2025-03-15T09:00:00Z'),
      notes: 'Cancelei pois achei outro equipamento',
      createdAt: new Date('2025-03-01T09:00:00Z'),
      items: {
        create: [
          { inventoryItemId: inv4.id, inventoryItemName: 'Osciloscópio portátil', quantity: 1 },
        ],
      },
    },
  });

  // loan-6: Bruno Lima — returned late
  await prisma.loan.upsert({
    where: { id: 'loan-6' },
    update: {},
    create: {
      id: 'loan-6',
      borrowerId: bruno.id,
      status: LoanStatus.returned,
      loanDate: new Date('2025-01-10T09:00:00Z'),
      dueDate: new Date('2025-01-20T09:00:00Z'),
      returnedDate: new Date('2025-01-25T14:00:00Z'),
      notes: 'Teste de componentes',
      labObservation: 'Devolvido com atraso de 5 dias.',
      returnedLate: true,
      createdAt: new Date('2025-01-10T09:00:00Z'),
      items: {
        create: [
          { inventoryItemId: inv1.id, inventoryItemName: 'Multímetro digital', quantity: 1 },
        ],
      },
    },
  });

  // loan-7: Ana Costa — pending
  await prisma.loan.upsert({
    where: { id: 'loan-7' },
    update: {},
    create: {
      id: 'loan-7',
      borrowerId: ana.id,
      status: LoanStatus.pending,
      loanDate: new Date('2025-03-20T10:00:00Z'),
      dueDate: new Date('2025-04-03T10:00:00Z'),
      notes: 'Workshop de IoT — necessário para todos os grupos',
      createdAt: new Date('2025-03-20T10:00:00Z'),
      items: {
        create: [
          { inventoryItemId: inv2.id, inventoryItemName: 'Kit sensores', quantity: 3 },
        ],
      },
    },
  });

  console.log('   ✓ Loans: 7 loans with items');

  // ─── Notifications (frontend/mocks/notifications.ts) ──────
  await prisma.notification.createMany({
    data: [
      {
        id: 'n1',
        userId: carlos.id,
        title: 'Empréstimo aprovado',
        body: 'Seu pedido do Multímetro digital foi aprovado. Retire no balcão do laboratório.',
        read: false,
        type: NotificationType.approval,
        createdAt: new Date('2025-03-19T11:00:00Z'),
      },
      {
        id: 'n2',
        userId: carlos.id,
        title: 'Devolução em 3 dias',
        body: 'O prazo do Kit sensores vence em 3 dias. Renove ou devolva pelo sistema.',
        read: false,
        type: NotificationType.reminder,
        createdAt: new Date('2025-03-18T08:00:00Z'),
      },
      {
        id: 'n3',
        userId: carlos.id,
        title: 'Empréstimo recusado',
        body: 'Seu empréstimo foi recusado. Motivo: período muito longo solicitado.',
        read: true,
        type: NotificationType.rejection,
        createdAt: new Date('2025-03-15T10:30:00Z'),
      },
      {
        id: 'n4',
        userId: carlos.id,
        title: 'Novo item disponível',
        body: 'ESP32 DevKit foi adicionado ao estoque. Confira na página de busca.',
        read: true,
        type: NotificationType.new_item,
        createdAt: new Date('2025-03-14T14:00:00Z'),
      },
      {
        id: 'n5',
        userId: carlos.id,
        title: 'Devolução atrasada',
        body: 'Seu empréstimo do Arduino Uno R3 está atrasado. Devolva o mais rápido possível.',
        read: false,
        type: NotificationType.overdue,
        createdAt: new Date('2025-03-12T09:00:00Z'),
      },
    ],
    skipDuplicates: true,
  });

  console.log('   ✓ Notifications: 5 notifications');

  console.log('\n✅ Seed complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
