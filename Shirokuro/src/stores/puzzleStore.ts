import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Puzzle } from '@/types/puzzle'

export type ActionResult = 'correct' | 'wrong' | 'idle'

export const usePuzzleStore = defineStore('puzzle', () => {
  const puzzles        = ref<Puzzle[]>([])
  const activePuzzleId = ref<string | null>(null)

  // Puzzle 01 — secuencia de acciones
  const p1Sequence     = ref<string[]>([])   // acciones ejecutadas
  const correctSequence = ['girar', 'presionar', 'soltar']
  const lastActionResult = ref<ActionResult>('idle')
  const puzzle01Solved  = ref(false)

  function registerPuzzle(puzzle: Puzzle) {
    if (!puzzles.value.find(p => p.id === puzzle.id)) {
      puzzles.value.push(puzzle)
    }
  }

  function solvePuzzle(puzzleId: string) {
    const puzzle = puzzles.value.find(p => p.id === puzzleId)
    if (puzzle) {
      puzzle.state = 'solved'
      activePuzzleId.value = null
    }
  }

  function setActivePuzzle(puzzleId: string | null) {
    activePuzzleId.value = puzzleId
    if (puzzleId) {
      const puzzle = puzzles.value.find(p => p.id === puzzleId)
      if (puzzle && puzzle.state === 'locked') puzzle.state = 'active'
    }
  }

  function isSolved(puzzleId: string): boolean {
    return puzzles.value.find(p => p.id === puzzleId)?.state === 'solved'
  }

  // Ejecutar una acción de la secuencia del puzzle 01
  function executeAction(actionId: string): ActionResult {
    if (puzzle01Solved.value) return 'idle'

    const expected = correctSequence[p1Sequence.value.length]
    if (actionId === expected) {
      p1Sequence.value.push(actionId)
      if (p1Sequence.value.length === correctSequence.length) {
        puzzle01Solved.value = true
        solvePuzzle('puzzle-01')
        lastActionResult.value = 'correct'
      } else {
        lastActionResult.value = 'correct'
      }
    } else {
      p1Sequence.value = []   // reset secuencia
      lastActionResult.value = 'wrong'
    }
    return lastActionResult.value
  }

  function resetAll() {
    puzzles.value         = []
    activePuzzleId.value  = null
    p1Sequence.value      = []
    puzzle01Solved.value  = false
    lastActionResult.value = 'idle'
  }

  return {
    puzzles,
    activePuzzleId,
    p1Sequence,
    correctSequence,
    lastActionResult,
    puzzle01Solved,
    registerPuzzle,
    solvePuzzle,
    setActivePuzzle,
    isSolved,
    executeAction,
    resetAll,
  }
})