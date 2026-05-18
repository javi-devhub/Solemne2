import { Scene } from 'phaser';

export class MainMenuScene extends Scene {
    private background!: Phaser.GameObjects.Image;

    constructor() {
        super({ key: 'MainMenuScene' });
    }

    preload() {
        // Cargar la imagen usando la ruta universal de la carpeta public
        this.load.image('bg-main-menu', '/assets/backgrounds/main-menu.png');
        
        // Debugging: Nos avisa en consola si hay un error de carga
        this.load.on('loaderror', (fileObj: any) => {
            console.error('Error cargando el fondo:', fileObj.key, fileObj.src);
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
        // Todo lo que añadas después (botones, texto) tendrá un depth mayor y se verá encima.
        this.background.setDepth(-1); 
    }
}