import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useScreamerStore = defineStore('screamer', () => {
  const active = ref(false)
  let screamerTimeout: ReturnType<typeof setTimeout> | null = null
  let randomInterval: ReturnType<typeof setTimeout> | null = null

  function trigger(durationMs = 1200) {
    if (active.value) return
    if (screamerTimeout) clearTimeout(screamerTimeout)
    active.value = true
    screamerTimeout = setTimeout(() => {
      active.value = false
      screamerTimeout = null
    }, durationMs)
  }

  // Dispara el screamer en intervalos aleatorios entre minMs y maxMs
  function startRandom(minMs = 15000, maxMs = 45000) {
    stopRandom()
    const schedule = () => {
      const delay = Math.random() * (maxMs - minMs) + minMs
      randomInterval = setTimeout(() => {
        trigger(1200)
        schedule()
      }, delay)
    }
    schedule()
  }

  function stopRandom() {
    if (randomInterval) clearTimeout(randomInterval)
    randomInterval = null
  }

  function stop() {
    if (screamerTimeout) clearTimeout(screamerTimeout)
    if (randomInterval)  clearTimeout(randomInterval)
    active.value = false
    screamerTimeout = null
    randomInterval  = null
  }

  return { active, trigger, startRandom, stopRandom, stop }
})