import dotenv from 'dotenv';
import mongoose from 'mongoose';

import app from './app.js';

dotenv.config();

const PORT = Number(process.env.PORT) || 3000;
const MONGODB_URI = process.env.MONGODB_URI;

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