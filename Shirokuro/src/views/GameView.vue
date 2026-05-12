<template>
  <div class="game-view">
    <GameCanvas />
  </div>
</template>

<script setup lang="ts">
import GameCanvas from '@/components/game/GameCanvas.vue'
import { useGameStore } from '@/stores/gameStore'
import { onMounted, onUnmounted } from 'vue'

const gameStore = useGameStore()

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') gameStore.pauseGame()
}

onMounted(() => {
  gameStore.setPhase('playing')
  window.addEventListener('keydown', onKeyDown)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
})
</script>

<style scoped>
.game-view {
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}
</style>
