<template>
  <div class="overlay-view">
    <div class="overlay-panel">
      <h2 class="overlay-title" style="color: #4a1a1a">NO ESCAPARON</h2>
      <p class="overlay-sub">La oscuridad los consumió.</p>
      <div class="overlay-divider" />
      <button class="overlay-btn" @click="goHome">MENÚ PRINCIPAL</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
const router = useRouter()
function goHome() { router.push('/') }
</script>

<style scoped>
.overlay-view {
  width: 100vw; height: 100vh;
  background: rgba(0,0,0,0.97);
  display: flex; align-items: center; justify-content: center;
}
.overlay-panel {
  border: 1px solid #1a0505; padding: 40px 60px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
  background: rgba(4,2,2,0.99);
}
.overlay-title {
  font-family: 'Share Tech Mono', monospace; font-size: 1.5rem;
  font-weight: normal; letter-spacing: 0.25em; margin-bottom: 4px;
}
.overlay-sub {
  font-family: 'Share Tech Mono', monospace; font-size: 0.7rem;
  color: #2a1010; letter-spacing: 0.1em; margin-bottom: 8px;
}
.overlay-divider { width: 100%; height: 1px; background: #1a0505; margin-bottom: 8px; }
.overlay-btn {
  width: 260px; padding: 10px; background: transparent;
  border: 1px solid #1a0505; color: #4a2020;
  font-family: 'Share Tech Mono', monospace; font-size: 0.8rem;
  letter-spacing: 0.18em; cursor: pointer; transition: all 150ms ease;
}
.overlay-btn:hover { border-color: #3a1010; color: #7a3030; }
</style>
