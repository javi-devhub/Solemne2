import Phaser from 'phaser'

const GAME_W = 1280
const GAME_H = 720
const MID    = GAME_W / 2

export class HUDScene extends Phaser.Scene {

  constructor() {
    super({ key: 'HUDScene', active: false })
  }

  create() {
    const divider = this.add.graphics()
    divider.lineStyle(1, 0x2a2a2a, 1)
    divider.lineBetween(MID, 0, MID, GAME_H)
    divider.fillStyle(0x333333, 1)
    divider.fillRect(MID - 1, GAME_H / 2 - 20, 3, 40)

    const labelStyle = {
      fontFamily: 'Share Tech Mono',
      fontSize: '9px',
      color: '#333333',
      letterSpacing: 4,
    }
    this.add.text(MID - 12, 10, 'J1', labelStyle).setOrigin(1, 0)
    this.add.text(MID + 12, 10, 'J2', labelStyle).setOrigin(0, 0)

    this.buildSanityBar(20, GAME_H - 20)
    this.buildSanityBar(MID + 20, GAME_H - 20)

    this.add.text(MID - 12, GAME_H - 18, '[E] INTERACTUAR', {
      fontFamily: 'Share Tech Mono', fontSize: '7px', color: '#222222',
    }).setOrigin(1, 1)
    this.add.text(MID + 12, GAME_H - 18, '[ENTER] INTERACTUAR', {
      fontFamily: 'Share Tech Mono', fontSize: '7px', color: '#222222',
    }).setOrigin(0, 1)

    this.cameras.main.setScroll(0, 0)
  }

  private buildSanityBar(x: number, y: number) {
    const barW = 100, barH = 3
    this.add.text(x, y - 10, 'CORDURA', {
      fontFamily: 'Share Tech Mono', fontSize: '7px',
      color: '#282828', letterSpacing: 2,
    }).setOrigin(0, 1)
    this.add.rectangle(x + barW / 2, y, barW, barH, 0x111111).setOrigin(0.5, 1)
    this.add.rectangle(x + barW / 2, y, barW, barH, 0x2a2a2a).setOrigin(0.5, 1)
  }
}