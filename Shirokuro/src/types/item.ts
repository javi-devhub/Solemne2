export interface Item {
  id: string
  name: string
  description: string
  icon: string        // emoji o símbolo visual
  sprite: string
  isUsable: boolean
  isKeyItem: boolean
  visibleToPlayer: 1 | 2 | 'both'
}