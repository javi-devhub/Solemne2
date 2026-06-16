export interface Clue {
  id: string
  text: string
  discoveredBy: 1 | 2 | null
  roomId: string
  isShared: boolean
}
