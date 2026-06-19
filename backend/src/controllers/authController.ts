import bcrypt from 'bcrypt';
import type { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import type { AuthenticatedRequest } from '../middlewares/authMiddleware';

import { User } from '../models/User';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      res.status(400).json({
        message: 'Nombre, correo y contraseña son obligatorios',
      });
      return;
    }

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await User.findOne({
      email: normalizedEmail,
    });

    if (existingUser) {
      res.status(409).json({
        message: 'El correo ya está registrado',
      });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username,
      email: normalizedEmail,
      passwordHash,
    });

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

    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 2 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: 'Login correcto',
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

export const getCurrentUser = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: 'No autenticado',
      });
      return;
    }

    const user = await User.findById(req.user.userId).select('-passwordHash');

    if (!user) {
      res.status(404).json({
        message: 'Usuario no encontrado',
      });
      return;
    }

    res.status(200).json({
      user,
    });
  } catch (error) {
    console.error('Error al obtener usuario actual:', error);

    res.status(500).json({
      message: 'Error interno del servidor',
    });
  }
};
