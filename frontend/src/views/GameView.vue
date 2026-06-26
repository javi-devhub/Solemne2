<template>
  <div class="game-view">
    <GameCanvas />

    <InventoryOverlay
      :playerId="1"
      :isOpen="invStore.inv1Open"
      :items="invStore.player1Items"
      closeKey="I"
    />
    <InventoryOverlay
      :playerId="2"
      :isOpen="invStore.inv2Open"
      :items="invStore.player2Items"
      closeKey="O"
    />

    <div v-if="isPaused" class="pause-overlay">
      <div class="pause-panel">
        <h2 class="pause-title">PAUSA</h2>
        <div class="pause-divider" />
        <button class="pause-btn" @click="resumeGame">CONTINUAR</button>
        <button class="pause-btn" @click="handleSaveGame">GUARDAR PARTIDA</button>
        <button class="pause-btn" @click="goHome">MENÚ PRINCIPAL</button>
      </div>
    </div>

    <!-- Overlays fuera del panel de pausa para que cubran toda la pantalla -->
    <GlitchOverlay :active="glitchStore.active" />
    <ScreamerOverlay :active="screamerStore.active" />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import GameCanvas        from '@/components/game/GameCanvas.vue'
import InventoryOverlay  from '@/components/game/InventoryOverlay.vue'
import GlitchOverlay     from '@/components/game/GlitchOverlay.vue'
import ScreamerOverlay   from '@/components/game/ScreamerOverlay.vue'
import { useInventoryStore }  from '@/stores/inventoryStore'
import { useGameStore }       from '@/stores/gameStore'
import { useGlitchStore }     from '@/stores/glitchStore'
import { useScreamerStore }   from '@/stores/screamerStore'
import { gameBus }            from '@/composables/useGameEventBus'
import { getGame }            from '@/game/mainGame'
import { usePlayerStore }     from '@/stores/playerStore'
import { usePuzzleStore }     from '@/stores/puzzleStore'
import { saveProgress }       from '@/services/progressService'

const router        = useRouter()
const invStore      = useInventoryStore()
const gameStore     = useGameStore()
const glitchStore   = useGlitchStore()
const screamerStore = useScreamerStore()
const playerStore   = usePlayerStore()
const puzzleStore   = usePuzzleStore()

const isPaused = ref(false)

function pausePhaserScenes() {
  const game = getGame()
  game?.scene.pause('SceneP1')
  game?.scene.pause('SceneP2')
  game?.scene.pause('HUDScene')
}

function resumePhaserScenes() {
  const game = getGame()
  game?.scene.resume('SceneP1')
  game?.scene.resume('SceneP2')
  game?.scene.resume('HUDScene')
}

function pauseGame() {
  invStore.closeAll()
  gameStore.pauseGame()
  isPaused.value = true
  pausePhaserScenes()
}

function resumeGame() {
  gameStore.resumeGame()
  isPaused.value = false
  resumePhaserScenes()
}

function goHome() {
  resumePhaserScenes()
  isPaused.value = false
  router.push('/')
}

async function handleSaveGame() {
  try {
    console.log('Estado puzzle antes de guardar:', {
  puzzle01Solved: puzzleStore.puzzle01Solved,
  p1Sequence: puzzleStore.p1Sequence,
  correctSequence: puzzleStore.correctSequence,
})
    const progress = await saveProgress({
      scene: `SceneP${gameStore.currentScene}`,
      players: {
        p1: {
          position: playerStore.player1.position,
          health: playerStore.player1.health,
          sanity: playerStore.player1.sanity,
          isAlive: playerStore.player1.isAlive,
        },
        p2: {
          position: playerStore.player2.position,
          health: playerStore.player2.health,
          sanity: playerStore.player2.sanity,
          isAlive: playerStore.player2.isAlive,
        },
      },
      inventory: {
        p1: invStore.player1Items,
        p2: invStore.player2Items,
      },
      solvedPuzzles: puzzleStore.puzzle01Solved ? ['puzzle-01'] : [],
      flags: {
        currentScene: gameStore.currentScene,
        tension: gameStore.tension,
        sessionTime: gameStore.sessionTime,
        puzzle01Solved: puzzleStore.puzzle01Solved,
        p1Sequence: puzzleStore.p1Sequence,
      },
      playTimeSeconds: gameStore.sessionTime,
    })

    gameStore.setHasSave(true)
    console.log('Partida guardada:', progress)
    alert('Partida guardada correctamente')
  } catch (error) {
    console.error('Error al guardar partida:', error)
    alert('No se pudo guardar la partida. Revisa si estás logeado.')
  }
}

function applyLoadedProgressToStores() {
  const progress = gameStore.savedProgress
  if (!progress) return

  console.log('Aplicando progreso cargado antes de iniciar GameCanvas:', progress)

  const flags = progress.flags as {
    currentScene?: number
    tension?: number
    sessionTime?: number
    puzzle01Solved?: boolean
    p1Sequence?: string[]
  }

  const solvedPuzzles = progress.solvedPuzzles ?? []
  const savedSequence = Array.isArray(flags?.p1Sequence)
    ? flags.p1Sequence
    : []

  const puzzle01WasSolved =
    flags?.puzzle01Solved === true || solvedPuzzles.includes('puzzle-01')

  // Restaurar progreso parcial del jugador 1
  puzzleStore.p1Sequence = [...savedSequence]

  // Restaurar resultado visual/lógico básico
  if (puzzle01WasSolved) {
    puzzleStore.puzzle01Solved = true
    puzzleStore.p1Sequence = [...puzzleStore.correctSequence]
    puzzleStore.lastActionResult = 'correct'
  } else if (savedSequence.length > 0) {
    puzzleStore.puzzle01Solved = false
    puzzleStore.lastActionResult = 'correct'
  }

  console.log('Estado puzzle después de aplicar carga:', {
    puzzle01Solved: puzzleStore.puzzle01Solved,
    p1Sequence: puzzleStore.p1Sequence,
    lastActionResult: puzzleStore.lastActionResult,
  })
}

function applyLoadedProgressToRegisteredPuzzles() {
  const progress = gameStore.savedProgress
  if (!progress) return

  const flags = progress.flags as {
    puzzle01Solved?: boolean
    p1Sequence?: string[]
  }

  const solvedPuzzles = progress.solvedPuzzles ?? []
  const savedSequence = Array.isArray(flags?.p1Sequence)
    ? flags.p1Sequence
    : []

  const puzzle01WasSolved =
    flags?.puzzle01Solved === true || solvedPuzzles.includes('puzzle-01')

  if (puzzle01WasSolved) {
    puzzleStore.puzzle01Solved = true
    puzzleStore.p1Sequence = [...puzzleStore.correctSequence]
    puzzleStore.lastActionResult = 'correct'
    puzzleStore.solvePuzzle('puzzle-01')
  } else if (savedSequence.length > 0) {
    puzzleStore.p1Sequence = [...savedSequence]
    puzzleStore.lastActionResult = 'correct'
  }

  console.log('Estado puzzle después de registrar escenas:', {
    puzzle01Solved: puzzleStore.puzzle01Solved,
    p1Sequence: puzzleStore.p1Sequence,
    puzzles: puzzleStore.puzzles,
  })
}

function onKeyDown(e: KeyboardEvent) {
  switch (e.key) {
    case 'i': case 'I':
      invStore.toggleInventory(1)
      break
    case 'o': case 'O':
      invStore.toggleInventory(2)
      break
    case 'Escape':
      e.preventDefault()
      if (isPaused.value) resumeGame()
      else pauseGame()
      break
  }
}

applyLoadedProgressToStores()

onMounted(() => {
  gameStore.setPhase('playing')

  applyLoadedProgressToRegisteredPuzzles()

  setTimeout(() => {
    applyLoadedProgressToRegisteredPuzzles()
  }, 300)

  setTimeout(() => {
    applyLoadedProgressToRegisteredPuzzles()
  }, 1000)

  window.addEventListener('keydown', onKeyDown)

  gameBus.on('glitch:trigger', (ms) => {
    console.log('glitch:trigger recibido en GameView', ms)
    glitchStore.trigger(ms)
  })

  screamerStore.startRandom(15000, 45000)
})

onUnmounted(() => {
  window.removeEventListener('keydown', onKeyDown)
  invStore.closeAll()
  gameBus.off('p1:proximity')
  gameBus.off('p2:proximity')
  gameBus.off('p1:interact')
  gameBus.off('p2:interact')
  gameBus.off('glitch:trigger')
  screamerStore.stop()
})
</script>

<style scoped>
.game-view {
  position: relative;
  width: 100vw;
  height: 100vh;
  background: #000;
  overflow: hidden;
}

.pause-overlay {
  position: absolute;
  inset: 0;
  z-index: 5000;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.92);
  display: flex;
  align-items: center;
  justify-content: center;
}

.pause-panel {
  border: 1px solid #2a2a2a;
  padding: 40px 60px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  background: rgba(6, 6, 6, 0.95);
}

.pause-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.5rem;
  font-weight: normal;
  letter-spacing: 0.25em;
  color: #999;
  margin-bottom: 8px;
}

.pause-divider {
  width: 100%;
  height: 1px;
  background: #1e1e1e;
  margin-bottom: 8px;
}

.pause-btn {
  width: 260px;
  padding: 10px;
  background: transparent;
  border: 1px solid #222;
  color: #666;
  font-family: 'Share Tech Mono', monospace;
  font-size: 0.8rem;
  letter-spacing: 0.18em;
  cursor: pointer;
  transition: all 150ms ease;
}

.pause-btn:hover {
  border-color: #444;
  color: #aaa;
}
</style>