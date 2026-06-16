<template>
  <div ref="canvasRef" class="game-canvas" />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { initGame, destroyGame } from '@/game/mainGame'

const canvasRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (canvasRef.value) {
    initGame(canvasRef.value)
  }
})

onUnmounted(() => {
  destroyGame()
})
</script>

<style scoped>
.game-canvas {
  width: 100%;
  height: 100%;
}
</style>
