import type { InteractableObject } from '@/types/interactable'

export const ROOM_01_OBJECTS: InteractableObject[] = [
  {
    id: 'objeto-central',
    x: 640,
    y: 480,   // se ajusta al buildRoom
    width: 48,
    height: 48,
    descriptionP1: '"Es mi osito cosido.\nLo recuerdo perfectamente.\nTiene un botón en el pecho."',
    descriptionP2: '"Un dispositivo mal calibrado.\nLa pantalla parpadea.\nHay una perilla y un botón."',
    promptP1: '[E] Inspeccionar',
    promptP2: '[ENTER] Inspeccionar',
    puzzleId: 'puzzle-01',
    actions: [
      { id: 'girar',     label: 'GIRAR',     triggeredBy: 2, order: 1 },
      { id: 'presionar', label: 'PRESIONAR', triggeredBy: 2, order: 2 },
      { id: 'soltar',    label: 'SOLTAR',    triggeredBy: 2, order: 3 },
    ],
  },
  {
    id: 'puerta-salida',
    x: 180,
    y: 400,
    width: 60,
    height: 100,
    descriptionP1: '"La puerta está cerrada.\nNecesita un código."',
    descriptionP2: '"Bloqueada. El mecanismo\nrequiere una secuencia."',
    promptP1: '[E] Examinar',
    promptP2: '[ENTER] Examinar',
  },
]