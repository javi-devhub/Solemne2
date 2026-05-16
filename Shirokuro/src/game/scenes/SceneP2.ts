import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ROOM_01_OBJECTS } from '../data/interactable'
import { gameBus } from '@/composables/useGameEventBus'
import { puzzle1State } from '../state/puzzle1State'

const WORLD_W       = 1280
const WORLD_H       = 720
const SPEED         = 180
const FLOOR_Y       = WORLD_H * 0.72
const INTERACT_DIST = 80

export class SceneP2 extends Phaser.Scene {
  private player!:    Player
  private cursors!:   Phaser.Types.Input.Keyboard.CursorKeys
  private keyEnter!:  Phaser.Input.Keyboard.Key
  private keyBackspace!: Phaser.Input.Keyboard.Key

  private devicePanel!: Phaser.GameObjects.Container
  private devicePanelText!: Phaser.GameObjects.Text
  private isDevicePanelOpen = false

  private inspectText!: Phaser.GameObjects.Text
  private inspectTextTimer?: Phaser.Time.TimerEvent

  constructor() { super({ key: 'SceneP2' }) }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.buildRoom()

    this.player = new Player(this, WORLD_W - 300, FLOOR_Y - 40, 2, WORLD_W, WORLD_H)

    const floor = this.physics.add.staticImage(WORLD_W / 2, FLOOR_Y + 4, '__DEFAULT')
    floor.setDisplaySize(WORLD_W, 8).refreshBody().setAlpha(0)
    this.physics.add.collider(this.player.body, floor)

    const wallL = this.physics.add.staticImage(0, WORLD_H / 2, '__DEFAULT')
    wallL.setDisplaySize(8, WORLD_H).refreshBody().setAlpha(0)
    const wallR = this.physics.add.staticImage(WORLD_W, WORLD_H / 2, '__DEFAULT')
    wallR.setDisplaySize(8, WORLD_H).refreshBody().setAlpha(0)
    this.physics.add.collider(this.player.body, wallL)
    this.physics.add.collider(this.player.body, wallR)

    this.cameras.main.setViewport(640, 0, 640, 720)
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBackgroundColor('#080606')
    this.cameras.main.startFollow(this.player.body, true, 0.1, 0.1)

    this.setupInput()

    this.inspectText = this.add.text(320, 620, '', {
    fontFamily: 'Share Tech Mono',
    fontSize: '14px',
    color: '#dddddd',
    backgroundColor: '#000000',
    padding: {
      x: 12,
      y: 8,
  },
})
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(999)
  .setVisible(false)
    this.createDevicePanel()
    this.keyEnter.on('down', () => this.tryInteract())
  }

  update() {

    if (this.isDevicePanelOpen) {
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
      this.refreshDevicePanel()
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyBackspace)) {
      this.closeDevicePanel()
    }

    this.player.move(0)
    this.player.updateLabel()
    return
  }
    let vx = 0, vy = 0
    if (this.cursors.left.isDown)  vx = -SPEED
    if (this.cursors.right.isDown) vx =  SPEED
    this.player.move(vx)

    if (Phaser.Input.Keyboard.JustDown(this.cursors.up!)) {
  }

  this.player.updateLabel()

  this.checkProximity()
  }

  private checkProximity() {
    const { x, y } = this.player.getPosition()
    let nearest: typeof ROOM_01_OBJECTS[0] | null = null
    let minDist = INTERACT_DIST

    for (const obj of ROOM_01_OBJECTS) {
      const dist = Phaser.Math.Distance.Between(x, y, obj.x, obj.y)
      if (dist < minDist) { minDist = dist; nearest = obj }
    }

    if (nearest) {
      const cam = this.cameras.main
      const sx  = 640 + (nearest.x - cam.scrollX) * cam.zoom
      const sy  = (nearest.y - cam.scrollY) * cam.zoom - 40

      gameBus.emit('p2:proximity', {
        objectId: nearest.id,
        prompt:   nearest.promptP2,
        screenX:  sx,
        screenY:  sy,
      })
    } else {
      gameBus.emit('p2:proximity', null)
    }
  }

  private tryInteract() {
    const { x, y } = this.player.getPosition()
    for (const obj of ROOM_01_OBJECTS) {
      const dist = Phaser.Math.Distance.Between(x, y, obj.x, obj.y)
      if (dist < INTERACT_DIST) {
        const cam = this.cameras.main
        const sx  = 640 + (obj.x - cam.scrollX) * cam.zoom
        const sy  = (obj.y - cam.scrollY) * cam.zoom - 60

        console.log('J2 inspeccionó:', obj.descriptionP2)
        this.showInspectMessage(obj.descriptionP2)
        this.openDevicePanel()
        

        gameBus.emit('p2:interact', {
          objectId:    obj.id,
          description: obj.descriptionP2,
          actions:     obj.actions ?? [],
          screenX:     sx,
          screenY:     sy,
        })
        return
      }
    }
  }

  private showInspectMessage(message: string) {
    this.inspectText.setText(message)
    this.inspectText.setVisible(true)

    if (this.inspectTextTimer) {
    this.inspectTextTimer.remove(false)
    }

    this.inspectTextTimer = this.time.delayedCall(3000, () => {
    this.inspectText.setVisible(false)
  })
}


private createDevicePanel() {
  const panelBg = this.add.rectangle(320, 260, 420, 260, 0x050505, 0.95)
    .setStrokeStyle(1, 0x334455)

  this.devicePanelText = this.add.text(320, 260, '', {
    fontFamily: 'Share Tech Mono',
    fontSize: '14px',
    color: '#dddddd',
    align: 'left',
    wordWrap: {
      width: 360,
    },
  }).setOrigin(0.5)

  this.devicePanel = this.add.container(0, 0, [
    panelBg,
    this.devicePanelText,
  ])

  this.devicePanel
    .setScrollFactor(0)
    .setDepth(1000)
    .setVisible(false)
}

private openDevicePanel() {
  this.isDevicePanelOpen = true
  this.refreshDevicePanel()
  this.devicePanel.setVisible(true)
}

private refreshDevicePanel() {
  const status = puzzle1State.getDeviceStatus()


   if (puzzle1State.solved) {
    this.devicePanelText.setText(
      [
        '[ DISPOSITIVO MÉDICO ]',
        '',
        'La pantalla dejó de parpadear.',
        'La línea de vitalidad se mantiene estable.',
        '',
        'Estado actual:',
        status,
        '',
        'Sistema sincronizado.',
        'La puerta parece haberse desbloqueado.',
        '',
        'Backspace: cerrar',
      ].join('\n'),
    )
    return
  }

  this.devicePanelText.setText(
    [
      '[ DISPOSITIVO MÉDICO ]',
    '',
    'La pantalla parpadea con una señal irregular.',
    'Cada ajuste del otro jugador altera la lectura.',
    '',
    'Pista:',
    'La señal tiene tres zonas alteradas.',
    'Cada cambio correcto estabiliza una zona.',
    'Si el orden falla, la lectura vuelve al inicio.',
    '',
    'Estado actual:',
    status,
    '',
    'ENTER: actualizar lectura',
    'BACKSPACE: cerrar',
    ].join('\n'),
  )
}

private closeDevicePanel() {
  this.isDevicePanelOpen = false
  this.devicePanel.setVisible(false)
}


  private buildRoom() {
    this.add.rectangle(0, 0, WORLD_W, WORLD_H, 0x060606).setOrigin(0, 0)
    const floorY = FLOOR_Y
    this.add.rectangle(0, floorY, WORLD_W, WORLD_H - floorY, 0x0a0a0a).setOrigin(0, 0)
    this.add.line(0, 0, 0, floorY, WORLD_W, floorY, 0x1e1e1e).setLineWidth(1).setOrigin(0, 0)
    this.add.rectangle(0, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)
    this.add.rectangle(WORLD_W - 4, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)

    this.add.text(16, 18, 'HABITACIÓN 01', {
      fontFamily: 'Share Tech Mono', fontSize: '10px',
      color: '#1e1e1e', letterSpacing: 5,
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(1)

    // Objeto central — J2 lo ve como dispositivo
    this.addPuzzleObject(
      ROOM_01_OBJECTS[0].x,
      ROOM_01_OBJECTS[0].y,
      '📟', '#1a2030'
    )

    this.addDoor(180, floorY)
    this.addDoor(WORLD_W - 180, floorY)
  }

  private addPuzzleObject(x: number, y: number, icon: string, _color: string) {
    const g = this.add.graphics()
    g.lineStyle(1, 0x202a30, 0.4)
    g.strokeCircle(x, y, INTERACT_DIST)

    this.add.rectangle(x, y, 48, 48, 0x101520)
      .setStrokeStyle(1, 0x202e3a).setDepth(5)
    this.add.text(x, y, icon, { fontSize: '24px' })
      .setOrigin(0.5).setDepth(6)
  }

  private addDoor(x: number, floorY: number) {
    const dw = 60, dh = 100
    this.add.rectangle(x, floorY - dh / 2, dw, dh, 0x0d0d0d).setStrokeStyle(1, 0x1e1e1e)
    this.add.rectangle(x, floorY - dh / 2, dw - 10, dh - 10, 0x080808).setStrokeStyle(1, 0x161616)
    this.add.rectangle(x, floorY - dh + 20, 16, 16, 0x040404).setStrokeStyle(1, 0x181818)
  }

  private setupInput() {
    const kb      = this.input.keyboard!
    this.cursors  = kb.createCursorKeys()
    this.keyEnter = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.keyBackspace = kb.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE)
  }
}