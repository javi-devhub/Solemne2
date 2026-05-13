import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useInventoryStore } from '@/stores/inventoryStore'
import type { Item } from '@/types/item'

const mockItem: Item = {
  id: 'key-001',
  name: 'Llave oxidada',
  icon: '🗝️',
  description: 'Una llave vieja.',
  sprite: 'key',
  isUsable: true,
  isKeyItem: true,
  visibleToPlayer: 1,
}

describe('InventoryStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('adds an item to player 1', () => {
    const store = useInventoryStore()
    store.addItem(1, mockItem)
    expect(store.player1Items).toHaveLength(1)
    expect(store.hasItem(1, 'key-001')).toBe(true)
  })

  it('does not add duplicate items', () => {
    const store = useInventoryStore()
    store.addItem(1, mockItem)
    store.addItem(1, mockItem)
    expect(store.player1Items).toHaveLength(1)
  })

  it('removes an item', () => {
    const store = useInventoryStore()
    store.addItem(2, mockItem)
    store.removeItem(2, 'key-001')
    expect(store.hasItem(2, 'key-001')).toBe(false)
  })
})
