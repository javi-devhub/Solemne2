<template>
  <div v-if="active" class="shadow-pressure" :style="vignetteStyle">
    <svg
      class="shadow-figure shadow-figure--left"
      :style="figureStyle(false)"
      viewBox="0 0 120 400"
      preserveAspectRatio="xMidYMax meet"
    >
      <path :d="figurePath" />
    </svg>
    <svg
      class="shadow-figure shadow-figure--right"
      :style="figureStyle(true)"
      viewBox="0 0 120 400"
      preserveAspectRatio="xMidYMax meet"
    >
      <path :d="figurePath" />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps<{ active: boolean; progress: number }>()

// Silueta simple (cabeza + cuerpo alargado, brazos caídos). Placeholder
// dibujado en SVG — reemplazar por un sprite/animación real cuando haya arte.
const figurePath =
  'M60 40 C78 40 90 55 90 75 C90 92 80 102 68 106 L74 130 L100 260 L92 400 L28 400 L20 260 L46 130 L52 106 C40 102 30 92 30 75 C30 55 42 40 60 40 Z'

// progress 0 → la sombra apenas se insinúa en el borde de la pantalla.
// progress 1 → está junto a las jugadoras, casi al centro.
function figureStyle(mirrored: boolean) {
  const travelVw = props.progress * 55
  const opacity = Math.min(1, 0.12 + props.progress * 0.85)
  const scaleY = 0.85 + props.progress * 0.3

  const translate = mirrored ? `-${travelVw}vw` : `${travelVw}vw`
  const flip = mirrored ? ' scaleX(-1)' : ''

  return {
    opacity,
    transform: `translateX(${translate}) scaleY(${scaleY})${flip}`,
  }
}

const vignetteStyle = computed(() => ({
  '--pressure-alpha': String(Math.min(0.55, props.progress * 0.55)),
}))
</script>

<style scoped>
.shadow-pressure {
  position: fixed;
  inset: 0;
  z-index: 900;
  pointer-events: none;
  overflow: hidden;
  background: radial-gradient(circle at center, transparent 40%, rgba(0, 0, 0, var(--pressure-alpha)) 100%);
  transition: background 400ms ease;
}

.shadow-figure {
  position: absolute;
  bottom: 0;
  width: 22vw;
  height: 100vh;
  fill: #000;
  filter: drop-shadow(0 0 40px rgba(0, 0, 0, 0.9)) blur(1px);
  transition: transform 600ms linear, opacity 600ms linear;
  animation: shadowSway 3.4s ease-in-out infinite;
}

.shadow-figure--left {
  left: 0;
  transform-origin: bottom left;
}

.shadow-figure--right {
  right: 0;
  transform-origin: bottom right;
}

@keyframes shadowSway {
  0%, 100% { margin-bottom: 0; }
  50%      { margin-bottom: -4px; }
}
</style>
