import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ROOM_01_OBJECTS } from '../data/interactable'
import { gameBus } from '@/composables/useGameEventBus'
import { puzzle1State } from '../state/puzzle1State'
import { Door } from '../objects/Door'

const WORLD_W       = 1280
const WORLD_H       = 720
const SPEED         = 180
const FLOOR_Y       = WORLD_H * 0.72
const INTERACT_DIST = 80

export class SceneP2 extends Phaser.Scene {
  private player!:    Player
  private background!: Phaser.GameObjects.Image;
  private cursors!:   Phaser.Types.Input.Keyboard.CursorKeys
  private keyEnter!:  Phaser.Input.Keyboard.Key
  private keyBackspace!: Phaser.Input.Keyboard.Key
  private wallColliders!: Phaser.Physics.Arcade.StaticGroup

  private devicePanel!: Phaser.GameObjects.Container
  private devicePanelText!: Phaser.GameObjects.Text
  private isDevicePanelOpen = false

  private inspectText!: Phaser.GameObjects.Text
  private inspectTextTimer?: Phaser.Time.TimerEvent

  // ── Puerta J2 ──────────────────────────────────────────────────────
  // Posición: ajusta doorX / doorY para que coincida con tu fondo
  // Una vez que tengas el sprite de puerta, ya todo está conectado.
  private door2!: Door
  private door2Obstacle!: Phaser.Physics.Arcade.Image
  private door2Solved = false
  // Coordenadas de la puerta en el mundo de J2 — ajústalas a tu fondo
  private readonly DOOR2_X = 570
  private readonly DOOR2_Y = 150

  constructor() { super({ key: 'SceneP2' }) }

  preload() {
    this.load.image('door-closed', '/assets/backgrounds/sprites/door-closed.png')
    this.load.image('door-open',   '/assets/backgrounds/sprites/door-open.png')
  }

  create() {
    // Resetear estado al iniciar (nueva partida)
    this.door2Solved = false

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.buildRoom()

    this.background = this.add.image(640, 360, 'bg-stage1-j2');
    this.background.texture.setFilter(Phaser.Textures.FilterMode.NEAREST); // Pixel Art impecable
    this.background.setDepth(-1); // Detrás de jugadores y paneles

    this.player = new Player(this, 520, 530, 2, WORLD_W, WORLD_H)

    // ── Puerta J2 ──────────────────────────────────────────────────
    // La textura 'door-closed' ya existe — cuando tengas tu propio sprite
    // para J2 solo cambia el segundo argumento del constructor de Door.
    this.door2 = new Door(this, this.DOOR2_X, this.DOOR2_Y, 'door-closed')
    this.physics.add.collider(this.player.body, this.door2.sprite)

    // Obstáculo invisible que bloquea físicamente el paso por la puerta
    this.door2Obstacle = this.physics.add.staticImage(this.DOOR2_X, this.DOOR2_Y - 15, '')
    this.door2Obstacle.setSize(200, 30)
    this.door2Obstacle.refreshBody()
    this.door2Obstacle.setVisible(false)
    this.door2.linkObstacle(this.door2Obstacle)
    this.physics.add.collider(this.player.body, this.door2Obstacle)

    //const floor = this.physics.add.staticImage(WORLD_W / 2, FLOOR_Y + 4, '__DEFAULT')
    //floor.setDisplaySize(WORLD_W, 8).refreshBody().setAlpha(0)
    //this.physics.add.collider(this.player.body, floor)

    const wallL = this.physics.add.staticImage(0, WORLD_H / 2, '__DEFAULT')
    wallL.setDisplaySize(8, WORLD_H).refreshBody().setAlpha(0)
    const wallR = this.physics.add.staticImage(WORLD_W, WORLD_H / 2, '__DEFAULT')
    wallR.setDisplaySize(8, WORLD_H).refreshBody().setAlpha(0)
    this.physics.add.collider(this.player.body, wallL)
    this.physics.add.collider(this.player.body, wallR)
    this.createWallColliders()

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

    // Abrir puerta J2 solo cuando puzzle1State.solved (J2 ya presionó ENTER)
    if (puzzle1State.solved && !this.door2Solved) {
      this.door2Solved = true
      this.door2.open()
    }

    if (this.isDevicePanelOpen) {
    if (Phaser.Input.Keyboard.JustDown(this.keyEnter)) {
      this.handleEnterOnDevice()
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyBackspace)) {
      this.closeDevicePanel()
    }

    this.player.moveFree(0, 0)
    this.player.updateLabel()
    return
  }
    let vx = 0 
    let vy = 0
    if (this.cursors.left.isDown)  vx = -SPEED
    if (this.cursors.right.isDown) vx =  SPEED
    if (this.cursors.up.isDown) vy = -SPEED
    if (this.cursors.down.isDown) vy = SPEED
    this.player.moveFree(vx, vy)

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
  const panelBg = this.add.rectangle(320, 280, 440, 340, 0x050505, 0.95)
    .setStrokeStyle(1, 0x334455)

  this.devicePanelText = this.add.text(320, 280, '', {
    fontFamily: 'Share Tech Mono',
    fontSize: '12px',
    color: '#dddddd',
    align: 'left',
    lineSpacing: 3,
    wordWrap: {
      width: 390,
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
        'Estado: CONFIRMADO',
        status,
        '',
        '¡La puerta se abrió!',
        '',
        'Backspace: cerrar',
      ].join('\n'),
    )
    return
  }

  if (puzzle1State.sequenceComplete) {
    this.devicePanelText.setText(
      [
        '[ DISPOSITIVO MÉDICO ]',
        '',
        'La pantalla muestra una señal estable.',
        'El otro jugador sincronizó su parte.',
        '',
        status,
        '',
        '▶ ENTER: confirmar y abrir la puerta',
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

/**
 * J2 presiona ENTER en el panel:
 * - Si la secuencia de J1 está completa → confirmar y abrir ambas puertas
 * - Si no → solo refrescar la lectura
 */
private handleEnterOnDevice() {
  const result = puzzle1State.confirmDevice()

  if (result.confirmed) {
    // Puzzle resuelto: mensaje + refrescar panel (las puertas se abren en update())
    this.showInspectMessage('¡Confirmado! La puerta se desbloqueó.')
    this.refreshDevicePanel()
  } else {
    // Solo refrescar lectura
    this.refreshDevicePanel()
    if (!puzzle1State.sequenceComplete) {
      this.showInspectMessage('Señal inestable. El otro jugador aún no completó su parte.')
    }
  }
}

private closeDevicePanel() {
  this.isDevicePanelOpen = false
  this.devicePanel.setVisible(false)
}


  private buildRoom() {
    //this.add.rectangle(0, 0, WORLD_W, WORLD_H, 0x060606).setOrigin(0, 0)
    const floorY = FLOOR_Y
    //this.add.rectangle(0, floorY, WORLD_W, WORLD_H - floorY, 0x0a0a0a).setOrigin(0, 0)
    //this.add.line(0, 0, 0, floorY, WORLD_W, floorY, 0x1e1e1e).setLineWidth(1).setOrigin(0, 0)
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
      'device-sprite', '#1a2030'
    )

    this.addDoor(180, floorY)
    this.addDoor(WORLD_W - 180, floorY)
  }

  private addPuzzleObject(x: number, y: number, textureKey: string, _color: string) {
    const g = this.add.graphics()
    g.lineStyle(1, 0x202a30, 0.4)
    g.strokeCircle(x, y, INTERACT_DIST)

    // Sprite del objeto (reemplaza el emoji placeholder)
    this.add.image(x, y, textureKey)
      .setDisplaySize(48, 48)
      .setOrigin(0.5)
      .setDepth(6)
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
  private createWallColliders() {
    this.wallColliders = this.physics.add.staticGroup()

    const thickness = 24

    const LEFT = 250
    const RIGHT = 920
    const TOP = 205
    const BOTTOM = 645

    const centerX = (LEFT + RIGHT) / 2
    const centerY = (TOP + BOTTOM) / 2
    const width = RIGHT - LEFT
    const height = BOTTOM - TOP

  // Pared superior
    this.wallColliders
    .create(centerX, TOP, '__DEFAULT')
    .setDisplaySize(width, thickness)
    .setAlpha(0.3)
    .refreshBody()

  // Pared inferior
    this.wallColliders
    .create(centerX, BOTTOM, '__DEFAULT')
    .setDisplaySize(width, thickness)
    .setAlpha(0.3)
    .refreshBody()

  // Pared izquierda
    this.wallColliders
    .create(LEFT, centerY, '__DEFAULT')
    .setDisplaySize(thickness, height)
    .setAlpha(0.3)
    .refreshBody()

  // Pared derecha
    this.wallColliders
    .create(RIGHT, centerY, '__DEFAULT')
    .setDisplaySize(thickness, height)
    .setAlpha(0.3)
    .refreshBody()

    this.physics.add.collider(this.player.body, this.wallColliders)
}
}