const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001';

export type GameProgressPayload = {
  slot?: string;
  scene: string;
  players: Record<string, unknown>;
  inventory: Record<string, unknown>;
  solvedPuzzles: string[];
  flags: Record<string, unknown>;
  playTimeSeconds: number;
};

export const saveProgress = async (progress: GameProgressPayload) => {
  const response = await fetch(`${API_URL}/api/progress`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify({
      slot: 'main',
      ...progress,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'No se pudo guardar el progreso');
  }

  return data.progress;
};

export const loadProgress = async (slot = 'main') => {
  const response = await fetch(`${API_URL}/api/progress/${slot}`, {
    method: 'GET',
    credentials: 'include',
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? 'No se pudo cargar el progreso');
  }

  return data.progress;
};