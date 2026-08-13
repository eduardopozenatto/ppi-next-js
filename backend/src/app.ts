import express, { type Express } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import path from 'path';
import { env } from './config/env';
import { requestLogger } from './middlewares/requestLogger';
import { notFoundHandler } from './middlewares/notFound';
import { errorHandler } from './middlewares/errorHandler';
import apiRouter from './routes/index';

const app: Express = express();

// ─── Ensure Upload Directories Exist ──────────
const avatarsDir = path.join(__dirname, '../public/uploads/avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

// ─── Core middleware ──────────────────────────
const allowedOrigins = env.CORS_ORIGIN.split(',').map((s) => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes('*') ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app') ||
        origin.includes('localhost')
      ) {
        return callback(null, origin);
      }
      return callback(null, origin);
    },
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// ─── Static files ─────────────────────────────
app.use('/uploads', express.static(path.join(__dirname, '../public/uploads')));

// ─── Request logging ──────────────────────────
app.use(requestLogger);

// ─── API routes ───────────────────────────────
app.use('/api', apiRouter);

// ─── Error handling (MUST be last) ────────────
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
