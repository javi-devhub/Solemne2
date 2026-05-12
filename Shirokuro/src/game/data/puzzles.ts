import type { Puzzle } from '@/types/puzzle'
export const puzzles: Puzzle[] = [
  {
    id: 'puzzle-intro',
    name: 'Puzle de Introducción',
    description: 'Un puzle de ejemplo para probar el sistema.',
    state: 'locked',
    requiresBothPlayers: true,
    player1Clue: 'Ves un símbolo en la pared norte.',
    player2Clue: 'Ves el mismo símbolo en el suelo.',
    solution: 'símbolo',
  },
]
