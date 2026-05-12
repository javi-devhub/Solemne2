import Phaser from 'phaser'
import { Player } from '../objects/Player'

const GAME_W  = 1280
const GAME_H  = 720
const WORLD_W = 2560
const WORLD_H = 720
const SPEED   = 180

export class Scene1 extends Phaser.Scene {

  private player1!: Player
  private player2!: Player
  private camP1!:   Phaser.Cameras.Scene2D.Camera
  private camP2!:   Phaser.Cameras.Scene2D.Camera

  private keyW!: Phaser.Input.Keyboard.Key
  private keyA!: Phaser.Input.Keyboard.Key
  private keyS!: Phaser.Input.Keyboard.Key
  private keyD!: Phaser.Input.Keyboard.Key
  private keyE!: Phaser.Input.Keyboard.Key
  private cursors!:  Phaser.Types.Input.Keyboard.CursorKeys
  private keyEnter!: Phaser.Input.Keyboard.Key

  constructor() {
    super({ key: 'Scene1' })
  }

  create() {
    // World bounds — define el límite físico del mundo
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)

    this.buildWorld()

    this.player1 = new Player(this, 300,             WORLD_H * 0.65, 1, WORLD_W, WORLD_H)
    this.player2 = new Player(this, WORLD_W - 300,   WORLD_H * 0.65, 2, WORLD_W, WORLD_H)

    // Colisión entre los dos jugadores
    this.physics.add.collider(this.player1.body, this.player2.body)

    this.setupCameras()
    this.scene.launch('HUDScene')
    this.setupInput()
  }

  update() {
    let v1x = 0, v1y = 0
    if (this.keyA.isDown) v1x = -SPEED
    if (this.keyD.isDown) v1x =  SPEED
    if (this.keyW.isDown) v1y = -SPEED
    if (this.keyS.isDown) v1y =  SPEED
    this.player1.move(v1x, v1y)

    let v2x = 0, v2y = 0
    if (this.cursors.left.isDown)  v2x = -SPEED
    if (this.cursors.right.isDown) v2x =  SPEED
    if (this.cursors.up.isDown)    v2y = -SPEED
    if (this.cursors.down.isDown)  v2y =  SPEED
    this.player2.move(v2x, v2y)

    const p1 = this.player1.getPosition()
    const p2 = this.player2.getPosition()
    this.camP1.centerOn(p1.x, p1.y)
    this.camP2.centerOn(p2.x, p2.y)
  }

  private buildWorld() {
    this.add.rectangle(0, 0, WORLD_W, WORLD_H, 0x060606).setOrigin(0, 0)

    const floorY = WORLD_H * 0.72
    this.add.rectangle(0, floorY, WORLD_W, WORLD_H - floorY, 0x0a0a0a).setOrigin(0, 0)
    this.add.line(0, 0, 0, floorY, WORLD_W, floorY, 0x1e1e1e).setLineWidth(1).setOrigin(0, 0)
    this.add.rectangle(0, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)
    this.add.rectangle(WORLD_W - 4, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)

    this.buildRoom(floorY)
  }

  private buildRoom(floorY: number) {
    this.addDoor(180, floorY)
    this.addDoor(WORLD_W - 180, floorY)
    this.addDoor(WORLD_W / 2, floorY)

    this.addObject(500,           floorY - 20, 40, 40, 'CAJA A')
    this.addObject(800,           floorY - 20, 40, 40, 'CAJA B')
    this.addObject(WORLD_W - 500, floorY - 20, 40, 40, 'CAJA C')

    this.add.text(WORLD_W / 2, 18, 'HABITACIÓN 01', {
      fontFamily: 'Share Tech Mono',
      fontSize:   '10px',
      color:      '#222222',
      letterSpacing: 5,
    }).setOrigin(0.5, 0).setDepth(1)
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
      fontFamily: 'Share Tech Mono',
      fontSize:   '7px',
      color:      '#2a2a2a',
    }).setOrigin(0.5, 1).setDepth(6)
  }

  private setupCameras() {
    const half = GAME_W / 2

    this.camP1 = this.cameras.main
    this.camP1.setViewport(0, 0, half, GAME_H)
    this.camP1.setBounds(0, 0, WORLD_W, WORLD_H)
    this.camP1.setBackgroundColor('#060608')
    this.camP1.centerOn(this.player1.getPosition().x, this.player1.getPosition().y)

    this.camP2 = this.cameras.add(half, 0, half, GAME_H)
    this.camP2.setBounds(0, 0, WORLD_W, WORLD_H)
    this.camP2.setBackgroundColor('#080606')
    this.camP2.centerOn(this.player2.getPosition().x, this.player2.getPosition().y)
  }

  private setupInput() {
    const kb = this.input.keyboard!
    this.keyW     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keyA     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyS     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keyE     = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.cursors  = kb.createCursorKeys()
    this.keyEnter = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
  }
}