import type { Request, Response } from 'express';

export const registerUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    res.status(400).json({
      message: 'Nombre, correo y contraseña son obligatorios',
    });
    return;
  }

  res.status(200).json({
    message: 'Endpoint de registro funcionando',
    user: {
      username,
      email,
    },
  });
};

export const loginUser = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({
      message: 'Correo y contraseña son obligatorios',
    });
    return;
  }

  res.status(200).json({
    message: 'Endpoint de login funcionando',
    email,
  });
};
