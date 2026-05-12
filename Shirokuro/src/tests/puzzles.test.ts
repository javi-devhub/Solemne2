import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { usePuzzleStore } from '@/stores/puzzleStore'
import type { Puzzle } from '@/types/puzzle'

describe('PuzzleSystem', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('registers a puzzle correctly', () => {
    const store = usePuzzleStore()
    const puzzle: Puzzle = {
      id: 'p1',
      name: 'Test Puzzle',
      description: 'desc',
      state: 'locked',
      requiresBothPlayers: true,
      solution: 'abc',
    }
    store.registerPuzzle(puzzle)
    expect(store.puzzles).toHaveLength(1)
    expect(store.isSolved('p1')).toBe(false)
  })

  it('solves a puzzle and marks it as solved', () => {
    const store = usePuzzleStore()
    const puzzle: Puzzle = {
      id: 'p2',
      name: 'Test Puzzle 2',
      description: 'desc',
      state: 'active',
      requiresBothPlayers: false,
      solution: 'xyz',
    }
    store.registerPuzzle(puzzle)
    store.solvePuzzle('p2')
    expect(store.isSolved('p2')).toBe(true)
  })

  it('does not register duplicate puzzles', () => {
    const store = usePuzzleStore()
    const puzzle: Puzzle = { id: 'p3', name: 'dup', description: '', state: 'locked', requiresBothPlayers: false, solution: '' }
    store.registerPuzzle(puzzle)
    store.registerPuzzle(puzzle)
    expect(store.puzzles).toHaveLength(1)
  })
})
