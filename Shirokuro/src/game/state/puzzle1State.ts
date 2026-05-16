export type TeddyPart = 'oreja' | 'nariz' | 'brazo'

const correctSequence: TeddyPart[] = ['oreja', 'nariz', 'brazo']

export const puzzle1State = {
  progress: 0,
  solved: false,
  lastPart: '' as TeddyPart | '',

  rotatePart(part: TeddyPart) {
    if (this.solved) {
      return {
        ok: true,
        messageP1: 'El osito ya quedó en calma.',
        messageP2: 'La señal sigue estable.',
      }
    }

    const expectedPart = correctSequence[this.progress]
    this.lastPart = part

    if (part === expectedPart) {
      this.progress += 1

      if (this.progress >= correctSequence.length) {
        this.solved = true

        return {
          ok: true,
          messageP1: `Giraste ${part}. Algo hizo clic dentro del osito.`,
          messageP2: 'Señal estabilizada. Ritmo sincronizado.',
        }
      }

      return {
        ok: true,
        messageP1: `Giraste ${part}. El osito vibra suavemente.`,
        messageP2: `La señal mejora. Estabilidad: ${this.progress}/3.`,
      }
    }

    this.progress = 0

    return {
      ok: false,
      messageP1: `Giraste ${part}. El osito se tensó otra vez.`,
      messageP2: 'La señal se desestabilizó. La calibración volvió al inicio.',
    }
  },

  getDeviceStatus() {
    if (this.solved) {
      return 'Señal estabilizada. La puerta parece haberse desbloqueado.'
    }

    if (this.progress === 0) {
      return 'Señal muy inestable. No hay sincronía.'
    }

    if (this.progress === 1) {
      return 'Señal parcialmente estable. Algo cambió en el primer punto.'
    }

    if (this.progress === 2) {
      return 'Señal casi estable. Falta un último ajuste.'
    }

    return 'Lectura desconocida.'
  },
}