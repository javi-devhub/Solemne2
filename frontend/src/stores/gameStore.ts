import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { GameProgressPayload } from '../services/progressService'

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
  const tension = ref<number>(0)
  const sessionTime = ref<number>(0)
  const savedProgress = ref<GameProgressPayload | null>(null)

  function setPhase(newPhase: GamePhase) {
    phase.value = newPhase
  }

  function setHasSave(value: boolean) {
    hasSave.value = value
  }

  function setSavedProgress(progress: GameProgressPayload | null) {
    savedProgress.value = progress
    hasSave.value = Boolean(progress)

    if (progress?.flags) {
      const flags = progress.flags as {
        currentScene?: number
        tension?: number
        sessionTime?: number
      }

      currentScene.value = flags.currentScene ?? currentScene.value
      tension.value = flags.tension ?? tension.value
      sessionTime.value = flags.sessionTime ?? sessionTime.value
    }
  }

  function startNewGame() {
    phase.value = 'intro'
    currentScene.value = 1
    tension.value = 0
    sessionTime.value = 0
    savedProgress.value = null
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
    savedProgress,
    setPhase,
    setHasSave,
    setSavedProgress,
    startNewGame,
    advanceScene,
    pauseGame,
    resumeGame,
    triggerDefeat,
    triggerVictory,
  }
})