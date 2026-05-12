import { describe, it, expect } from 'vitest'
import type { Item } from '@/types/item'

function isVisibleToPlayer(item: Item, playerId: 1 | 2): boolean {
  return item.visibleToPlayer === 'both' || item.visibleToPlayer === playerId
}

describe('VisibilitySystem', () => {
  it('shows item only to player 1', () => {
    const item: Item = { id: 'i1', name: '', description: '', sprite: '', isUsable: false, isKeyItem: false, visibleToPlayer: 1 }
    expect(isVisibleToPlayer(item, 1)).toBe(true)
    expect(isVisibleToPlayer(item, 2)).toBe(false)
  })

  it('shows item to both players', () => {
    const item: Item = { id: 'i2', name: '', description: '', sprite: '', isUsable: false, isKeyItem: false, visibleToPlayer: 'both' }
    expect(isVisibleToPlayer(item, 1)).toBe(true)
    expect(isVisibleToPlayer(item, 2)).toBe(true)
  })
})
