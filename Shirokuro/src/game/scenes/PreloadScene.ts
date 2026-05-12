import Phaser from 'phaser'

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' })
  }

  preload() {
    const width  = this.cameras.main.width
    const height = this.cameras.main.height

    const progressBar = this.add.graphics()
    const progressBox = this.add.graphics()
    progressBox.fillStyle(0x111111, 0.8)
    progressBox.fillRect(width / 2 - 160, height / 2 - 15, 320, 30)

    const loadingText = this.add.text(width / 2, height / 2 - 40, 'CARGANDO...', {
      fontFamily: 'Share Tech Mono',
      fontSize: '14px',
      color: '#666666',
      letterSpacing: 6,
    }).setOrigin(0.5)

    this.load.on('progress', (value: number) => {
      progressBar.clear()
      progressBar.fillStyle(0x333333, 1)
      progressBar.fillRect(width / 2 - 158, height / 2 - 13, 316 * value, 26)
    })

    this.load.on('complete', () => {
      progressBar.destroy()
      progressBox.destroy()
      loadingText.destroy()
    })
  }

  create() {
    // Lanzar ambas escenas de jugador + HUD en paralelo
    this.scene.launch('SceneP1')
    this.scene.launch('SceneP2')
    this.scene.launch('HUDScene')
    // PreloadScene se detiene — ya no hace nada
    this.scene.stop()
  }
}