<template>
  <div class="home-screen">

    <!-- Panel central -->
    <div class="menu-panel" :class="{ visible: ready }">

      <!-- Título -->
      <div class="title-box">
        <h1 class="title">SHIROKURO</h1>
      </div>

      <!-- Tagline -->
      <p class="tagline">— La verdad tiene dos lados. —</p>

      <!-- Botones -->
      <nav class="menu-nav">
        <button
          v-for="(item, idx) in menuItems"
          :key="item.id"
          class="menu-btn"
          :class="{
            active:   selectedIndex === idx,
            disabled: item.disabled,
          }"
          @click="handleClick(item)"
          @mouseenter="selectedIndex = idx"
        >
          <span class="btn-arrow">▶</span>
          {{ item.label }}
        </button>
      </nav>

      <!-- Separador -->
      <div class="divider" />

      <!-- Controles -->
      <div class="controls">
        <div class="player-keys">
          <div class="key-row">
            <span class="key-spacer" /><kbd>W</kbd><span class="key-spacer" />
          </div>
          <div class="key-row">
            <kbd>A</kbd><kbd>S</kbd><kbd>D</kbd>
          </div>
          <span class="player-label">JUGADOR 1</span>
        </div>

        <div class="player-keys">
          <div class="key-row">
            <span class="key-spacer" /><kbd>↑</kbd><span class="key-spacer" />
          </div>
          <div class="key-row">
            <kbd>←</kbd><kbd>↓</kbd><kbd>→</kbd>
          </div>
          <span class="player-label">JUGADOR 2</span>
        </div>
      </div>

    </div>

    <!-- Scanlines -->
    <div class="scanlines" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useGameStore } from '@/stores/gameStore'

const router    = useRouter()
const gameStore = useGameStore()

const ready         = ref(false)
const selectedIndex = ref(0)

interface MenuItem {
  id: string
  label: string
  disabled?: boolean
  action: () => void
}

const menuItems: MenuItem[] = [
  {
    id: 'new',
    label: 'NUEVA PARTIDA',
    action: () => { gameStore.startNewGame(); router.push('/game') },
  },
  {
    id: 'continue',
    label: 'CONTINUAR',
    disabled: !gameStore.hasSave,
    action: () => { if (gameStore.hasSave) router.push('/game') },
  },
  {
    id: 'options',
    label: 'OPCIONES',
    action: () => { /* TODO */ },
  },
  {
    id: 'credits',
    label: 'CRÉDITOS',
    action: () => { /* TODO */ },
  },
  {
    id: 'exit',
    label: 'SALIR',
    action: () => { window.close() },
  },
]

function handleClick(item: MenuItem) {
  if (!item.disabled) item.action()
}

function onKeyDown(e: KeyboardEvent) {
  const len = menuItems.length
  switch (e.key) {
    case 'ArrowUp': case 'w': case 'W':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value - 1 + len) % len
      break
    case 'ArrowDown': case 's': case 'S':
      e.preventDefault()
      selectedIndex.value = (selectedIndex.value + 1) % len
      break
    case 'Enter': case ' ':
      e.preventDefault()
      handleClick(menuItems[selectedIndex.value])
      break
  }
}

onMounted(() => {
  setTimeout(() => { ready.value = true }, 150)
  window.addEventListener('keydown', onKeyDown)
})
onUnmounted(() => window.removeEventListener('keydown', onKeyDown))
</script>

<style scoped>
/* ── Pantalla ───────────────────────────────────── */
.home-screen {
  position: relative;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #080808;
  overflow: hidden;
}

/* ── Panel central ──────────────────────────────── */
.menu-panel {
  position: relative;
  z-index: 2;
  width: min(560px, 88vw);
  border: 1px solid #2e2e2e;
  padding: 36px 44px 30px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;

  opacity: 0;
  transform: translateY(8px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.menu-panel.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Esquinas decorativas */
.menu-panel::before,
.menu-panel::after {
  content: '';
  position: absolute;
  width: 10px;
  height: 10px;
  border-color: #3a3a3a;
  border-style: solid;
}
.menu-panel::before { top: -1px; left: -1px;  border-width: 2px 0 0 2px; }
.menu-panel::after  { bottom: -1px; right: -1px; border-width: 0 2px 2px 0; }

/* ── Título ─────────────────────────────────────── */
.title-box {
  width: 100%;
  border: 1px solid #2e2e2e;
  padding: 14px 20px;
  text-align: center;
  margin-bottom: 14px;
}

.title {
  font-family: 'Share Tech Mono', monospace;
  font-size: clamp(1.6rem, 4vw, 2.2rem);
  font-weight: normal;
  letter-spacing: 0.22em;
  color: #d8d8d8;
  animation: flicker 9s infinite;
}

@keyframes flicker {
  0%, 94%, 96%, 100% { opacity: 1; }
  95%  { opacity: 0.55; }
}

/* ── Tagline ─────────────────────────────────────── */
.tagline {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.68rem;
  letter-spacing: 0.18em;
  color: #444;
  margin-bottom: 22px;
  text-align: center;
}

/* ── Botones ─────────────────────────────────────── */
.menu-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 0;
  margin-bottom: 22px;
}

.menu-btn {
  position: relative;
  width: 100%;
  padding: 11px 16px 11px 32px;
  background: transparent;
  border: 1px solid #1c1c1c;
  border-top: none;
  color: #888;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.82rem;
  letter-spacing: 0.2em;
  text-align: center;
  cursor: pointer;
  transition: color 120ms ease, background 120ms ease, border-color 120ms ease;
}

/* El primer botón tiene borde superior */
.menu-btn:first-child { border-top: 1px solid #1c1c1c; }

.btn-arrow {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  font-size: 0.5rem;
  color: transparent;
  transition: color 120ms ease;
}

.menu-btn.active {
  background: rgba(255, 255, 255, 0.04);
  border-color: #333;
  color: #d8d8d8;
}

.menu-btn.active .btn-arrow {
  color: #555;
}

.menu-btn.disabled {
  opacity: 0.28;
  cursor: not-allowed;
}

/* ── Divisor ─────────────────────────────────────── */
.divider {
  width: 100%;
  height: 1px;
  background: #1c1c1c;
  margin-bottom: 20px;
}

/* ── Controles ───────────────────────────────────── */
.controls {
  width: 100%;
  display: flex;
  justify-content: space-around;
}

.player-keys {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.key-row {
  display: flex;
  gap: 3px;
}

kbd {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;
  border: 1px solid #2a2a2a;
  background: #0d0d0d;
  color: #555;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.72rem;
  font-style: normal;
  border-radius: 0;
}

.key-spacer {
  width: 30px;
  height: 30px;
  display: inline-block;
}

.player-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.58rem;
  letter-spacing: 0.18em;
  color: #383838;
  margin-top: 3px;
}

/* ── Scanlines ───────────────────────────────────── */
.scanlines {
  position: absolute;
  inset: 0;
  background: repeating-linear-gradient(
    0deg,
    transparent,
    transparent 2px,
    rgba(0, 0, 0, 0.07) 2px,
    rgba(0, 0, 0, 0.07) 4px
  );
  pointer-events: none;
  z-index: 1;
}
</style>
