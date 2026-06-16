<template>
  <Transition name="screamer">
    <div v-if="active" class="screamer">
      <img src="/assets/backgrounds/sprites/screamer1.png" class="screamer-img" draggable="false" />
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{ active: boolean }>()

const audio = new Audio('/audio/jumpscare1.mp3')
audio.volume = 1.0

watch(() => props.active, (val) => {
  if (val) {
    audio.currentTime = 0
    audio.play().catch(() => {})
  } else {
    audio.pause()
    audio.currentTime = 0
  }
})
</script>

<style scoped>
.screamer {
  position: fixed;
  inset: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;
  pointer-events: none;
}

.screamer-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.screamer-enter-active { animation: scIn 80ms ease forwards; }
.screamer-leave-active { animation: scOut 400ms ease forwards; }

@keyframes scIn {
  from { opacity: 0; transform: scale(1.04); }
  to   { opacity: 1; transform: scale(1); }
}

@keyframes scOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
</style>