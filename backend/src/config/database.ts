import dns from 'dns';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from './env';
import { hashPassword } from '../utils/crypto';

// Força a resolução DNS do Node.js a preferir IPv4 sobre IPv6.
// Corrige o erro 'ENETUNREACH' em servidores como o Render que não possuem roteamento IPv6 de saída.
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {
  // Ignora se não for suportado na versão
}

/**
 * Prisma Client singleton com PostgreSQL adapter (Prisma 7).
 * Usa globalThis para evitar múltiplas instâncias durante hot-reload em desenvolvimento.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function createPrismaClient(): PrismaClient {
  const pool = new Pool({
    connectionString: env.DATABASE_URL,
    connectionTimeoutMillis: 10000,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

/**
 * Auto-Seed assíncrono executado no startup do servidor backend.
 * Garante que tags e o usuário administrador existam no Supabase/PostgreSQL.
 */
export async function ensureInitialSeedData(): Promise<void> {
  try {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
      return; // Banco já populado
    }

    console.log('🌱 [Auto-Seed] Banco de dados inicial/vazio detectado. Populando tags e usuários base...');

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
        description: 'Auxilia na gestão de estoque e relatorios',
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

    await prisma.tag.upsert({
      where: { name: 'Professor' },
      update: {},
      create: {
        id: 'tag-4',
        name: 'Professor',
        color: '#8a3ffc',
        description: 'Acesso para docentes e servidores (LDAP) para busca e empréstimos',
        permissions: ALUNO_PERMISSIONS,
      },
    });

    const defaultPassword = await hashPassword('1234');

    await prisma.user.upsert({
      where: { email: 'labcontrol.admin@gmail.com' },
      update: { password: defaultPassword },
      create: {
        id: 'admin-1',
        name: 'Prof. Eduardo Pozenatto',
        email: 'labcontrol.admin@gmail.com',
        password: defaultPassword,
        matricula: 'SIAPE-9876',
        role: 'admin',
        phone: '(54) 99876-5432',
        tagId: tagLaboratorista.id,
      },
    });

    await prisma.user.upsert({
      where: { email: 'carlos.aluno.lab@gmail.com' },
      update: { password: defaultPassword },
      create: {
        id: 'user-1',
        name: 'Carlos Silva',
        email: 'carlos.aluno.lab@gmail.com',
        password: defaultPassword,
        matricula: '2021001234',
        role: 'user',
        tagId: tagAluno.id,
      },
    });

    await prisma.user.upsert({
      where: { email: 'maria.estagiaria@gmail.com' },
      update: { password: defaultPassword },
      create: {
        id: 'user-3',
        name: 'Maria Santos',
        email: 'maria.estagiaria@gmail.com',
        password: defaultPassword,
        matricula: '2022001122',
        role: 'user',
        tagId: tagEstagiario.id,
      },
    });

    console.log('✅ [Auto-Seed] Tags e usuários base criados com sucesso!');
  } catch (err) {
    console.error('⚠️ [Auto-Seed] Erro não fatal durante o auto-seed:', err);
  }
}
