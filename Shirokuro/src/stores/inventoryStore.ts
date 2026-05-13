import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Item } from '@/types/item'

const MAX_SLOTS = 6

export const useInventoryStore = defineStore('inventory', () => {
  const player1Items = ref<(Item | null)[]>(Array(MAX_SLOTS).fill(null))
  const player2Items = ref<(Item | null)[]>(Array(MAX_SLOTS).fill(null))

  const inv1Open = ref(false)
  const inv2Open = ref(false)

  function toggleInventory(playerId: 1 | 2) {
    if (playerId === 1) inv1Open.value = !inv1Open.value
    else               inv2Open.value = !inv2Open.value
  }

  function closeAll() {
    inv1Open.value = false
    inv2Open.value = false
  }

  function addItem(playerId: 1 | 2, item: Item): boolean {
    const inv = playerId === 1 ? player1Items : player2Items
    const slot = inv.value.findIndex(s => s === null)
    if (slot === -1) return false  // inventario lleno
    inv.value[slot] = item
    return true
  }

  function removeItem(playerId: 1 | 2, itemId: string) {
    const inv = playerId === 1 ? player1Items : player2Items
    const slot = inv.value.findIndex(s => s?.id === itemId)
    if (slot !== -1) inv.value[slot] = null
  }

  function hasItem(playerId: 1 | 2, itemId: string): boolean {
    const inv = playerId === 1 ? player1Items : player2Items
    return inv.value.some(s => s?.id === itemId)
  }

  function clearAll() {
    player1Items.value = Array(MAX_SLOTS).fill(null)
    player2Items.value = Array(MAX_SLOTS).fill(null)
  }

  return {
    player1Items,
    player2Items,
    inv1Open,
    inv2Open,
    toggleInventory,
    closeAll,
    addItem,
    removeItem,
    hasItem,
    clearAll,
  }
})