import app from './app';
import { env } from './config/env';
import { prisma, ensureInitialSeedData } from './config/database';

const server = app.listen(env.PORT, () => {
  console.log('');
  console.log('🚀 LabControl API');
  console.log(`   URL:         http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   CORS origin: ${env.CORS_ORIGIN}`);
  console.log('');

  // Executa o auto-seed transparente caso o banco esteja limpo no Supabase
  void ensureInitialSeedData();
});

// ─── Graceful shutdown ────────────────────────
async function shutdown(signal: string): Promise<void> {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log('Server and database connections closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
