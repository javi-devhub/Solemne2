import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useGlitchStore = defineStore('glitch', () => {
  const active   = ref(false)
  let   timeout: ReturnType<typeof setTimeout> | null = null

  function trigger(durationMs = 600) {
    // Si ya hay uno activo, lo reinicia
    if (timeout) clearTimeout(timeout)

    active.value = true
    timeout = setTimeout(() => {
      active.value = false
      timeout = null
    }, durationMs)
  }

  function stop() {
    if (timeout) clearTimeout(timeout)
    active.value = false
    timeout = null
  }

  return { active, trigger, stop }
})