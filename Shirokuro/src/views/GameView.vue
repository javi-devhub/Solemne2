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
    
    <div v-if="isPaused" class="pause-overlay">
      <div class="pause-panel">
        <h2 class="pause-title">PAUSA</h2>
        <div class="pause-divider" />

        <button class="pause-btn" @click="resumeGame">
          CONTINUAR
        </button>

        <button class="pause-btn" @click="goHome">
          MENÚ PRINCIPAL
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import GameCanvas from '@/components/game/GameCanvas.vue'
import InventoryOverlay from '@/components/game/InventoryOverlay.vue'
import { useInventoryStore } from '@/stores/inventoryStore'
import { useGameStore } from '@/stores/gameStore'
import { gameBus } from '@/composables/useGameEventBus'
import { getGame } from '@/game/mainGame'

const router    = useRouter()
const invStore  = useInventoryStore()
const gameStore = useGameStore()
const isPaused = ref(false)

function pausePhaserScenes() {
  const game = getGame()

  game?.scene.pause('SceneP1')
  game?.scene.pause('SceneP2')
  game?.scene.pause('HUDScene')
}

function resumePhaserScenes() {
  const game = getGame()

  game?.scene.resume('SceneP1')
  game?.scene.resume('SceneP2')
  game?.scene.resume('HUDScene')
}

function pauseGame() {
  invStore.closeAll()
  gameStore.pauseGame()
  isPaused.value = true
  pausePhaserScenes()
}

function resumeGame() {
  gameStore.resumeGame()
  isPaused.value = false
  resumePhaserScenes()
}

function goHome() {
  resumePhaserScenes()
  isPaused.value = false
  router.push('/')
}

function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'i': case 'I':
      invStore.toggleInventory(1)
      break
    case 'o': case 'O':
      invStore.toggleInventory(2)
      break
    case 'Escape':
    e.preventDefault()

    if (isPaused.value) {
    resumeGame()
    } else {
    pauseGame()
    }
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

.pause-overlay {
  position: absolute;
  inset: 0;
  z-index: 5000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-panel {
  border: 1px solid #2a2a2a;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(6, 6, 6, 0.95);
}

.pause-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.5rem;
  font-weight: normal;
  letter-spacing: 0.25em;
  color: #999;
  margin-bottom: 8px;
}

.pause-divider {
  width: 100%;
  height: 1px;
  background: #1e1e1e;
  margin-bottom: 8px;
}

.pause-btn {
  width: 260px;
  padding: 10px;
  background: transparent;
  border: 1px solid #222;
  color: #666;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  cursor: pointer;
  transition: all 150ms ease;
}

.pause-btn:hover {
  border-color: #444;
  color: #aaa;
}
</style>