import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item } from '@/types/item'

export const useInventoryStore = defineStore('inventory', () => {
  const player1Items = ref<Item[]>([])
  const player2Items = ref<Item[]>([])

  function addItem(playerId: 1 | 2, item: Item) {
    const inv = playerId === 1 ? player1Items : player2Items
    if (!inv.value.find(i => i.id === item.id)) {
      inv.value.push(item)
    }
  }

  function removeItem(playerId: 1 | 2, itemId: string) {
    const inv = playerId === 1 ? player1Items : player2Items
    inv.value = inv.value.filter(i => i.id !== itemId)
  }

  function hasItem(playerId: 1 | 2, itemId: string): boolean {
    const inv = playerId === 1 ? player1Items : player2Items
    return !!inv.value.find(i => i.id === itemId)
  }

  function clearAll() {
    player1Items.value = []
    player2Items.value = []
  }

  return {
    player1Items,
    player2Items,
    addItem,
    removeItem,
    hasItem,
    clearAll,
  }
})
