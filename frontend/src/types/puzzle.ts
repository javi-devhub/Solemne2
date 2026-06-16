export type PuzzleState = 'locked' | 'active' | 'solved'

export interface Puzzle {
  id: string
  name: string
  description: string
  state: PuzzleState
  requiresBothPlayers: boolean
  player1Clue?: string
  player2Clue?: string
  solution: string
}
