import mitt from 'mitt'
import type { PuzzleAction } from '@/types/interactable'
import type { ActionResult } from '@/stores/puzzleStore'

export interface ProximityEvent {
  objectId: string
  prompt:   string
  screenX:  number
  screenY:  number
}

export interface InteractEvent {
  objectId:    string
  description: string
  actions:     PuzzleAction[]
  screenX:     number
  screenY:     number
}

type Events = {
  'p1:proximity':  ProximityEvent | null
  'p2:proximity':  ProximityEvent | null
  'p1:interact':   InteractEvent
  'p2:interact':   InteractEvent
  'puzzle:solved': string
}

// Singleton — una sola instancia compartida por toda la app
export const gameBus = mitt<Events>()