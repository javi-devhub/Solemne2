import Phaser from 'phaser'
import { Player } from '../objects/Player'
import { ROOM_01_OBJECTS } from '../data/interactable'
import { gameBus } from '@/composables/useGameEventBus'
import { puzzle1State, type TeddyPart } from '../state/puzzle1State'

const WORLD_W  = 1280
const WORLD_H  = 720
const SPEED    = 180
const FLOOR_Y  = WORLD_H * 0.72
const INTERACT_DIST = 80

export class SceneP1 extends Phaser.Scene {
  private player!:  Player
  private keyW!:    Phaser.Input.Keyboard.Key
  private keyA!:    Phaser.Input.Keyboard.Key
  private keyS!:    Phaser.Input.Keyboard.Key
  private keyD!:    Phaser.Input.Keyboard.Key
  private keyE!:    Phaser.Input.Keyboard.Key
  private keyQ!:    Phaser.Input.Keyboard.Key

  private inspectText!: Phaser.GameObjects.Text
  private inspectTextTimer?: Phaser.Time.TimerEvent

  private teddyPanel!: Phaser.GameObjects.Container
  private teddyPanelText!: Phaser.GameObjects.Text
  private teddySelectedIndex = 0
  private teddyParts: TeddyPart[] = ['oreja', 'nariz', 'brazo']
  private isPuzzlePanelOpen = false
  private solvedMessageShown = false

  constructor() { super({ key: 'SceneP1' }) }

  create() {
    this.physics.world.setBounds(0, 0, WORLD_W, WORLD_H)
    this.buildRoom()

    this.player = new Player(this, 300, FLOOR_Y - 40, 1, WORLD_W, WORLD_H)

    const floor = this.physics.add.staticImage(WORLD_W / 2, FLOOR_Y + 4, '__DEFAULT')
    floor.setDisplaySize(WORLD_W, 8).refreshBody().setAlpha(0)
    this.physics.add.collider(this.player.body, floor)

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
    padding: {
      x: 12,
      y: 8,
  },
})
  .setOrigin(0.5)
  .setScrollFactor(0)
  .setDepth(999)
  .setVisible(false)

  this.createTeddyPanel()

    // Tecla E — interactuar
  this.keyE.on('down', () => this.tryInteract())
 }

  update() {

    if (this.isPuzzlePanelOpen) {
    this.handleTeddyPanelInput()
    this.player.move(0)
    this.player.updateLabel()
    return
  }
    let vx = 0
    if (this.keyA.isDown) vx = -SPEED
    if (this.keyD.isDown) vx =  SPEED
    this.player.move(vx)

    if (Phaser.Input.Keyboard.JustDown(this.keyW)) {
    
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
      // Convertir coordenadas mundo → pantalla (mitad izquierda)
      const cam   = this.cameras.main
      const sx    = (nearest.x - cam.scrollX) * cam.zoom
      const sy    = (nearest.y - cam.scrollY) * cam.zoom - 40

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
    const { x, y } = this.player.getPosition()
    for (const obj of ROOM_01_OBJECTS) {
      const dist = Phaser.Math.Distance.Between(x, y, obj.x, obj.y)
      if (dist < INTERACT_DIST) {
        const cam  = this.cameras.main
        const sx   = (obj.x - cam.scrollX) * cam.zoom
        const sy   = (obj.y - cam.scrollY) * cam.zoom - 60

        console.log('J1 inspeccionó:', obj.descriptionP1)
        this.showInspectMessage(obj.descriptionP1)
        this.openTeddyPanel()

        gameBus.emit('p1:interact', {
          objectId:    obj.id,
          description: obj.descriptionP1,
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
  private createTeddyPanel() {
  const panelBg = this.add.rectangle(320, 260, 420, 260, 0x050505, 0.95)
    .setStrokeStyle(1, 0x444444)

  this.teddyPanelText = this.add.text(320, 260, '', {
    fontFamily: 'Share Tech Mono',
    fontSize: '14px',
    color: '#dddddd',
    align: 'left',
    wordWrap: {
      width: 360,
    },
  }).setOrigin(0.5)

  this.teddyPanel = this.add.container(0, 0, [
    panelBg,
    this.teddyPanelText,
  ])

  this.teddyPanel
    .setScrollFactor(0)
    .setDepth(1000)
    .setVisible(false)
}

private openTeddyPanel() {
  this.isPuzzlePanelOpen = true
  this.refreshTeddyPanel()
  this.teddyPanel.setVisible(true)
}

private refreshTeddyPanel() {
  const selectedPart = this.teddyParts[this.teddySelectedIndex]

   if (puzzle1State.solved) {
    this.teddyPanelText.setText(
      [
        '[ OSITO COSIDO ]',
        '',
        'El osito dejó de temblar.',
        'Las costuras parecen haberse acomodado.',
        '',
        'Estado: SINCRONIZADO',
        '',
        'Se escuchó un clic metálico a lo lejos.',
        'La puerta parece haberse desbloqueado.',
        '',
        'Q: cerrar',
      ].join('\n'),
    )
    return
  }

  this.teddyPanelText.setText(
    [

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
    ].join('\n'),
  )
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
  }

  if (puzzle1State.solved && !this.solvedMessageShown) {
    this.solvedMessageShown = true
    this.showInspectMessage('Se escuchó un clic metálico. La puerta se desbloqueó.')
  }


  if (Phaser.Input.Keyboard.JustDown(this.keyQ)){
    this.closeTeddyPanel()
  }
}

  private closeTeddyPanel() {
    this.isPuzzlePanelOpen = false
    this.teddyPanel.setVisible(false)
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

    // Objeto central del puzzle — J1 lo ve como osito
    this.addPuzzleObject(
      ROOM_01_OBJECTS[0].x,
      ROOM_01_OBJECTS[0].y,
      '🧸', '#3a3030'
    )

    this.addDoor(180, floorY)
    this.addDoor(WORLD_W - 180, floorY)
  }

  private addPuzzleObject(x: number, y: number, icon: string, color: string) {
    // Círculo de interacción (radio visual)
    const g = this.add.graphics()
    g.lineStyle(1, 0x2a2020, 0.4)
    g.strokeCircle(x, y, INTERACT_DIST)

    // Placeholder visual del objeto
    this.add.rectangle(x, y, 48, 48, 0x1a1010)
      .setStrokeStyle(1, 0x2e2020).setDepth(5)
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
    const kb  = this.input.keyboard!
    this.keyW = kb.addKey(Phaser.Input.Keyboard.KeyCodes.W)
    this.keyA = kb.addKey(Phaser.Input.Keyboard.KeyCodes.A)
    this.keyS = kb.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.keyD = kb.addKey(Phaser.Input.Keyboard.KeyCodes.D)
    this.keyE = kb.addKey(Phaser.Input.Keyboard.KeyCodes.E)
    this.keyQ= kb.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
  }
}