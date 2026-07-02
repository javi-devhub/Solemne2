import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ROOM_02_OBJECTS } from '../data/interactableRoom2'
import { gameBus } from '@/composables/useGameEventBus'
import { puzzle2State } from '../state/puzzle2State'
import { Door } from '../objects/Door'
import { DebugHitboxes } from '../objects/DebugHitboxes'
import { findNearestInteractable } from '../utils/proximity'

const WORLD_W = 1280
const WORLD_H = 720
const SPEED = 180
const INTERACT_MARGIN = 48

/**
 * Habitación 02 — "Las marcas en la pared" — lado de la Jugadora 1.
 * J1 ve los dibujos emocionales (casa, osito, puerta) resaltados y
 * conoce el ORDEN visual, pero no los números. Solo puede leer la pista;
 * quien ingresa el código final es J2 (ver SceneRoom2P2).
 */
export class SceneRoom2P1 extends Phaser.Scene {
  private player!: Player
  private keyW!: Phaser.Input.Keyboard.Key
  private keyA!: Phaser.Input.Keyboard.Key
  private keyS!: Phaser.Input.Keyboard.Key
  private keyD!: Phaser.Input.Keyboard.Key
  private keyE!: Phaser.Input.Keyboard.Key
  private keyQ!: Phaser.Input.Keyboard.Key

  private inspectText!: Phaser.GameObjects.Text
  private inspectTextTimer?: Phaser.Time.TimerEvent
  private wallColliders!: Phaser.Physics.Arcade.StaticGroup
  private debugHitboxes!: DebugHitboxes

  private cluePanel!: Phaser.GameObjects.Container
  private cluePanelText!: Phaser.GameObjects.Text
  private isPanelOpen = false

  private door!: Door
  private doorObstacle!: Phaser.Physics.Arcade.Image
  private doorOpened = false

  constructor() { super({ key: 'SceneRoom2P1' }) }

  preload() {
    this.load.image('door-closed', '/assets/backgrounds/sprites/door-closed.png')
    this.load.image('door-open',   '/assets/backgrounds/sprites/door-open.png')
  }

  create() {
    this.doorOpened = false

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.buildRoom()

    this.player = new Player(this, 300, 500, 1, WORLD_W, WORLD_H)
    this.createWallColliders()

    // ── Puerta J1 — coordenadas provisionales, ajústalas cuando tengas el fondo real ──
    this.door = new Door(this, 570, 150, 'door-closed')
    this.physics.add.collider(this.player.body, this.door.sprite)

    this.doorObstacle = this.physics.add.staticImage(640, 135, '')
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

    this.cameras.main.setViewport(0, 0, 640, 720)
    this.cameras.main.setBounds(0, 0, WORLD_W, WORLD_H)
    this.cameras.main.setBackgroundColor('#060608')
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

    this.createCluePanel()
    this.keyE.on('down', () => this.tryInteract())

    this.debugHitboxes = new DebugHitboxes(this)
    this.debugHitboxes.trackStaticGroup(this.wallColliders, 0xff0000)
    this.debugHitboxes.trackInteractables(ROOM_02_OBJECTS, 0x00ff00)
  }

  update() {
    // La puerta de J1 se abre sola en cuanto J2 confirma el código correcto.
    if (puzzle2State.solved && !this.doorOpened) {
      this.doorOpened = true
      this.door.open()
      this.showInspectMessage('Escuchas un clic al otro lado. La puerta cede.')
    }

    if (this.isPanelOpen) {
      this.handlePanelInput()
      this.player.moveFree(0, 0)
      this.player.updateLabel()
      return
    }

    let vx = 0
    let vy = 0
    if (this.keyA.isDown) vx = -SPEED
    if (this.keyD.isDown) vx = SPEED
    if (this.keyW.isDown) vy = -SPEED
    if (this.keyS.isDown) vy = SPEED
    this.player.moveFree(vx, vy)
    this.player.updateLabel()
    this.checkProximity()
    this.debugHitboxes.refresh()
  }

  private checkProximity() {
    const { x, y } = this.player.getPosition()
    const nearest = findNearestInteractable(x, y, ROOM_02_OBJECTS, INTERACT_MARGIN)

    if (nearest) {
      const cam = this.cameras.main
      const sx = (nearest.x - cam.scrollX) * cam.zoom
      const sy = (nearest.y - cam.scrollY) * cam.zoom - 40
      gameBus.emit('p1:proximity', { objectId: nearest.id, prompt: nearest.promptP1, screenX: sx, screenY: sy })
    } else {
      gameBus.emit('p1:proximity', null)
    }
  }

  private tryInteract() {
    if (this.isPanelOpen) { this.closeCluePanel(); return }

    const { x, y } = this.player.getPosition()
    const obj = findNearestInteractable(x, y, ROOM_02_OBJECTS, INTERACT_MARGIN)
    if (!obj) return

    this.showInspectMessage(obj.descriptionP1)
    this.openCluePanel()

    gameBus.emit('p1:interact', {
      objectId: obj.id,
      description: obj.descriptionP1,
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

  private createCluePanel() {
    const panelBg = this.add.rectangle(320, 280, 440, 300, 0x050505, 0.95)
      .setStrokeStyle(1, 0x444444)

    this.cluePanelText = this.add.text(320, 280, '', {
      fontFamily: 'Share Tech Mono',
      fontSize: '12px',
      color: '#dddddd',
      align: 'left',
      lineSpacing: 3,
      wordWrap: { width: 390 },
    }).setOrigin(0.5)

    this.cluePanel = this.add.container(0, 0, [panelBg, this.cluePanelText])
    this.cluePanel.setScrollFactor(0).setDepth(1000).setVisible(false)
  }

  private openCluePanel() {
    this.isPanelOpen = true
    this.refreshCluePanel()
    this.cluePanel.setVisible(true)
  }

  private refreshCluePanel() {
    if (puzzle2State.solved) {
      this.cluePanelText.setText([
        '[ MARCAS EN LA PARED ]',
        '',
        'Las marcas dejaron de brillar.',
        'El código ya fue confirmado del otro lado.',
        '',
        'Estado: DESBLOQUEADO',
        '',
        'Q: cerrar',
      ].join('\n'))
      return
    }

    this.cluePanelText.setText([
      '[ MARCAS EN LA PARED ]',
      '',
      'Tres dibujos brillan tenuemente sobre la pared,',
      'de izquierda a derecha:',
      '',
      '  ① CASA     ② OSITO     ③ PUERTA',
      '',
      'No hay números aquí — solo recuerdas el orden.',
      'Dicta este orden en voz alta a la otra jugadora;',
      'ella verá los números que le corresponden.',
      '',
      'Q: cerrar',
    ].join('\n'))
  }

  private handlePanelInput() {
    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
      this.closeCluePanel()
    }
  }

  private closeCluePanel() {
    this.isPanelOpen = false
    this.cluePanel.setVisible(false)
  }

  private buildRoom() {
    this.add.rectangle(0, 0, WORLD_W, WORLD_H, 0x0a0a0c).setOrigin(0, 0)
    this.add.rectangle(0, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)
    this.add.rectangle(WORLD_W - 4, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)

    this.add.text(16, 18, 'HABITACIÓN 02', {
      fontFamily: 'Share Tech Mono',
      fontSize: '10px',
      color: '#1e1e1e',
      letterSpacing: 5,
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(1)

    this.drawWallMarks()
  }

  /**
   * Placeholder visual de las marcas en la pared: tres círculos luminosos
   * con los símbolos (casa, osito, puerta) resaltados. Reemplazar por un
   * sprite/imagen real cuando esté listo el arte (p. ej. 'wall-marks-p1').
   */
  private drawWallMarks() {
    const obj = ROOM_02_OBJECTS[0]
    const symbols = [
      { label: 'CASA',   icon: '🏠' },
      { label: 'OSITO',  icon: '🧸' },
      { label: 'PUERTA', icon: '🚪' },
    ]

    const startX = obj.x - 90
    const gap = 90

    this.add.rectangle(obj.x, obj.y, obj.width, obj.height, 0x141414, 0.6)
      .setStrokeStyle(1, 0x2a2a2a)
      .setDepth(4)

    symbols.forEach((s, i) => {
      const x = startX + i * gap
      const circle = this.add.circle(x, obj.y, 30, 0x000000, 0)
        .setStrokeStyle(2, 0xd8c98a, 0.9)
        .setDepth(6)

      this.tweens.add({
        targets: circle,
        alpha: { from: 0.5, to: 1 },
        duration: 900,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      })

      this.add.text(x, obj.y, s.icon, {
        fontFamily: 'Share Tech Mono',
        fontSize: '20px',
      }).setOrigin(0.5).setDepth(7)

      this.add.text(x, obj.y + 44, s.label, {
        fontFamily: 'Share Tech Mono',
        fontSize: '9px',
        color: '#8a8060',
        letterSpacing: 2,
      }).setOrigin(0.5).setDepth(7)
    })
  }

  private setupInput() {
    const kb = this.input.keyboard!
    this.keyW = kb.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keyA = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyS = kb.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keyE = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.keyQ = kb.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
  }

  private createWallColliders() {
    this.wallColliders = this.physics.add.staticGroup()
    const thickness = 24
    const LEFT = 250, RIGHT = 1020, TOP = 215, BOTTOM = 645
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
