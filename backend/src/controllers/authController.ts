import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';

import { User } from '../models/User';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    // Verifica que se enviaron todos los datos
    if (!username || !email || !password) {
      res.status(400).json({
        message: 'Nombre, correo y contraseña son obligatorios',
      });
      return;
    }

    // Normaliza el correo antes de buscarlo
    const normalizedEmail = email.toLowerCase().trim();

    // Comprueba si el correo ya está registrado
    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        message: 'El correo ya está registrado',
      });
      return;
    }

    // Protege la contraseña antes de guardarla
    const passwordHash = await bcrypt.hash(password, 10);

    // Guarda el usuario en MongoDB
    const newUser = await User.create({
      username,
      email: normalizedEmail,
      passwordHash,
    });

    // Devuelve los datos públicos del usuario
    res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error('Error al registrar usuario:', error);

    res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
};

export const loginUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({
        message: 'Correo y contraseña son obligatorios',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const user = await User.findOne({
      email: normalizedEmail,
    });

    if (!user) {
      res.status(401).json({
        message: 'Correo o contraseña incorrectos',
      });
      return;
    }

    const passwordIsValid = await bcrypt.compare(
      password,
      user.passwordHash,
    );

    if (!passwordIsValid) {
      res.status(401).json({
        message: 'Correo o contraseña incorrectos',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('La variable JWT_SECRET no está configurada');
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
      },
      jwtSecret,
      {
        expiresIn: '2h',
      },
    );

    res.status(200).json({
      message: 'Login correcto',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);

    res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
};