import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

type JwtPayload = {
  userId: string;
  email: string;
};

export type AuthenticatedRequest = Request & {
  user?: JwtPayload;
};

export const authenticateUser = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void => {
  try {
    const token = req.cookies.authToken;

    if (!token) {
      res.status(401).json({
        message: 'No autenticado',
      });
      return;
    }

    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error('La variable JWT_SECRET no está configurada');
    }

    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({
      message: 'Token inválido o expirado',
    });
  }
};