import Phaser from 'phaser'

export class InstructionsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'InstructionsScene' })
    }

    create() {
        const { width, height } = this.scale

        this.cameras.main.setBackgroundColor('#000000')

        // ── Título ──────────────────────────────────────────────
        this.add.text(width / 2, height * 0.09, 'INSTRUCCIONES', {
            fontFamily: 'Share Tech Mono',
            fontSize: '32px',
            color: '#ffffff',
            letterSpacing: 4,
        }).setOrigin(0.5)

        // ── Mecánica cooperativa (la pieza clave a entender) ─────
        const textoMecanica = [
            'Cada jugador ve algo distinto del mismo cuarto.',
            'Jugador 1 ve un osito de peluche con partes sueltas.',
            'Jugador 2 ve un dispositivo médico con una señal inestable.',
            '',
            'J1 debe girar las partes del osito en el orden correcto.',
            'J2 debe confirmar la lectura en el dispositivo,',
            'pero solo cuando J1 haya terminado su secuencia.',
            'Ninguno puede resolverlo solo: comuníquense en voz alta.',
        ].join('\n')

        this.add.text(width / 2, height * 0.24, textoMecanica, {
            fontFamily: 'Share Tech Mono',
            fontSize: '15px',
            color: '#cccccc',
            align: 'center',
            lineSpacing: 6,
        }).setOrigin(0.5)

        // ── Columna Jugador 1 ─────────────────────────────────────
        const colY = height * 0.58
        const colJ1X = width * 0.27
        const colJ2X = width * 0.73

        this.add.text(colJ1X, colY - 90, 'JUGADOR 1', {
            fontFamily: 'Share Tech Mono',
            fontSize: '18px',
            color: '#ffffff',
            letterSpacing: 2,
        }).setOrigin(0.5)

        const textoJ1 = [
            'Mover: W A S D',
            'Interactuar: E',
            '',
            'Dentro del panel del osito:',
            'A / D — cambiar parte',
            'E — girar parte seleccionada',
            'Q — cerrar panel',
            '',
            'Inventario: I',
        ].join('\n')

        this.add.text(colJ1X, colY, textoJ1, {
            fontFamily: 'Share Tech Mono',
            fontSize: '14px',
            color: '#aaaaaa',
            align: 'left',
            lineSpacing: 6,
        }).setOrigin(0.5)

        // ── Columna Jugador 2 ─────────────────────────────────────
        this.add.text(colJ2X, colY - 90, 'JUGADOR 2', {
            fontFamily: 'Share Tech Mono',
            fontSize: '18px',
            color: '#ffffff',
            letterSpacing: 2,
        }).setOrigin(0.5)

        const textoJ2 = [
            'Mover: flechas ↑ ↓ ← →',
            'Interactuar: P',
            '',
            'Dentro del panel del dispositivo:',
            'ENTER — actualizar / confirmar lectura',
            'BACKSPACE — cerrar panel',
            '',
            'Inventario: O',
        ].join('\n')

        this.add.text(colJ2X, colY, textoJ2, {
            fontFamily: 'Share Tech Mono',
            fontSize: '14px',
            color: '#aaaaaa',
            align: 'left',
            lineSpacing: 6,
        }).setOrigin(0.5)

        // ── Línea divisoria entre columnas ────────────────────────
        const divider = this.add.graphics()
        divider.lineStyle(1, 0x2a2a2a, 1)
        divider.lineBetween(width / 2, height * 0.38, width / 2, height * 0.78)

        // ── Continuar ──────────────────────────────────────────────
        this.add.text(width / 2, height * 0.87, 'Presiona ESPACIO o haz clic en CONTINUAR para empezar', {
            fontFamily: 'Share Tech Mono',
            fontSize: '13px',
            color: '#666666',
        }).setOrigin(0.5)

        const botonContinuar = this.add.text(width / 2, height * 0.93, 'CONTINUAR', {
            fontFamily: 'Share Tech Mono',
            fontSize: '20px',
            color: '#ffffff',
            backgroundColor: '#222222',
            padding: { x: 16, y: 8 },
        })
            .setOrigin(0.5)
            .setInteractive({ useHandCursor: true })

        botonContinuar.on('pointerover', () => botonContinuar.setColor('#ff0000'))
        botonContinuar.on('pointerout', () => botonContinuar.setColor('#ffffff'))
        botonContinuar.on('pointerdown', () => this.iniciarPuzle())

        this.input.keyboard?.once('keydown-SPACE', () => this.iniciarPuzle())
    }

    private iniciarPuzle() {
        // Lanzamos el puzle real recién aquí, cuando el jugador ya leyó las instrucciones
        this.scene.launch('SceneP1')
        this.scene.launch('SceneP2')
        this.scene.launch('HUDScene')

        // Música del puzle, movida aquí desde PreloadScene
        const musica = this.sound.add('musica-menu', { loop: true, volume: 0.5 })
        musica.play()

        window.addEventListener('click', () => {
            if (this.sound && typeof this.sound.resumeAll === 'function') {
                this.sound.resumeAll()
            }
            if (!musica.isPlaying) {
                musica.play()
            }
        }, { once: true })

        // InstructionsScene ya no se necesita
        this.scene.stop()
    }
}