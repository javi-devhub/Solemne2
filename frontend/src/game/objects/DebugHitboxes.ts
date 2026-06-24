import Phaser from 'phaser'

/**
 * DebugHitboxes — helper visual para depurar colisiones y zonas de interacción.
 *
 * Uso típico dentro de una escena:
 *
 *   private debugHitboxes!: DebugHitboxes
 *
 *   create() {
 *     ...
 *     this.debugHitboxes = new DebugHitboxes(this)
 *     this.debugHitboxes.trackStaticGroup(this.wallColliders, 0xff0000)      // paredes
 *     this.debugHitboxes.trackStaticGroup(this.obstacleColliders, 0xff8800)  // cama/camilla/banquitos
 *     this.debugHitboxes.trackInteractables(ROOM_01_OBJECTS, 0x00ff00)       // zonas interactivas
 *   }
 *
 *   update() {
 *     this.debugHitboxes.refresh()
 *   }
 *
 * Activar/desactivar con F1 (tecla global, se registra sola).
 */
export class DebugHitboxes {
  private scene: Phaser.Scene
  private graphics: Phaser.GameObjects.Graphics
  private enabled = false

  private staticGroups: { group: Phaser.Physics.Arcade.StaticGroup; color: number }[] = []
  private interactables: { list: { x: number; y: number; width: number; height: number }[]; color: number }[] = []

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.graphics = scene.add.graphics()
    this.graphics.setDepth(99999) // siempre encima de todo
    this.graphics.setScrollFactor(1) // se mueve con la cámara, igual que el mundo

    const keyF1 = scene.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.F1)
    keyF1?.on('down', () => {
      this.enabled = !this.enabled
      this.graphics.setVisible(this.enabled)
      console.log(`[DebugHitboxes] ${scene.scene.key}: ${this.enabled ? 'ON' : 'OFF'}`)
    })

    this.graphics.setVisible(false)
  }

  /** Registra un StaticGroup completo (paredes, obstáculos) para dibujarlo cada frame. */
  trackStaticGroup(group: Phaser.Physics.Arcade.StaticGroup, color = 0xff0000) {
    this.staticGroups.push({ group, color })
  }

  /** Registra una lista de objetos interactivos (con x, y, width, height en coords de mundo). */
  trackInteractables(list: { x: number; y: number; width: number; height: number }[], color = 0x00ff00) {
    this.interactables.push({ list, color })
  }

  /** Llamar en cada update() de la escena. No hace nada si el debug está apagado. */
  refresh() {
    if (!this.enabled) return
    this.graphics.clear()

    for (const { group, color } of this.staticGroups) {
      this.graphics.lineStyle(2, color, 0.9)
      this.graphics.fillStyle(color, 0.15)
      group.children.each((child) => {
        const body = (child as Phaser.Physics.Arcade.Sprite).body as Phaser.Physics.Arcade.StaticBody
        if (!body) return true
        this.graphics.strokeRect(body.x, body.y, body.width, body.height)
        this.graphics.fillRect(body.x, body.y, body.width, body.height)
        return true
      })
    }

    for (const { list, color } of this.interactables) {
      this.graphics.lineStyle(2, color, 0.9)
      this.graphics.fillStyle(color, 0.12)
      for (const obj of list) {
        const left = obj.x - obj.width / 2
        const top = obj.y - obj.height / 2
        this.graphics.strokeRect(left, top, obj.width, obj.height)
        this.graphics.fillRect(left, top, obj.width, obj.height)
      }
    }
  }

  destroy() {
    this.graphics.destroy()
  }
}