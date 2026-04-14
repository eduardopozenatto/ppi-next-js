import app from './app';
import { env } from './config/env';

const server = app.listen(env.PORT, () => {
  console.log('');
  console.log('🚀 LabControl API');
  console.log(`   URL:         http://localhost:${env.PORT}`);
  console.log(`   Environment: ${env.NODE_ENV}`);
  console.log(`   CORS origin: ${env.CORS_ORIGIN}`);
  console.log('');
});

// ─── Graceful shutdown ────────────────────────
function shutdown(signal: string): void {
  console.log(`\n${signal} received. Shutting down gracefully...`);
  server.close(() => {
    console.log('Server closed.');
    process.exit(0);
  });
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
