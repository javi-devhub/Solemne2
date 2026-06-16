export interface Room {
  id: string
  name: string
  background: string
  connectedRooms: string[]
  itemIds: string[]
  puzzleIds: string[]
  isLocked: boolean
  ambientSound?: string
}
