import type { InteractableObject } from '@/types/interactable'

// ── Habitación 02 — "Las marcas en la pared" ────────────────────────────
// Un solo objeto interactivo compartido: cada jugadora ve algo distinto
// al examinarlo (igual que 'objeto-central' en la Habitación 01).
export const ROOM_02_OBJECTS: InteractableObject[] = [
  {
    id: 'marcas-pared',
    x: 640,
    y: 300,
    width: 280,
    height: 170,
    descriptionP1:
      '"Reconozco estos dibujos...\nUna casa, un osito, una puerta.\nEstán marcados en ese orden, de izquierda a derecha."',
    descriptionP2:
      '"Una cuadrícula de medición sobre la pared.\nNo veo los dibujos con claridad,\nsolo números en cada posición."',
    promptP1: '[E] Examinar la pared',
    promptP2: '[P] Examinar la pared',
    puzzleId: 'puzzle-02',
  },
]
