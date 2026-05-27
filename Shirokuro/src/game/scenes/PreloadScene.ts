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

    // ── 1. AGREGA TODAS LAS CARGAS DE TU JUEGO AQUÍ ABAJO ─────────────────
    
    // Fondos de las habitaciones
    this.load.image('bg-stage1', '/assets/backgrounds/scene1-pj1.png')
    this.load.image('bg-stage1-j2', '/assets/backgrounds/scene1-pj2.png')

    // Sprites de los personajes — 4 direcciones por jugador
    this.load.image('player1-down',  'assets/backgrounds/sprites/player1-down.png')
    this.load.image('player1-up',    'assets/backgrounds/sprites/player1-up.png')
    this.load.image('player1-right', 'assets/backgrounds/sprites/player1-right.png')
    this.load.image('player1-left',  'assets/backgrounds/sprites/player1-left.png')

    this.load.image('player2-down',  'assets/backgrounds/sprites/player2-down.png')
    this.load.image('player2-up',    'assets/backgrounds/sprites/player2-up.png')
    this.load.image('player2-right', 'assets/backgrounds/sprites/player2-right.png')
    this.load.image('player2-left',  'assets/backgrounds/sprites/player2-left.png')

    // Puertas interactivas
    this.load.image('door-closed', '/assets/sprites/door-closed.png')
    this.load.image('door-open', '/assets/sprites/door_open.png')

    // Audios
    this.load.audio('musica-menu', '/audio/puzzle1.mp3');
    
    // ──────────────────────────────────────────────────────────────────────
  }

  create() {
    // Lanzar ambas escenas de jugador + HUD en paralelo
    this.scene.launch('SceneP1')
    this.scene.launch('SceneP2')
    this.scene.launch('HUDScene')
    // PreloadScene se detiene — ya no hace nada
    this.scene.stop()

    const musica = this.sound.add('musica-menu', { loop: true, volume: 0.5 });
    musica.play();

    // Activar el despertador por si el navegador bloquea el autoplay
    window.addEventListener('click', () => {
        if (this.sound && typeof this.sound.resumeAll === 'function') {
            this.sound.resumeAll();
        }
        if (!musica.isPlaying) {
            musica.play();
        }
    }, { once: true });

    // Al final, tu cambio de escena al menú principal
    this.scene.start('MainMenuScene');
}
  }