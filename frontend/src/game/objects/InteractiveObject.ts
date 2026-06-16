import Phaser from 'phaser'

export class InteractiveObject extends Phaser.GameObjects.Rectangle {
  constructor(scene: Phaser.Scene, x: number, y: number, w: number, h: number) {
    super(scene, x, y, w, h, 0x1a1a1a)
    scene.add.existing(this)
  }
}
