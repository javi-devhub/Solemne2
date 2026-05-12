import Phaser from 'phaser'
import { Player } from '../objects/Player'

const WORLD_W = 1280
const WORLD_H = 720
const SPEED   = 180

export class SceneP2 extends Phaser.Scene {

  private player!: Player
  private cursors!:  Phaser.Types.Input.Keyboard.CursorKeys
  private keyEnter!: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'SceneP2' })
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)

    this.buildRoom()

    this.player = new Player(this, WORLD_W - 300, WORLD_H * 0.65, 2, WORLD_W, WORLD_H)

    // Viewport: mitad derecha
    this.cameras.main.setViewport(640, 0, 640, 720)
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBackgroundColor('#080606')
    this.cameras.main.startFollow(this.player.body, true, 0.1, 0.1)

    this.setupInput()
  }

  update() {
    let vx = 0, vy = 0
    if (this.cursors.left.isDown)  vx = -SPEED
    if (this.cursors.right.isDown) vx =  SPEED
    if (this.cursors.up.isDown)    vy = -SPEED
    if (this.cursors.down.isDown)  vy =  SPEED
    this.player.move(vx, vy)
  }

  private buildRoom() {
    const floorY = WORLD_H * 0.72

    this.add.rectangle(0, 0, WORLD_W, WORLD_H, 0x060606).setOrigin(0, 0)
    this.add.rectangle(0, floorY, WORLD_W, WORLD_H - floorY, 0x0a0a0a).setOrigin(0, 0)
    this.add.line(0, 0, 0, floorY, WORLD_W, floorY, 0x1e1e1e).setLineWidth(1).setOrigin(0, 0)

    this.add.rectangle(0, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)
    this.add.rectangle(WORLD_W - 4, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)

    this.add.text(WORLD_W / 2, 18, 'HABITACIÓN 01 — J2', {
      fontFamily: 'Share Tech Mono',
      fontSize: '10px',
      color: '#222222',
      letterSpacing: 5,
    }).setOrigin(0.5, 0)

    // J2 ve objetos distintos — base para visibilidad diferenciada
    this.addDoor(180, floorY)
    this.addDoor(WORLD_W - 180, floorY)
    this.addObject(600, floorY - 20, 40, 40, 'CAJA C')
    this.addObject(900, floorY - 20, 40, 40, 'CAJA D')
  }

  private addDoor(x: number, floorY: number) {
    const dw = 60, dh = 100
    this.add.rectangle(x, floorY - dh / 2, dw, dh, 0x0d0d0d).setStrokeStyle(1, 0x1e1e1e)
    this.add.rectangle(x, floorY - dh / 2, dw - 10, dh - 10, 0x080808).setStrokeStyle(1, 0x161616)
    this.add.rectangle(x, floorY - dh + 20, 16, 16, 0x040404).setStrokeStyle(1, 0x181818)
  }

  private addObject(x: number, y: number, w: number, h: number, label: string) {
    this.add.rectangle(x, y, w, h, 0x111111).setStrokeStyle(1, 0x252525).setDepth(5)
    this.add.text(x, y - h / 2 - 6, label, {
      fontFamily: 'Share Tech Mono', fontSize: '7px', color: '#2a2a2a',
    }).setOrigin(0.5, 1).setDepth(6)
  }

  private setupInput() {
    const kb = this.input.keyboard!
    this.cursors  = kb.createCursorKeys()
    this.keyEnter = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  }
}