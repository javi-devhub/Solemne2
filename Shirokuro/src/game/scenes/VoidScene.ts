import Phaser from 'phaser'

export class VoidScene extends Phaser.Scene {
  constructor() {
    super({ key: 'VoidScene' })
  }

  create() {
    // Pintamos el fondo completamente negro
    this.cameras.main.setBackgroundColor('#000000')

    // Opcional: Un pequeño texto al centro por si quieres verificar que funcionó
    this.add.text(this.cameras.main.width / 2, this.cameras.main.height / 2, 'ESPACIO VACÍO', {
      fontFamily: 'Share Tech Mono',
      fontSize: '20px',
      color: '#333333'
    }).setOrigin(0.5)
  }
}