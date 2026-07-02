import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ROOM_02_OBJECTS } from '../data/interactableRoom2'
import { gameBus } from '@/composables/useGameEventBus'
import { puzzle2State } from '../state/puzzle2State'
import { useShadowPressureStore } from '@/stores/shadowPressureStore'
import { Door } from '../objects/Door'
import { DebugHitboxes } from '../objects/DebugHitboxes'
import { findNearestInteractable } from '../utils/proximity'

const WORLD_W = 1280
const WORLD_H = 720
const SPEED = 180
const INTERACT_MARGIN = 48

/**
 * Habitación 02 — "Las marcas en la pared" — lado de la Jugadora 2.
 * J2 ve una cuadrícula de medición con números por posición, pero no
 * sabe a qué símbolo corresponde cada uno. Debe escuchar el orden que
 * dicta J1 y traducirlo a números para ingresar el código final: 417.
 */
export class SceneRoom2P2 extends Phaser.Scene {
  private player!: Player
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys
  private keyEnter!: Phaser.Input.Keyboard.Key
  private keyBackspace!: Phaser.Input.Keyboard.Key
  private keyP!: Phaser.Input.Keyboard.Key
  private keyDigits: Phaser.Input.Keyboard.Key[] = []

  private wallColliders!: Phaser.Physics.Arcade.StaticGroup
  private debugHitboxes!: DebugHitboxes

  private inspectText!: Phaser.GameObjects.Text
  private inspectTextTimer?: Phaser.Time.TimerEvent

  private codePanel!: Phaser.GameObjects.Container
  private codePanelText!: Phaser.GameObjects.Text
  private isPanelOpen = false

  private door!: Door
  private doorObstacle!: Phaser.Physics.Arcade.Image
  private doorOpened = false
  private shadowPressure!: ReturnType<typeof useShadowPressureStore>

  constructor() { super({ key: 'SceneRoom2P2' }) }

  preload() {
    this.load.image('door-closed', '/assets/backgrounds/sprites/door-closed.png')
    this.load.image('door-open',   '/assets/backgrounds/sprites/door-open.png')
  }

  create() {
    // Cada vez que se entra a la Habitación 02 el estado del puzzle debe
    // ser nuevo. Se resetea acá para no depender del orden de creación
    // entre SceneRoom2P1 y SceneRoom2P2.
    puzzle2State.reset()
    this.doorOpened = false

    // ── Sistema de presión (sombra) ─────────────────────────────────
    // Reemplaza los screamers aleatorios: avanza por tiempo y por errores.
    this.shadowPressure = useShadowPressureStore()
    this.shadowPressure.start()
    this.events.on('shutdown', () => this.shadowPressure.stop())

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.buildRoom()

    this.player = new Player(this, 520, 530, 2, WORLD_W, WORLD_H)
    this.createWallColliders()

    // ── Puerta J2 — coordenadas provisionales, ajústalas cuando tengas el fondo real ──
    this.door = new Door(this, 550, 155, 'door-closed')
    this.physics.add.collider(this.player.body, this.door.sprite)

    this.doorObstacle = this.physics.add.staticImage(550, 140, '')
    this.doorObstacle.setSize(200, 30)
    this.doorObstacle.refreshBody()
    this.doorObstacle.setVisible(false)
    this.door.linkObstacle(this.doorObstacle)
    this.physics.add.collider(this.player.body, this.doorObstacle)

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
      padding: { x: 12, y: 8 },
    })
      .setOrigin(0.5)
      .setScrollFactor(0)
      .setDepth(999)
      .setVisible(false)

    this.createCodePanel()
    this.keyP.on('down', () => this.tryInteract())

    this.debugHitboxes = new DebugHitboxes(this)
    this.debugHitboxes.trackStaticGroup(this.wallColliders, 0xff0000)
    this.debugHitboxes.trackInteractables(ROOM_02_OBJECTS, 0x00ff00)
  }

  update() {
    if (puzzle2State.solved && !this.doorOpened) {
      this.doorOpened = true
      this.door.open()
      this.shadowPressure.stop()
    }

    this.debugHitboxes.refresh()

    if (this.isPanelOpen) {
      this.handlePanelInput()
      this.player.moveFree(0, 0)
      this.player.updateLabel()
      return
    }

    let vx = 0
    let vy = 0
    if (this.cursors.left.isDown) vx = -SPEED
    if (this.cursors.right.isDown) vx = SPEED
    if (this.cursors.up.isDown) vy = -SPEED
    if (this.cursors.down.isDown) vy = SPEED
    this.player.moveFree(vx, vy)
    this.player.updateLabel()
    this.checkProximity()
  }

  private checkProximity() {
    const { x, y } = this.player.getPosition()
    const nearest = findNearestInteractable(x, y, ROOM_02_OBJECTS, INTERACT_MARGIN)

    if (nearest) {
      const cam = this.cameras.main
      const sx = 640 + (nearest.x - cam.scrollX) * cam.zoom
      const sy = (nearest.y - cam.scrollY) * cam.zoom - 40
      gameBus.emit('p2:proximity', { objectId: nearest.id, prompt: nearest.promptP2, screenX: sx, screenY: sy })
    } else {
      gameBus.emit('p2:proximity', null)
    }
  }

  private tryInteract() {
    if (this.isPanelOpen) { this.closeCodePanel(); return }

    const { x, y } = this.player.getPosition()
    const obj = findNearestInteractable(x, y, ROOM_02_OBJECTS, INTERACT_MARGIN)
    if (!obj) return

    this.showInspectMessage(obj.descriptionP2)
    this.openCodePanel()

    gameBus.emit('p2:interact', {
      objectId: obj.id,
      description: obj.descriptionP2,
      actions: obj.actions ?? [],
      screenX: 0,
      screenY: 0,
    })
  }

  private showInspectMessage(message: string) {
    this.inspectText.setText(message)
    this.inspectText.setVisible(true)
    if (this.inspectTextTimer) this.inspectTextTimer.remove(false)
    this.inspectTextTimer = this.time.delayedCall(3000, () => this.inspectText.setVisible(false))
  }

  private createCodePanel() {
    const panelBg = this.add.rectangle(320, 280, 440, 340, 0x050505, 0.95)
      .setStrokeStyle(1, 0x334455)

    this.codePanelText = this.add.text(320, 280, '', {
      fontFamily: 'Share Tech Mono',
      fontSize: '12px',
      color: '#dddddd',
      align: 'left',
      lineSpacing: 3,
      wordWrap: { width: 390 },
    }).setOrigin(0.5)

    this.codePanel = this.add.container(0, 0, [panelBg, this.codePanelText])
    this.codePanel.setScrollFactor(0).setDepth(1000).setVisible(false)
  }

  private openCodePanel() {
    this.isPanelOpen = true
    this.refreshCodePanel()
    this.codePanel.setVisible(true)
  }

  private refreshCodePanel() {
    const positions = puzzle2State.getPositionNumbers()
    const status = puzzle2State.getPanelStatus()
    const entered = puzzle2State.enteredCode.padEnd(positions.length, '_').split('').join(' ')

    if (puzzle2State.solved) {
      this.codePanelText.setText([
        '[ PANEL DE ACCESO ]',
        '',
        'La cuadrícula dejó de parpadear.',
        'Código aceptado.',
        '',
        `Estado: ${status}`,
        '',
        'P: cerrar',
      ].join('\n'))
      return
    }

    this.codePanelText.setText([
      '[ PANEL DE ACCESO ]',
      '',
      'Cuadrícula de medición detectada sobre la pared:',
      '',
      `  Posición #1 = ${positions[0]}    Posición #2 = ${positions[1]}    Posición #3 = ${positions[2]}`,
      '',
      'No distingues los dibujos, solo estos números.',
      'Pide a la otra jugadora el orden de los símbolos',
      'y traduce cada uno a su número de posición.',
      '',
      `Código: ${entered}`,
      status,
      '',
      '0-9: ingresar dígito',
      'BACKSPACE: borrar último dígito',
      'ENTER: confirmar código',
      'P: cerrar',
    ].join('\n'))
  }

  private handlePanelInput() {
    for (let i = 0; i <= 9; i++) {
      if (Phaser.Input.Keyboard.JustDown(this.keyDigits[i])) {
        puzzle2State.appendDigit(String(i))
        this.refreshCodePanel()
      }
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyBackspace)) {
      puzzle2State.deleteLastDigit()
      this.refreshCodePanel()
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
      const result = puzzle2State.submitCode()
      this.showInspectMessage(result.message)
      this.refreshCodePanel()

      if (puzzle2State.lastAttemptWrong) {
        this.shadowPressure.registerError()
        this.triggerGlitch()
      }
    }
  }

  private triggerGlitch() {
    const cam = this.cameras.main
    let count = 0
    this.time.addEvent({
      delay: 50,
      repeat: 10,
      callback: () => {
        count++
        if (count % 2 === 0) {
          cam.setScroll(cam.scrollX + Phaser.Math.Between(-6, 6), cam.scrollY + Phaser.Math.Between(-3, 3))
          cam.setAlpha(0.7)
        } else {
          cam.setAlpha(1)
        }
        if (count >= 10) cam.setAlpha(1)
      },
    })
  }

  private closeCodePanel() {
    this.isPanelOpen = false
    this.codePanel.setVisible(false)
  }

  private buildRoom() {
    this.add.rectangle(0, 0, WORLD_W, WORLD_H, 0x0c0a0a).setOrigin(0, 0)
    this.add.rectangle(0, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)
    this.add.rectangle(WORLD_W - 4, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)

    this.add.text(16, 18, 'HABITACIÓN 02', {
      fontFamily: 'Share Tech Mono', fontSize: '10px', color: '#1e1e1e', letterSpacing: 5,
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(1)

    this.drawMeasurementGrid()
  }

  /**
   * Placeholder visual de la cuadrícula técnica de medición. Reemplazar por
   * un sprite/imagen real cuando esté listo el arte (p. ej. 'wall-grid-p2').
   */
  private drawMeasurementGrid() {
    const obj = ROOM_02_OBJECTS[0]
    const positions = puzzle2State.getPositionNumbers()
    const startX = obj.x - 90
    const gap = 90

    const gfx = this.add.graphics().setDepth(4)
    gfx.lineStyle(1, 0x3a5a6a, 0.6)
    for (let gx = obj.x - obj.width / 2; gx <= obj.x + obj.width / 2; gx += 20) {
      gfx.lineBetween(gx, obj.y - obj.height / 2, gx, obj.y + obj.height / 2)
    }
    for (let gy = obj.y - obj.height / 2; gy <= obj.y + obj.height / 2; gy += 20) {
      gfx.lineBetween(obj.x - obj.width / 2, gy, obj.x + obj.width / 2, gy)
    }
    gfx.strokeRect(obj.x - obj.width / 2, obj.y - obj.height / 2, obj.width, obj.height)

    positions.forEach((num, i) => {
      const x = startX + i * gap
      this.add.circle(x, obj.y, 22, 0x000000, 0).setStrokeStyle(1, 0x5ad0ff, 0.9).setDepth(6)
      this.add.text(x, obj.y, String(num), {
        fontFamily: 'Share Tech Mono', fontSize: '18px', color: '#5ad0ff',
      }).setOrigin(0.5).setDepth(7)
      this.add.text(x, obj.y + 40, `#${i + 1}`, {
        fontFamily: 'Share Tech Mono', fontSize: '9px', color: '#3a6a80', letterSpacing: 2,
      }).setOrigin(0.5).setDepth(7)
    })
  }

  private setupInput() {
    const kb = this.input.keyboard!
    this.cursors = kb.createCursorKeys()
    this.keyEnter = kb.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER)
    this.keyBackspace = kb.addKey(Phaser.Input.Keyboard.KeyCodes.BACKSPACE)
    this.keyP = kb.addKey(Phaser.Input.Keyboard.KeyCodes.P)

    const digitCodes = [
      Phaser.Input.Keyboard.KeyCodes.ZERO, Phaser.Input.Keyboard.KeyCodes.ONE,
      Phaser.Input.Keyboard.KeyCodes.TWO, Phaser.Input.Keyboard.KeyCodes.THREE,
      Phaser.Input.Keyboard.KeyCodes.FOUR, Phaser.Input.Keyboard.KeyCodes.FIVE,
      Phaser.Input.Keyboard.KeyCodes.SIX, Phaser.Input.Keyboard.KeyCodes.SEVEN,
      Phaser.Input.Keyboard.KeyCodes.EIGHT, Phaser.Input.Keyboard.KeyCodes.NINE,
    ]
    this.keyDigits = digitCodes.map(code => kb.addKey(code))
  }

  private createWallColliders() {
    this.wallColliders = this.physics.add.staticGroup()
    const thickness = 24
    const LEFT = 250, RIGHT = 920, TOP = 205, BOTTOM = 645
    const centerX = (LEFT + RIGHT) / 2
    const centerY = (TOP + BOTTOM) / 2
    const width = RIGHT - LEFT
    const height = BOTTOM - TOP

    this.wallColliders.create(centerX, TOP, '__DEFAULT').setDisplaySize(width, thickness).setAlpha(0.3).refreshBody()
    this.wallColliders.create(centerX, BOTTOM, '__DEFAULT').setDisplaySize(width, thickness).setAlpha(0.3).refreshBody()
    this.wallColliders.create(LEFT, centerY, '__DEFAULT').setDisplaySize(thickness, height).setAlpha(0.3).refreshBody()
    this.wallColliders.create(RIGHT, centerY, '__DEFAULT').setDisplaySize(thickness, height).setAlpha(0.3).refreshBody()

    this.physics.add.collider(this.player.body, this.wallColliders)
  }
}
