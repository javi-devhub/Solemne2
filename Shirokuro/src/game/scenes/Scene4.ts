import Phaser from 'phaser'
export class Scene4 extends Phaser.Scene {
  constructor() { super({ key: 'Scene4' }) }
  create() {
    this.add.text(640, 360, 'ESCENA 4 — EN CONSTRUCCIÓN', {
      fontFamily: 'Share Tech Mono', fontSize: '18px', color: '#333333',
    }).setOrigin(0.5)
  }
}
