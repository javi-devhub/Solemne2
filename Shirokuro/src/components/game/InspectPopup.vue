<template>
  <Transition name="popup">
    <div
      v-if="visible"
      class="popup"
      :style="{ left: screenX + 'px', top: screenY + 'px' }"
    >
      <!-- Prompt de proximidad -->
      <div v-if="mode === 'prompt'" class="popup-prompt">
        {{ text }}
      </div>

      <!-- Descripción al inspeccionar -->
      <div v-else-if="mode === 'inspect'" class="popup-inspect">
        <p class="popup-text">{{ text }}</p>
        <div class="popup-divider" />
        <span class="popup-close">[ {{ closeKey }} ] Cerrar</span>
      </div>

      <!-- Acciones del puzzle -->
      <div v-else-if="mode === 'actions'" class="popup-actions">
        <p class="popup-text">{{ text }}</p>
        <div class="popup-divider" />
        <div class="action-list">
          <button
            v-for="action in actions"
            :key="action.id"
            class="action-btn"
            :class="{
              'action-btn--done':    completedActions.includes(action.id),
              'action-btn--next':    isNextAction(action.id),
              'action-btn--wrong':   lastResult === 'wrong',
            }"
            @click="$emit('action', action.id)"
          >
            {{ action.label }}
          </button>
        </div>
        <span class="popup-close">[ {{ closeKey }} ] Cerrar</span>
      </div>

    </div>
  </Transition>
</template>

<script setup lang="ts">
import type { PuzzleAction } from '@/types/interactable'
import type { ActionResult } from '@/stores/puzzleStore'

const props = defineProps<{
  visible:          boolean
  mode:             'prompt' | 'inspect' | 'actions'
  text:             string
  screenX:          number
  screenY:          number
  closeKey:         string
  actions?:         PuzzleAction[]
  completedActions: string[]
  lastResult:       ActionResult
}>()

defineEmits<{
  (e: 'action', actionId: string): void
}>()

function isNextAction(actionId: string): boolean {
  if (!props.actions) return false
  const next = props.actions.find(
    a => !props.completedActions.includes(a.id)
  )
  return next?.id === actionId
}
</script>

<style scoped>
.popup {
  position: absolute;
  transform: translate(-50%, -100%);
  margin-top: -12px;
  z-index: 200;
  pointer-events: none;
  min-width: 180px;
  max-width: 240px;
}

/* ── Prompt simple ── */
.popup-prompt {
  background: rgba(4, 4, 4, 0.9);
  border: 1px solid #222;
  padding: 5px 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.62rem;
  color: #555;
  letter-spacing: 0.1em;
  white-space: nowrap;
  text-align: center;
}

/* ── Inspect ── */
.popup-inspect,
.popup-actions {
  background: rgba(4, 4, 4, 0.95);
  border: 1px solid #2a2a2a;
  padding: 12px 14px;
  pointer-events: all;
}

.popup-text {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  color: #666;
  letter-spacing: 0.05em;
  line-height: 1.6;
  white-space: pre-line;
  margin-bottom: 8px;
}

.popup-divider {
  width: 100%;
  height: 1px;
  background: #1a1a1a;
  margin-bottom: 8px;
}

.popup-close {
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.55rem;
  color: #2a2a2a;
  letter-spacing: 0.1em;
}

/* ── Acciones ── */
.action-list {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 8px;
}

.action-btn {
  width: 100%;
  padding: 6px 10px;
  background: transparent;
  border: 1px solid #1e1e1e;
  color: #444;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.65rem;
  letter-spacing: 0.15em;
  cursor: pointer;
  text-align: left;
  transition: all 100ms ease;
  pointer-events: all;
}

.action-btn--next {
  border-color: #333;
  color: #888;
}

.action-btn--next:hover {
  border-color: #444;
  color: #aaa;
  background: rgba(255,255,255,0.03);
}

.action-btn--done {
  color: #2a2a2a;
  border-color: #111;
  text-decoration: line-through;
}

.action-btn--wrong {
  border-color: #3a1010;
  color: #5a2020;
}

/* ── Transición ── */
.popup-enter-active,
.popup-leave-active {
  transition: opacity 120ms ease, transform 120ms ease;
}
.popup-enter-from,
.popup-leave-to {
  opacity: 0;
  transform: translate(-50%, calc(-100% + 6px));
}
</style>