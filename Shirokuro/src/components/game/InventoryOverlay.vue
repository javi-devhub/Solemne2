<template>
  <Transition name="inv">
    <div v-if="isOpen" class="inventory" :class="`inventory--p${playerId}`">

      <div class="inv-header">
        <span class="inv-title">INVENTARIO — J{{ playerId }}</span>
        <span class="inv-close">[ {{ closeKey }} ]</span>
      </div>

      <div class="inv-divider" />

      <div class="inv-grid">
        <div
          v-for="slot in SLOTS"
          :key="slot"
          class="inv-slot"
          :class="{ 'inv-slot--filled': items[slot - 1] }"
        >
          <template v-if="items[slot - 1]">
            <span class="inv-slot-icon">{{ items[slot - 1]?.icon }}</span>
            <span class="inv-slot-name">{{ items[slot - 1]?.name }}</span>
          </template>
          <span v-else class="inv-slot-empty">—</span>
        </div>
      </div>

      <div class="inv-divider" />

      <p class="inv-hint">
        Selecciona un objeto para inspeccionarlo.
      </p>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { Item } from '@/types/item'

const SLOTS = 6

const props = defineProps<{
  playerId: 1 | 2
  isOpen:   boolean
  items:    (Item | null)[]
  closeKey: string
}>()
</script>

<style scoped>
.inventory {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 280px;
  border: 1px solid #2a2a2a;
  background: rgba(4, 4, 4, 0.96);
  padding: 18px 20px;
  z-index: 100;
  pointer-events: all;
}

/* J1 → mitad izquierda, centrado */
.inventory--p1 {
  left: 50px;
}

/* J2 → mitad derecha, centrado */
.inventory--p2 {
  left: calc(50% + 50px);
}

/* ── Header ── */
.inv-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.inv-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  color: #888;
}

.inv-close {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.6rem;
  color: #333;
  letter-spacing: 0.1em;
}

/* ── Divider ── */
.inv-divider {
  width: 100%;
  height: 1px;
  background: #1a1a1a;
  margin-bottom: 12px;
}

/* ── Grid ── */
.inv-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 6px;
  margin-bottom: 12px;
}

.inv-slot {
  border: 1px solid #1a1a1a;
  height: 64px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  background: #070707;
  transition: border-color 120ms ease;
}

.inv-slot--filled {
  border-color: #2e2e2e;
  cursor: pointer;
}

.inv-slot--filled:hover {
  border-color: #444;
  background: #0d0d0d;
}

.inv-slot-icon {
  font-size: 1.2rem;
  line-height: 1;
}

.inv-slot-name {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #555;
  letter-spacing: 0.1em;
  text-align: center;
}

.inv-slot-empty {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  color: #1e1e1e;
}

/* ── Hint ── */
.inv-hint {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.58rem;
  color: #2a2a2a;
  letter-spacing: 0.08em;
  text-align: center;
}

/* ── Transición ── */
.inv-enter-active,
.inv-leave-active {
  transition: opacity 150ms ease, transform 150ms ease;
}
.inv-enter-from,
.inv-leave-to {
  opacity: 0;
  transform: translateY(calc(-50% + 8px));
}
</style>