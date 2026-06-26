import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ROOM_01_OBJECTS } from '../data/interactable'
import { gameBus } from '@/composables/useGameEventBus'
import { puzzle1State, type TeddyPart } from '../state/puzzle1State'
import { Door } from '../objects/Door'
import { DebugHitboxes } from '../objects/DebugHitboxes'
import { findNearestInteractable } from '../utils/proximity'


const WORLD_W  = 1280
const WORLD_H  = 720
const SPEED    = 180
const FLOOR_Y  = WORLD_H * 0.72
const INTERACT_MARGIN = 48 // distancia máxima desde el BORDE del objeto, no desde su centro

export class SceneP1 extends Phaser.Scene {
  private player!:  Player
  private background!: Phaser.GameObjects.Image
  private keyW!:    Phaser.Input.Keyboard.Key
  private keyA!:    Phaser.Input.Keyboard.Key
  private keyS!:    Phaser.Input.Keyboard.Key
  private keyD!:    Phaser.Input.Keyboard.Key
  private keyE!:    Phaser.Input.Keyboard.Key
  private keyQ!:    Phaser.Input.Keyboard.Key

  private inspectText!: Phaser.GameObjects.Text
  private inspectTextTimer?: Phaser.Time.TimerEvent
  private wallColliders!: Phaser.Physics.Arcade.StaticGroup
  private furnitureColliders!: Phaser.Physics.Arcade.StaticGroup

  private teddyPanel!: Phaser.GameObjects.Container
  private teddyPanelText!: Phaser.GameObjects.Text
  private teddySelectedIndex = 0
  private teddyParts: TeddyPart[] = ['oreja', 'nariz', 'brazo']
  private isPuzzlePanelOpen = false
  private solvedMessageShown = false

  private door!: Door
  private doorObstacle!: Phaser.Physics.Arcade.Image
  private debugHitboxes!: DebugHitboxes

  constructor() { super({ key: 'SceneP1' }) }

  preload() {
    this.load.image('door-closed', '/assets/backgrounds/sprites/door-closed.png')
    this.load.image('door-open',   '/assets/backgrounds/sprites/door-open.png')
    
    // ── CARGA DE LA IMAGEN FINAL DE ÉXITO ─────────────────────────────
    this.load.image('fin-puzzle', '/assets/backgrounds/sprites/finpuzzle1.png')
  }

  create() {
    puzzle1State.reset()
    this.solvedMessageShown = false

    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.buildRoom()

    this.background = this.add.image(640, 360, 'bg-stage1')
    this.background.setDepth(-1)

    this.player = new Player(this, 300, FLOOR_Y - 40, 1, WORLD_W, WORLD_H)
    this.createWallColliders()
    this.createFurnitureColliders()

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

    this.createTeddyPanel()

    this.keyE.on('down', () => this.tryInteract())

    // ── Debug visual de hitboxes (F1 para activar/desactivar) ───────────
    this.debugHitboxes = new DebugHitboxes(this)
    this.debugHitboxes.trackStaticGroup(this.wallColliders, 0xff0000)      // paredes: rojo
    this.debugHitboxes.trackStaticGroup(this.furnitureColliders, 0xff8800) // muebles: naranja
    this.debugHitboxes.trackInteractables(ROOM_01_OBJECTS, 0x00ff00)       // interactuables: verde
  }

  update() {
    if (this.isPuzzlePanelOpen) {
      this.handleTeddyPanelInput()
      this.player.moveFree(0, 0)
      this.player.updateLabel()
      return
    }

    let vx = 0
    let vy = 0
    if (this.keyA.isDown) vx = -SPEED
    if (this.keyD.isDown) vx =  SPEED
    if (this.keyW.isDown) vy = -SPEED
    if (this.keyS.isDown) vy =  SPEED
    this.player.moveFree(vx, vy)
    this.player.updateLabel()
    this.checkProximity()
    this.debugHitboxes.refresh()
  }

  /**
   * Ejecuta la cinemática controlada manteniendo el encuadre en el recuadro del Jugador 1
   */
  private playDoorOpeningCinematic() {
    this.isPuzzlePanelOpen = true
    this.player.moveFree(0, 0)

    const cam = this.cameras.main
    cam.stopFollow()

    // Centramos el paneo en X: 320 para que la cámara izquierda no se desplace al lado de J2
    cam.pan(320, 150, 1000, 'Quad.easeInOut', false, (camera, progress) => {
      if (progress === 1) {
        
        // Parpadeo de ampolleta en el fondo
        this.time.addEvent({
          delay: 60,
          repeat: 5,
          callback: () => {
            if (this.background.isTinted) {
              this.background.clearTint()
            } else {
              this.background.setTint(0x222222)
            }
          }
        })

        // Ejecuta el flash, shake y cambio de textura en tu Door.ts
        this.time.delayedCall(400, () => {
          this.background.clearTint()
          this.door.open()
        })

        // ── ACTUALIZACIÓN DE CIERRE: NO REGRESA LA CÁMARA, DISPARA LA IMAGEN FINAL ──
        // Esperamos 1.3 segundos para ver la animación completa de tu puerta abrirse
        this.time.delayedCall(1300, () => {
          this.showEndPuzzleScreen()
        })
      }
    })
  }

  /**
   * Muestra la pantalla estática de éxito rompiendo el split-screen por completo
   */
  private showEndPuzzleScreen() {
    // 1. Buscamos y apagamos por completo la cámara de P2 para que no dibuje en el lado derecho
    const sceneP2 = this.scene.get('SceneP2')
    if (sceneP2 && sceneP2.cameras && sceneP2.cameras.main) {
      sceneP2.cameras.main.setVisible(false)
    }

    // 2. Buscamos y apagamos la cámara del HUD si existe
    const hudScene = this.scene.get('HUDScene')
    if (hudScene && hudScene.cameras && hudScene.cameras.main) {
      hudScene.cameras.main.setVisible(false)
    }

    // 3. Forzamos a la cámara de P1 a estirarse a los 1280x720 del monitor global
    const cam = this.cameras.main
    cam.setViewport(0, 0, 1280, 720)
    cam.setBounds(0, 0, 1280, 720)

    // 4. Creamos un gran fondo negro que cubra todo el nuevo tamaño de pantalla
    const blackBg = this.add.rectangle(640, 360, 1280, 720, 0x000000)
    blackBg.setScrollFactor(0).setDepth(9999)

    // 5. Colocamos tu imagen 'fin-puzzle' centrada de forma absoluta (640, 360)
    const endImage = this.add.image(640, 360, 'fin-puzzle')
    endImage.setScrollFactor(0).setDepth(10000) // Depth ultra alto
    
    // Forzamos el renderizado Pixel Art nítido
    if (endImage.texture) {
      endImage.texture.setFilter(Phaser.Textures.FilterMode.NEAREST)
    }

    // 6. Escalamos la imagen para obligarla a cubrir toda la resolución de 1280x720
    endImage.setDisplaySize(1280, 720)

    console.log("Pantalla completa finpuzzle1.png desplegada rompiendo el split-screen.");
  }

  private checkProximity() {
    const { x, y } = this.player.getPosition()
    const nearest = findNearestInteractable(x, y, ROOM_01_OBJECTS, INTERACT_MARGIN)

    if (nearest) {
      const cam = this.cameras.main
      const sx  = (nearest.x - cam.scrollX) * cam.zoom
      const sy  = (nearest.y - cam.scrollY) * cam.zoom - 40
      gameBus.emit('p1:proximity', {
        objectId: nearest.id,
        prompt:   nearest.promptP1,
        screenX:  sx,
        screenY:  sy,
      })
    } else {
      gameBus.emit('p1:proximity', null)
    }
  }

  private tryInteract() {
    if (this.isPuzzlePanelOpen) return

    const { x, y } = this.player.getPosition()
    const obj = findNearestInteractable(x, y, ROOM_01_OBJECTS, INTERACT_MARGIN)
    if (!obj) return

    const cam = this.cameras.main
    const sx  = (obj.x - cam.scrollX) * cam.zoom
    const sy  = (obj.y - cam.scrollY) * cam.zoom - 60

    this.showInspectMessage(obj.descriptionP1)
    this.openTeddyPanel()

    gameBus.emit('p1:interact', {
      objectId:    obj.id,
      description: obj.descriptionP1,
      actions:     obj.actions ?? [],
      screenX:     sx,
      screenY:     sy,
    })
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

  private createTeddyPanel() {
    const panelBg = this.add.rectangle(320, 280, 440, 340, 0x050505, 0.95)
      .setStrokeStyle(1, 0x444444)

    this.teddyPanelText = this.add.text(320, 280, '', {
      fontFamily: 'Share Tech Mono',
      fontSize: '12px',
      color: '#dddddd',
      align: 'left',
      lineSpacing: 3,
      wordWrap: { width: 390 },
    }).setOrigin(0.5)

    this.teddyPanel = this.add.container(0, 0, [panelBg, this.teddyPanelText])
    this.teddyPanel.setScrollFactor(0).setDepth(1000).setVisible(false)
  }

  private openTeddyPanel() {
    this.isPuzzlePanelOpen = true
    this.refreshTeddyPanel()
    this.teddyPanel.setVisible(true)
  }

  private refreshTeddyPanel() {
    const selectedPart = this.teddyParts[this.teddySelectedIndex]

    if (puzzle1State.solved) {
      this.teddyPanelText.setText([
        '[ OSITO COSIDO ]',
        '',
        'El osito dejó de temblar.',
        'Las costuras parecen haberse acomodado.',
        '',
        'Estado: CONFIRMADO',
        '',
        'La puerta se abrió.',
        '',
        'Q: cerrar',
      ].join('\n'))
      return
    }

    if (puzzle1State.sequenceComplete) {
      this.teddyPanelText.setText([
        '[ OSITO CODIDO ]',
        '',
        'El osito quedó quieto.',
        'Algo hizo clic en su interior.',
        '',
        'Estado: ESPERANDO CONFIRMACIÓN',
        '',
        'El otro jugador debe confirmar',
        'desde su dispositivo.',
        '',
        'Q: cerrar',
      ].join('\n'))
      return
    }

    this.teddyPanelText.setText([
      '[ OSITO COSIDO ]',
      '',
      'El osito tiene partes sueltas.',
      'Algunas reaccionan con pequeños parpadeos.',
      '',
      'Pista:',
      'La oreja parece responder primero.',
      'La nariz vibra después.',
      'El brazo se mueve al final.',
      '',
      `Parte seleccionada: ${selectedPart.toUpperCase()}`,
      '',
      'A / D: cambiar parte',
      'E: girar parte',
      'Q: cerrar',
    ].join('\n'))
  }

  private handleTeddyPanelInput() {
    if (Phaser.Input.Keyboard.JustDown(this.keyA)) {
      this.teddySelectedIndex--
      if (this.teddySelectedIndex < 0) {
        this.teddySelectedIndex = this.teddyParts.length - 1
      }
      this.refreshTeddyPanel()
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyD)) {
      this.teddySelectedIndex++
      if (this.teddySelectedIndex >= this.teddyParts.length) {
        this.teddySelectedIndex = 0
      }
      this.refreshTeddyPanel()
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyE)) {
      const selectedPart = this.teddyParts[this.teddySelectedIndex]
      const result = puzzle1State.rotatePart(selectedPart)
      this.showInspectMessage(result.messageP1)
      this.refreshTeddyPanel()

      if (result.ok === false) {
        this.triggerGlitch()
      }
    }

    if (puzzle1State.solved && !this.solvedMessageShown) {
      this.solvedMessageShown = true
      this.showInspectMessage('¡Confirmado! La puerta se desbloqueó.')
      this.closeTeddyPanel()
      this.playDoorOpeningCinematic()
    }

    if (Phaser.Input.Keyboard.JustDown(this.keyQ)) {
      this.closeTeddyPanel()
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
          cam.setScroll(
            cam.scrollX + Phaser.Math.Between(-6, 6),
            cam.scrollY + Phaser.Math.Between(-3, 3),
          )
          cam.setAlpha(0.7)
        } else {
          cam.setAlpha(1)
        }
        if (count >= 10) {
          cam.setAlpha(1)
        }
      },
    })
  }

  private closeTeddyPanel() {
    this.isPuzzlePanelOpen = false
    this.teddyPanel.setVisible(false)
  }

  /**
   * Obstáculos físicos puramente decorativos: cama, escritorios, mesa y banquitos.
   * Solo bloquean el paso — no son interactuables (no van en ROOM_01_OBJECTS).
   * Coordenadas estimadas sobre bg-stage1; calibrar con F1 (DebugHitboxes) contra el fondo real.
   */
  private createFurnitureColliders() {
    this.furnitureColliders = this.physics.add.staticGroup()

    const muebles = [
      { x: 195,  y: 275, w: 150, h: 190 }, // cama
      { x: 960,  y: 215, w: 140, h: 100 }, // escritorio con espejo
      { x: 1145, y: 385, w: 120, h: 150 }, // mesa con dibujos/lápices
      { x: 120,  y: 535, w: 40,  h: 36 },  // banquito izquierdo
      { x: 320,  y: 525, w: 44,  h: 40 },  // banquito con planta
    ]

    for (const m of muebles) {
      this.furnitureColliders
        .create(m.x, m.y, '__DEFAULT')
        .setDisplaySize(m.w, m.h)
        .setAlpha(0)
        .refreshBody()
    }

    this.physics.add.collider(this.player.body, this.furnitureColliders)
  }

  private buildRoom() {
    this.add.rectangle(0, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)
    this.add.rectangle(WORLD_W - 4, 0, 4, WORLD_H, 0x1a1a1a).setOrigin(0, 0)

    this.add.text(16, 18, 'HABITACIÓN 01', {
      fontFamily: 'Share Tech Mono',
      fontSize: '10px',
      color: '#1e1e1e',
      letterSpacing: 5,
    }).setOrigin(0, 0).setScrollFactor(0).setDepth(1)

    this.addPuzzleObject(
      ROOM_01_OBJECTS[0].x,
      ROOM_01_OBJECTS[0].y,
      'teddy-sprite',
      '#3a3030',
    )
  }

  private addPuzzleObject(x: number, y: number, textureKey: string, _color: string) {
    this.add.image(x, y, textureKey)
      .setDisplaySize(68, 48)
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
    const kb  = this.input.keyboard!
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
    const LEFT   = 250
    const RIGHT  = 1020
    const TOP    = 215
    const BOTTOM = 645

    const centerX = (LEFT + RIGHT) / 2
    const centerY = (TOP + BOTTOM) / 2
    const width   = RIGHT - LEFT
    const height  = BOTTOM - TOP

    this.wallColliders.create(centerX, TOP, '__DEFAULT').setDisplaySize(width, thickness).setAlpha(0.3).refreshBody()
    this.wallColliders.create(centerX, BOTTOM, '__DEFAULT').setDisplaySize(width, thickness).setAlpha(0.3).refreshBody()
    this.wallColliders.create(LEFT, centerY, '__DEFAULT').setDisplaySize(thickness, height).setAlpha(0.3).refreshBody()
    this.wallColliders.create(RIGHT, centerY, '__DEFAULT').setDisplaySize(thickness, height).setAlpha(0.3).refreshBody()

    this.physics.add.collider(this.player.body, this.wallColliders)
  }
}
