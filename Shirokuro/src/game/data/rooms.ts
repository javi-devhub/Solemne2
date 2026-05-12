import type { Room } from '@/types/room'

export const rooms: Room[] = [
  {
    id: 'room-start',
    name: 'Habitación de Inicio',
    background: 'bg-scene1',
    connectedRooms: ['room-corridor'],
    itemIds: [],
    puzzleIds: ['puzzle-intro'],
    isLocked: false,
    ambientSound: 'ambient-scene1',
  },
]
