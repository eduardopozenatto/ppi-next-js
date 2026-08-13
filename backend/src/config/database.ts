import dns from 'dns';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '../generated/prisma/client';
import { env } from './env';

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
