import type { Response } from 'express';

import type { AuthenticatedRequest } from '../middlewares/authMiddleware.js';
import { Progress } from '../models/Progress.js';

export const saveProgress = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const {
      slot = 'main',
      scene = 'SceneP1',
      players = {},
      inventory = {},
      solvedPuzzles = [],
      flags = {},
      playTimeSeconds = 0,
    } = req.body;

    const progress = await Progress.findOneAndUpdate(
      {
        userId: req.user.userId,
        slot,
      },
      {
        userId: req.user.userId,
        slot,
        scene,
        players,
        inventory,
        solvedPuzzles,
        flags,
        playTimeSeconds,
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      message: 'Progreso guardado correctamente',
      progress,
    });
  } catch (error) {
    console.error('Error al guardar progreso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};

export const getProgress = async (
  req: AuthenticatedRequest,
  res: Response,
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'No autenticado' });
      return;
    }

    const slot = req.params.slot ?? 'main';

    const progress = await Progress.findOne({
      userId: req.user.userId,
      slot,
    });

    if (!progress) {
      res.status(404).json({
        message: 'No existe progreso guardado para esta partida',
      });
      return;
    }

    res.status(200).json({ progress });
  } catch (error) {
    console.error('Error al obtener progreso:', error);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
};