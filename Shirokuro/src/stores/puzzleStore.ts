import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Puzzle } from '@/types/puzzle'

export const usePuzzleStore = defineStore('puzzle', () => {
  const puzzles = ref<Puzzle[]>([])
  const activePuzzleId = ref<string | null>(null)

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
      if (puzzle && puzzle.state === 'locked') {
        puzzle.state = 'active'
      }
    }
  }

  function isSolved(puzzleId: string): boolean {
    return puzzles.value.find(p => p.id === puzzleId)?.state === 'solved'
  }

  function resetAll() {
    puzzles.value = []
    activePuzzleId.value = null
  }

  return {
    puzzles,
    activePuzzleId,
    registerPuzzle,
    solvePuzzle,
    setActivePuzzle,
    isSolved,
    resetAll,
  }
})
