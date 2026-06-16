import Phaser from 'phaser'
import { createPhaserConfig } from './phaserConfig'

let gameInstance: Phaser.Game | null = null

export function initGame(parent: HTMLElement): Phaser.Game {
  if (gameInstance) {
    gameInstance.destroy(true)
  }
  const config = createPhaserConfig(parent)
  gameInstance = new Phaser.Game(config)
  return gameInstance
}

export function destroyGame(): void {
  if (gameInstance) {
    gameInstance.destroy(true)
    gameInstance = null
  }
}

export function getGame(): Phaser.Game | null {
  return gameInstance
}
