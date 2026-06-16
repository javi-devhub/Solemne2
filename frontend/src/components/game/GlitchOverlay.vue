<template>
  <Transition name="glitch">
    <div v-if="active" class="glitch-overlay">
      <div class="glitch-bar" v-for="n in 6" :key="n" :style="barStyle(n)" />
      <div class="glitch-scanline" />
      <div class="glitch-rgb-r" />
      <div class="glitch-rgb-b" />
      <div class="glitch-text">ERROR</div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { watch } from 'vue'

const props = defineProps<{ active: boolean }>()

const audio = new Audio('/audio/glitch1.mp3')
audio.volume = 0.7

watch(() => props.active, (val) => {
  console.log('glitch watch:', val)
  if (val) {
    console.log('intentando reproducir glitch audio')
    audio.currentTime = 0
    audio.volume = 0.7
    audio.play().catch((e) => console.log('error:', e))

    setTimeout(() => {
      const fadeInterval = setInterval(() => {
        if (audio.volume > 0.05) {
          audio.volume = Math.max(0, audio.volume - 0.1)
        } else {
          audio.volume = 0
          audio.pause()
          audio.currentTime = 0
          clearInterval(fadeInterval)
        }
      }, 30)
    }, 500)
  }
})

function barStyle(n: number) {
  const top    = Math.random() * 100
  const height = Math.random() * 6 + 1
  const offset = (Math.random() - 0.5) * 30
  return {
    top:       `${top}%`,
    height:    `${height}px`,
    transform: `translateX(${offset}px)`,
    opacity:   Math.random() * 0.6 + 0.2,
  }
}
</script>

<style scoped>
.glitch-overlay {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 999;
  overflow: hidden;
}

/* Barras horizontales desplazadas */
.glitch-bar {
  position: absolute;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.08);
  animation: glitchBar 120ms steps(1) infinite;
}

@keyframes glitchBar {
  0%   { transform: translateX(-20px); opacity: 0.3; }
  25%  { transform: translateX(15px);  opacity: 0.6; }
  50%  { transform: translateX(-8px);  opacity: 0.2; }
  75%  { transform: translateX(22px);  opacity: 0.5; }
  100% { transform: translateX(0px);   opacity: 0.3; }
}

/* Scanline que baja */
.glitch-scanline {
  position: absolute;
  left: 0;
  right: 0;
  height: 3px;
  background: rgba(255, 255, 255, 0.06);
  animation: scanDown 80ms linear infinite;
}

@keyframes scanDown {
  from { top: 0; }
  to   { top: 100%; }
}

/* Aberración cromática rojo */
.glitch-rgb-r {
  position: absolute;
  inset: 0;
  background: transparent;
  mix-blend-mode: screen;
  animation: rgbR 150ms steps(2) infinite;
  box-shadow: inset 3px 0 0 rgba(255, 0, 0, 0.15),
              inset -3px 0 0 rgba(255, 0, 0, 0.08);
}

@keyframes rgbR {
  0%  { transform: translateX(-4px); opacity: 1; }
  50% { transform: translateX(4px);  opacity: 0.5; }
  100%{ transform: translateX(-2px); opacity: 1; }
}

/* Aberración cromática azul */
.glitch-rgb-b {
  position: absolute;
  inset: 0;
  animation: rgbB 150ms steps(2) infinite;
  box-shadow: inset 3px 0 0 rgba(0, 80, 255, 0.12),
              inset -3px 0 0 rgba(0, 80, 255, 0.06);
}

@keyframes rgbB {
  0%  { transform: translateX(4px);  opacity: 1; }
  50% { transform: translateX(-4px); opacity: 0.5; }
  100%{ transform: translateX(2px);  opacity: 1; }
}

/* Texto ERROR fugaz */
.glitch-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.7rem;
  letter-spacing: 0.4em;
  color: rgba(255, 255, 255, 0.12);
  animation: glitchText 100ms steps(1) infinite;
}

@keyframes glitchText {
  0%   { opacity: 0.12; transform: translate(-52%, -50%); }
  33%  { opacity: 0;    transform: translate(-48%, -50%); }
  66%  { opacity: 0.18; transform: translate(-50%, -52%); }
  100% { opacity: 0.12; transform: translate(-50%, -50%); }
}

/* Entrada y salida */
.glitch-enter-active { animation: glitchIn 60ms ease forwards; }
.glitch-leave-active { animation: glitchOut 200ms ease forwards; }

@keyframes glitchIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes glitchOut {
  from { opacity: 1; }
  to   { opacity: 0; }
}
</style>