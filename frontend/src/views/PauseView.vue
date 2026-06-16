<template>
  <div class="overlay-view">
    <div class="overlay-panel">
      <h2 class="overlay-title">PAUSA</h2>
      <div class="overlay-divider" />
      <button class="overlay-btn" @click="resumeGame">CONTINUAR</button>
      <button class="overlay-btn" @click="goHome">MENÚ PRINCIPAL</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'

const router = useRouter()
const gameStore = useGameStore()

function resumeGame() {
  gameStore.resumeGame()
  router.push('/game')
}

function goHome() {
  router.push('/')
}
</script>

<style scoped>
.overlay-view {
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.overlay-panel {
  border: 1px solid #2a2a2a;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(6,6,6,0.95);
}

.overlay-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.5rem;
  font-weight: normal;
  letter-spacing: 0.25em;
  color: #999;
  margin-bottom: 8px;
}

.overlay-divider {
  width: 100%;
  height: 1px;
  background: #1e1e1e;
  margin-bottom: 8px;
}

.overlay-btn {
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

.overlay-btn:hover {
  border-color: #444;
  color: #aaa;
}
</style>
