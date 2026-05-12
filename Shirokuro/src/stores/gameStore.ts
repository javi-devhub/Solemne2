import { defineStore } from 'pinia'
import { ref } from 'vue'

export type GamePhase =
  | 'menu'
  | 'intro'
  | 'playing'
  | 'paused'
  | 'puzzle'
  | 'event'
  | 'victory'
  | 'defeat'

export const useGameStore = defineStore('game', () => {
  const phase = ref<GamePhase>('menu')
  const currentScene = ref<number>(1)
  const hasSave = ref<boolean>(false)
  const tension = ref<number>(0) // 0–100, increases difficulty
  const sessionTime = ref<number>(0)

  function setPhase(newPhase: GamePhase) {
    phase.value = newPhase
  }

  function startNewGame() {
    phase.value = 'intro'
    currentScene.value = 1
    tension.value = 0
    sessionTime.value = 0
  }

  function advanceScene() {
    currentScene.value++
    tension.value = Math.min(100, tension.value + 15)
  }

  function pauseGame() {
    if (phase.value === 'playing') {
      phase.value = 'paused'
    }
  }

  function resumeGame() {
    if (phase.value === 'paused') {
      phase.value = 'playing'
    }
  }

  function triggerDefeat() {
    phase.value = 'defeat'
  }

  function triggerVictory() {
    phase.value = 'victory'
  }

  return {
    phase,
    currentScene,
    hasSave,
    tension,
    sessionTime,
    setPhase,
    startNewGame,
    advanceScene,
    pauseGame,
    resumeGame,
    triggerDefeat,
    triggerVictory,
  }
})
