<template>
  <div class="game-view">
    <GameCanvas />

    <!-- Inventarios como overlay Vue sobre el canvas -->
    <InventoryOverlay
      :playerId="1"
      :isOpen="invStore.inv1Open"
      :items="invStore.player1Items"
      closeKey="I"
    />
    <InventoryOverlay
      :playerId="2"
      :isOpen="invStore.inv2Open"
      :items="invStore.player2Items"
      closeKey="O"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import GameCanvas from '@/components/game/GameCanvas.vue'
import InventoryOverlay from '@/components/game/InventoryOverlay.vue'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useGameStore } from '@/stores/gameStore'
import { gameBus } from '@/composables/useGameEventBus'

const router    = useRouter()
const invStore  = useInventoryStore()
const gameStore = useGameStore()

function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'i': case 'I':
      invStore.toggleInventory(1)
      break
    case 'o': case 'O':
      invStore.toggleInventory(2)
      break
    case 'Escape':
      invStore.closeAll()
      gameStore.pauseGame()
      router.push('/pause')
      break
  }
}

onMounted(() => {
  gameStore.setPhase('playing')
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  invStore.closeAll()
  gameBus.off('p1:proximity')
  gameBus.off('p2:proximity')
  gameBus.off('p1:interact')
  gameBus.off('p2:interact')
})
</script>

<style scoped>
.game-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}
</style>