import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';

import authRoutes from './routes/auth.js';
import progressRoutes from './routes/progress.js';

const app = express();

const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:8080',
  process.env.FRONTEND_URL,
].filter((origin): origin is string => Boolean(origin));

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());

app.get('/api/health', (_req, res) => {
  res.status(200).json({
    message: 'Backend de Shirokuro funcionando',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/progress', progressRoutes);

export default app;