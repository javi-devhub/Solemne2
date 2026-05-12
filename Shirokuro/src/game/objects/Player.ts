import Phaser from 'phaser'

export class Player {
  private scene:     Phaser.Scene
  readonly playerId: 1 | 2
  readonly body:     Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  readonly label:    Phaser.GameObjects.Text

  private worldW: number
  private worldH: number

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerId: 1 | 2,
    worldW: number,
    worldH: number,
  ) {
    this.scene    = scene
    this.playerId = playerId
    this.worldW   = worldW
    this.worldH   = worldH

    // Physics image con textura generada por código
    const key = `player_rect_${playerId}`
    if (!scene.textures.exists(key)) {
      const g = scene.add.graphics().setVisible(false);
      g.fillStyle(playerId === 1 ? 0x999999 : 0x666666)
      g.fillRect(0, 0, 20, 32)
      g.generateTexture(key, 20, 32)
      g.destroy()
    }

    this.body = scene.physics.add.image(x, y, key)
    this.body.setCollideWorldBounds(true)
    this.body.setDepth(10)
    this.body.setImmovable(false)

    this.label = scene.add.text(x, y - 24, `J${playerId}`, {
      fontFamily: 'Share Tech Mono',
      fontSize:   '9px',
      color:      playerId === 1 ? '#aaaaaa' : '#777777',
    }).setOrigin(0.5, 1).setDepth(11)
  }

  move(vx: number, vy: number) {
    this.body.setVelocity(vx, vy)

    this.label.x = this.body.x
    this.label.y = this.body.y - 24
  }

  getPosition() {
    return { x: this.body.x, y: this.body.y }
  }

  getGameObjects(): Phaser.GameObjects.GameObject[] {
    return [this.body, this.label]
  }

  destroy() {
    this.body.destroy()
    this.label.destroy()
  }
}