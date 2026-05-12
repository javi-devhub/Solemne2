export interface Item {
  id: string
  name: string
  description: string
  sprite: string
  isUsable: boolean
  isKeyItem: boolean
  visibleToPlayer: 1 | 2 | 'both'
}
