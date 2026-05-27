import Phaser from 'phaser'

type Direction = 'down' | 'up' | 'left' | 'right'

// Tamaños de display en unidades de mundo (px).
// Después del recorte al bounding box los sprites son casi sólo el personaje,
// así que estos valores ~= tamaño visual real del pj.
// Ajusta sólo aquí si el pj se ve grande/pequeño.
// Canvas de todos los sprites: 1536×1024 con el personaje centrado y fondo transparente.
// Estos valores son el tamaño del CANVAS (no del personaje) para que Phaser
// escale correctamente y el pj se vea en el tamaño visual deseado.
const DISPLAY_SIZES: Record<1 | 2, Record<Direction, { w: number; h: number }>> = {
  1: {
    down:  { w: 210, h: 140 },
    up:    { w: 420, h: 280 },
    left:  { w: 210, h: 140 },
    right: { w: 210, h: 140 },
  },
  2: {
    down:  { w: 240, h: 170 },
    up:    { w: 315, h: 210 },
    left:  { w: 240, h: 170 },
    right: { w: 240, h: 170 },
  },
}

export class Player {
  private scene:     Phaser.Scene
  readonly playerId: 1 | 2
  readonly body:     Phaser.Types.Physics.Arcade.ImageWithDynamicBody
  readonly label:    Phaser.GameObjects.Text

  private currentDir: Direction = 'down'
  private isMoving   = false

  // Bob de caminata — oscilación vertical pura, no toca la física
  private walkBobTween?: Phaser.Tweens.Tween
  private bobProxy = { offset: 0 }

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    playerId: 1 | 2,
    _worldW: number,
    _worldH: number,
  ) {
    this.scene    = scene
    this.playerId = playerId

    // Textura inicial: de frente (down)
    this.body = scene.physics.add.image(x, y, `player${playerId}-down`)
    this._applyDisplaySize('down')

    // Pixel Art nítido
    if (this.body.texture) {
      this.body.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
    }

    // Física top-down sin gravedad
    this.body.setGravityY(0)
    if (this.body.body) { this.body.body.allowGravity = false }
    this.body.setBounce(0)

    // Hitbox: un poco más estrecha que el display para que no choque con paredes por el pelo
    this.body.setSize(50, 110)

    // Etiqueta J1 / J2
    this.label = scene.add.text(x, y - 48, `J${playerId}`, {
      fontFamily: 'Share Tech Mono',
      fontSize:   '8px',
      color:      '#ffffff',
    }).setOrigin(0.5, 1).setDepth(11)
  }

  // ── API pública ──────────────────────────────────────────────────────

  move(vx: number) {
    this.body.setVelocityX(vx)
    this._handleDirectionChange(vx, 0)
    this.updateLabel()
  }

  moveFree(vx: number, vy: number) {
    this.body.setVelocity(vx, vy)
    this._handleDirectionChange(vx, vy)
    this.updateLabel()
  }

  jump() {
    if (this.body.body && this.body.body.blocked.down) {
      this.body.setVelocityY(-420)
    }
  }

  updateLabel() {
    this.label.x = this.body.x
    this.label.y = this.body.y - (this._currentH() / 2) - 6 + this.bobProxy.offset
  }

  getPosition() {
    return { x: this.body.x, y: this.body.y }
  }

  getGameObjects(): Phaser.GameObjects.GameObject[] {
    return [this.body, this.label]
  }

  destroy() {
    this._stopBob()
    this.body.destroy()
    this.label.destroy()
  }

  // ── Dirección y animación ────────────────────────────────────────────

  private _handleDirectionChange(vx: number, vy: number) {
    const moving = vx !== 0 || vy !== 0

    // Dirección dominante (eje X tiene prioridad sobre Y)
    let dir: Direction = this.currentDir
    if      (vx > 0)  dir = 'right'
    else if (vx < 0)  dir = 'left'
    else if (vy < 0)  dir = 'up'
    else if (vy > 0)  dir = 'down'

    // Cambiar textura si cambió la dirección
    if (dir !== this.currentDir) {
      this.currentDir = dir
      this.body.setTexture(`player${this.playerId}-${dir}`)
      this._applyDisplaySize(dir)
    }

    // Bob de caminata
    if (moving && !this.isMoving) {
      this.isMoving = true
      this._startBob()
    } else if (!moving && this.isMoving) {
      this.isMoving = false
      this._stopBob()
    }
  }

  /** Oscilación vertical sutil mientras camina */
  private _startBob() {
    this._stopBob()
    this.walkBobTween = this.scene.tweens.add({
      targets:  this.bobProxy,
      offset:   { from: -2, to: 2 },
      duration: 220,
      yoyo:     true,
      repeat:   -1,
      ease:     'Sine.easeInOut',
      onUpdate: () => {
        this.body.setOrigin(0.5, 0.5 + this.bobProxy.offset / this._currentH())
      },
    })
  }

  private _stopBob() {
    if (this.walkBobTween) {
      this.walkBobTween.stop()
      this.walkBobTween = undefined
    }
    this.bobProxy.offset = 0
    this.body.setOrigin(0.5, 0.5)
  }

  private _applyDisplaySize(dir: Direction) {
    const { w, h } = DISPLAY_SIZES[this.playerId][dir]
    this.body.setDisplaySize(w, h)
  }

  private _currentH(): number {
    return DISPLAY_SIZES[this.playerId][this.currentDir].h
  }
}
