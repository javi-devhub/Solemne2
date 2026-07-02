import { defineStore } from 'pinia'
import { ref } from 'vue'

// ── Configuración de la presión ──────────────────────────────────────────
// Tiempo (ms) que tarda la sombra en llegar desde el borde si nadie se
// equivoca. Ajusta esto para calibrar cuánto "aguantan" las jugadoras.
const TIME_TO_ARRIVE_MS = 90000

// Cuánto avanza la sombra (en una escala de 0 a 1) por cada código
// incorrecto ingresado en el panel. Es un salto fijo, no acumulativo.
const ERROR_STEP = 0.16

/**
 * Estado de la "sombra" que presiona a las jugadoras durante el Puzzle 2
 * ("Las marcas en la pared"). Reemplaza los screamers aleatorios: ahora
 * el susto está atado a una señal visual y a dos causas claras —
 * demora y errores — en vez de aparecer sin motivo.
 */
export const useShadowPressureStore = defineStore('shadowPressure', () => {
  /** true mientras el sistema está corriendo (dentro del Puzzle 2, sin resolver). */
  const active = ref(false)

  /** 0 = la sombra recién aparece en el borde. 1 = llegó hasta las jugadoras. */
  const progress = ref(0)

  let intervalId: ReturnType<typeof setInterval> | null = null
  let lastTick = 0

  function tick() {
    if (!active.value) return
    const now = Date.now()
    const delta = now - lastTick
    lastTick = now
    progress.value = Math.min(1, progress.value + delta / TIME_TO_ARRIVE_MS)
  }

  /** Empieza a correr el sistema desde cero. Llamar al entrar al Puzzle 2. */
  function start() {
    stop()
    progress.value = 0
    active.value = true
    lastTick = Date.now()
    intervalId = setInterval(tick, 100)
  }

  /** Penalización fija por cada código incorrecto ingresado. */
  function registerError() {
    if (!active.value) return
    progress.value = Math.min(1, progress.value + ERROR_STEP)
  }

  /** Reinicia el avance sin detener el sistema (usado tras un screamer). */
  function resetProgress() {
    progress.value = 0
    lastTick = Date.now()
  }

  /** Detiene todo y hace desaparecer la sombra. Llamar al resolver el puzzle o salir de la sala. */
  function stop() {
    active.value = false
    progress.value = 0
    if (intervalId) clearInterval(intervalId)
    intervalId = null
  }

  return { active, progress, start, registerError, resetProgress, stop }
})
