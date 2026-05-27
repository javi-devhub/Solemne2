import { Scene } from 'phaser';

export class MainMenuScene extends Scene {
    private background!: Phaser.GameObjects.Image;
    private musicaPuzzle!: Phaser.Sound.BaseSound;
    private audioWeb: HTMLAudioElement | null = null;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Cargar la imagen usando la ruta universal de la carpeta public
        this.load.image('bg-main-menu', '/assets/backgrounds/main-menu.png');
        
        // Cargar el audio apuntando correctamente a la carpeta public/audio/
        this.load.audio('musica-menu', '/audio/puzzle1.mp3');
        
        // Debugging: Nos avisa en consola si hay un error de carga
        this.load.on('loaderror', (fileObj: any) => {
            console.error('Error cargando recurso:', fileObj.key, fileObj.src);
        });
    }

    create() {
        // Asegurarnos de que el fondo de la cámara por defecto sea negro por si acaso
        this.cameras.main.setBackgroundColor('#000000');

        const { width, height } = this.scale;

        // Añadimos la imagen centrándola
        this.background = this.add.image(width / 2, height / 2, 'bg-main-menu');
        
        // Escalamos la imagen para que cubra todo el canvas
        this.background.setDisplaySize(width, height);

        // CLAVE: Aseguramos que mantenga la nitidez de Pixel Art
        this.background.texture.setFilter(Phaser.Textures.FilterMode.NEAREST);

        // CLAVE 2: Forzamos a que esté en la profundidad más baja.
        this.background.setDepth(-1); 

        if (!this.audioWeb) {
            this.audioWeb = new Audio('/audio/inicio.mp3');
            this.audioWeb.loop = true;
            this.audioWeb.volume = 0.5; // Ajusta el volumen a tu gusto
        }

        this.audioWeb.play().catch(() => {
            console.log("El navegador frena el audio automático. Esperando interacción...");
        });

        const desbloquearAudio = () => {
            if (this.audioWeb && this.audioWeb.paused) {
                this.audioWeb.play()
                    .then(() => console.log("Música de inicio activada correctamente."))
                    .catch(err => console.error("Error al reproducir:", err));
            }
            // Limpiamos los eventos para que no sigan escuchando
            window.removeEventListener('click', desbloquearAudio);
            window.removeEventListener('keydown', desbloquearAudio);
        };

        window.addEventListener('click', desbloquearAudio);
        window.addEventListener('keydown', desbloquearAudio);

        // Añadimos la música configurando el loop y el volumen
        this.musicaPuzzle = this.sound.add('musica-menu', { loop: true, volume: 0.5 });

        // 1. Intentamos reproducir de inmediato (si el navegador ya tiene interacción previa, sonará)
        this.musicaPuzzle.play();

        // 2. FUNCIÓN DESPERTADORA GENERAL
        const despertarAudio = () => {
            console.log("¡Interacción detectada! Despertando audio...");
            
            // Forzar a Phaser a resumir el contexto de audio
            if (this.sound && typeof this.sound.resumeAll === 'function') {
                this.sound.resumeAll();
            }

            // Si la música se quedó en pausa por el bloqueo, le damos play
            if (!this.musicaPuzzle.isPlaying) {
                this.musicaPuzzle.play();
            }

            // Limpiamos los eventos globales para que no se queden escuchando infinitamente
            window.removeEventListener('click', despertarAudio);
            window.removeEventListener('keydown', despertarAudio);
        };

        // 3. Escuchamos un Clic O una tecla en cualquier parte de la ventana
        window.addEventListener('click', despertarAudio);
        window.addEventListener('keydown', despertarAudio);
    }
}