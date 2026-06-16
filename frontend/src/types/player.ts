export interface PlayerPosition {
  x: number
  y: number
}

export interface PlayerState {
  id: 1 | 2
  name: string
  position: PlayerPosition
  isMoving: boolean
  facingDirection: 'left' | 'right' | 'up' | 'down'
  health: number
  sanity: number
  isAlive: boolean
}

export type PlayerControls = {
  up: string
  down: string
  left: string
  right: string
  interact: string
}

export const PLAYER_1_CONTROLS: PlayerControls = {
  up: 'w',
  down: 's',
  left: 'a',
  right: 'd',
  interact: 'e',
}

export const PLAYER_2_CONTROLS: PlayerControls = {
  up: 'ArrowUp',
  down: 'ArrowDown',
  left: 'ArrowLeft',
  right: 'ArrowRight',
  interact: 'Enter',
}
