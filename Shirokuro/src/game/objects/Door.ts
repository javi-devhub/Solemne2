import Phaser from 'phaser'

export class Door {
  private scene: Phaser.Scene
  readonly sprite: Phaser.GameObjects.Sprite

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'door-closed') {
    this.scene = scene

    // 1. Creamos la puerta puramente como un elemento visual
    this.sprite = scene.add.sprite(x, y, textureKey)
    this.sprite.setDisplaySize(200, 150) 

    // Filtro pixel art nítido
    if (this.sprite.texture) {
      this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
    }

    // El jugador tiene depth 10, al ponerle 2 la puerta queda dibujada en la pared
    // Esto permite que el personaje camine "por encima" de su base de forma real
    this.sprite.setDepth(2) 

    // 2. Área interactiva para el clic (Phaser adapta esto al displaySize automáticamente)
    this.sprite.setInteractive({ useHandCursor: true })
    this.sprite.on('pointerdown', () => {
      this.openAndTransition()
    })
  }

  private openAndTransition() {
    this.scene.time.delayedCall(300, () => {
      this.scene.scene.stop('SceneP1')
      this.scene.scene.stop('SceneP2')
      this.scene.scene.stop('HUDScene')
      this.scene.scene.start('VoidScene')
    })
  }

  destroy() {
    this.sprite.destroy()
  }
}