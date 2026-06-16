import { PreloadScene } from './scenes/PreloadScene';
import { SceneP1 } from './scenes/SceneP1';
import { SceneP2 } from './scenes/SceneP2';
import { HUDScene } from './scenes/HUDScene';
import { MainMenuScene } from './scenes/MainMenuScene';

export function createPhaserConfig(parent: HTMLElement): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent,
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: true,
    antialias: false,
    roundPixels: true,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },

    audio: {
            disableWebAudio: true // Fuerza a usar HTML5 Audio, ideal para romper bloqueos de inicio
        },
        
    scene: [PreloadScene, MainMenuScene, SceneP1, SceneP2, HUDScene],
  }
}