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

    // Buscamos las llaves cortas 'player1' y 'player2'
    const key = `player${playerId}`

    // Creamos el cuerpo físico
    this.body = scene.physics.add.image(x, y, key)
    
    // ── ¡LA CLAVE ESTÁ AQUÍ! ───────────────────────────────────────────
    // Forzamos a la imagen gigante a medir 48px de ancho y 80px de alto.
    // Si encuentras que se ve muy flaco o gordo, puedes cambiar estos números.
   if (playerId === 1) {
      // (J1)
      this.body.setDisplaySize(300, 190)
    } else {
      // La niña con coletas (J2) - La empequeñecemos para concordar
      this.body.setDisplaySize(210, 140) // Subimos un poco el alto para no deformar
    }

    // Filtro para mantener el Pixel Art nítido
    if (this.body.texture) {
      this.body.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
    }

    // Configuración de movimiento libre 2D
    this.body.setGravityY(0)
    if (this.body.body) {
      this.body.body.allowGravity = false
    }
    this.body.setBounce(0)

    // Forzamos que la hitbox física mida lo mismo que le dimos visualmente (48x80)
    this.body.setSize(200, 320)

    // Colocamos la etiqueta flotante J1 / J2 calculada sobre los 80px de altura
    this.label = scene.add.text(x, y - 48, `J${playerId}`, {
      fontFamily: 'Share Tech Mono',
      fontSize:   '8px',
      color:      playerId === 1 ? '#ffffff' : '#ffffff',
    }).setOrigin(0.5, 1).setDepth(11)
  }

  move(vx: number) {
    this.body.setVelocityX(vx)
    this.updateLabel()
  }

  moveFree(vx: number, vy: number) {
    this.body.setVelocity(vx, vy)
    this.updateLabel()
  }

  jump() {
    if (this.body.body && this.body.body.blocked.down) {
      this.body.setVelocityY(-420)
    }
  }

  updateLabel() {
    // Mantiene la etiqueta centrada sobre su cabeza al caminar
    this.label.x = this.body.x
    this.label.y = this.body.y - 44
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