import express, { type Express } from 'express';
import cors from 'cors';
import { env } from './config/env';
import { requestLogger } from './middlewares/requestLogger';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import apiRouter from './routes/index';

const app: Express = express();

// ─── Core middleware ──────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Request logging ──────────────────────────
app.use(requestLogger);

// ─── API routes ───────────────────────────────
app.use('/api', apiRouter);

// ─── Error handling (MUST be last) ────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
