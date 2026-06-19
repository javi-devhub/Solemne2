import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';

import authRoutes from './routes/auth';

dotenv.config();

const app = express();

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(
  cors({
    origin: 'http://localhost:5173',
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

const startServer = async (): Promise<void> => {
  try {
    if (!MONGODB_URI) {
      throw new Error('La variable MONGODB_URI no está configurada');
    }

    await mongoose.connect(MONGODB_URI);

    console.log('MongoDB conectado correctamente');

    app.listen(PORT, () => {
      console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

void startServer();
