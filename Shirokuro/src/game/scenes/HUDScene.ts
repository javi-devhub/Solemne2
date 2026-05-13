import Phaser from 'phaser'

const GAME_W = 1280
const GAME_H = 720
const MID    = GAME_W / 2

export class HUDScene extends Phaser.Scene {

  constructor() {
    super({ key: 'HUDScene', active: false })
  }

  create() {
    // ── Línea divisoria central ──
    const divider = this.add.graphics()
    divider.lineStyle(1, 0x2a2a2a, 1)
    divider.lineBetween(MID, 0, MID, GAME_H)

    // ── Labels J1 / J2 pegados a la línea central, arriba ──
    const labelStyle = {
      fontFamily: 'Share Tech Mono',
      fontSize: '9px',
      color: '#2a2a2a',
      letterSpacing: 4,
    }
    this.add.text(MID - 8, 8, 'J1', labelStyle).setOrigin(1, 0)
    this.add.text(MID + 8, 8, 'J2', labelStyle).setOrigin(0, 0)

    // ── Barras de cordura — esquina inferior de cada mitad ──
    // J1: esquina inferior izquierda
    this.buildSanityBar(16, GAME_H - 16, 'CORDURA')
    // J2: esquina inferior de la mitad derecha
    this.buildSanityBar(MID + 16, GAME_H - 16, 'CORDURA')

    // ── Prompts de interacción — junto a la línea, abajo ──
    this.add.text(MID - 8, GAME_H - 8, '[E]', {
      fontFamily: 'Share Tech Mono', fontSize: '7px', color: '#1e1e1e',
    }).setOrigin(1, 1)

    this.add.text(MID + 8, GAME_H - 8, '[ENTER]', {
      fontFamily: 'Share Tech Mono', fontSize: '7px', color: '#1e1e1e',
    }).setOrigin(0, 1)

    // La HUD tiene su propia cámara fija — nunca se mueve
    this.cameras.main.setScroll(0, 0)
  }

  private buildSanityBar(x: number, y: number, label: string) {
    const barW = 90
    const barH = 2

    this.add.text(x, y - 12, label, {
      fontFamily: 'Share Tech Mono',
      fontSize: '7px',
      color: '#1e1e1e',
      letterSpacing: 2,
    }).setOrigin(0, 0)

    // Fondo
    this.add.rectangle(x, y, barW, barH, 0x111111).setOrigin(0, 1)
    // Barra llena
    this.add.rectangle(x, y, barW, barH, 0x2a2a2a).setOrigin(0, 1)
  }
}