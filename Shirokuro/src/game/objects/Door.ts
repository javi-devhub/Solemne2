import Phaser from 'phaser'

export class Door {
  private scene:    Phaser.Scene
  readonly sprite:  Phaser.GameObjects.Sprite
  private obstacle: Phaser.Physics.Arcade.Image | null = null
  private isOpen  = false

  constructor(scene: Phaser.Scene, x: number, y: number, textureKey: string = 'door-closed') {
    this.scene = scene

    this.sprite = scene.add.sprite(x, y, textureKey)
    this.sprite.setDisplaySize(200, 150)

    if (this.sprite.texture) {
      this.sprite.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
    }

    // La puerta queda detrás del jugador (depth 10) pero sobre el fondo
    this.sprite.setDepth(2)

    // Clic → transición de escena (solo si ya está abierta)
    this.sprite.setInteractive({ useHandCursor: true })
    this.sprite.on('pointerdown', () => {
      if (this.isOpen) this.transition()
    })
  }

  /**
   * Vincula el obstáculo físico que bloquea el paso.
   * Al abrir la puerta, se desactivará automáticamente.
   */
  linkObstacle(obstacle: Phaser.Physics.Arcade.Image) {
    this.obstacle = obstacle
  }

  /**
   * Abre la puerta: animación de deslizamiento hacia arriba + fade out
   * y desactiva el colisionador físico.
   */
  open() {
    if (this.isOpen) return
    this.isOpen = true

    // Desactivar obstáculo físico para que el jugador pueda pasar
    if (this.obstacle) {
    const body = this.obstacle.body as Phaser.Physics.Arcade.Body | null

    if (body) {
      body.enable = false
    }

    this.obstacle.setVisible(false)
  }

    // Flash de luz al desbloquear
    const flash = this.scene.add.rectangle(
      this.sprite.x, this.sprite.y, 220, 160, 0xffffff, 0.35
    ).setDepth(3)
    this.scene.tweens.add({
      targets:  flash,
      alpha:    0,
      duration: 250,
      ease:     'Linear',
      onComplete: () => flash.destroy(),
    })

    // Pequeño shake de la puerta antes de abrirse
    this.scene.tweens.add({
      targets:   this.sprite,
      x:         this.sprite.x + 4,
      duration:  60,
      yoyo:      true,
      repeat:    3,
      ease:      'Linear',
      onComplete: () => {
        // Swap de textura: cerrada → abierta (marco igual, vano oscuro)
        this.sprite.setTexture('door-open')
      },
    })
  }

  private transition() {
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
