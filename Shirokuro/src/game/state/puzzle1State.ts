export type TeddyPart = 'oreja' | 'nariz' | 'brazo'

const correctSequence: TeddyPart[] = ['oreja', 'nariz', 'brazo']

export const puzzle1State = {
  progress: 0,

  /**
   * J1 completó la secuencia correcta.
   * Las puertas NO se abren todavía — falta que J2 confirme con ENTER.
   */
  sequenceComplete: false,

  /**
   * J2 confirmó la lectura con ENTER después de que J1 completó la secuencia.
   * Esto es lo que dispara la apertura de ambas puertas.
   */
  solved: false,

  lastPart: '' as TeddyPart | '',

  // ── Reset completo para nueva partida ─────────────────────────────
  reset() {
    this.progress         = 0
    this.sequenceComplete = false
    this.solved           = false
    this.lastPart         = ''
  },

  // ── J1: girar parte del osito ──────────────────────────────────────
  rotatePart(part: TeddyPart): { ok: boolean; messageP1: string; messageP2: string } {
    // Si ya se resolvió del todo, no hacer nada
    if (this.solved) {
      return {
        ok: true,
        messageP1: 'El osito ya quedó en calma.',
        messageP2: 'La señal sigue estable.',
      }
    }

    // Si la secuencia ya está completa pero J2 aún no confirmó
    if (this.sequenceComplete) {
      return {
        ok: true,
        messageP1: 'El osito permanece quieto. Esperando al otro lado...',
        messageP2: 'Señal lista. Presiona ENTER para confirmar.',
      }
    }

    const expectedPart = correctSequence[this.progress]
    this.lastPart = part

    if (part === expectedPart) {
      this.progress += 1

      // Secuencia completada por J1
      if (this.progress >= correctSequence.length) {
        this.sequenceComplete = true
        return {
          ok: true,
          messageP1: [
            `Giraste ${part}. Algo hizo clic dentro del osito.`,
            'El osito dejó de temblar.',
            '',
            'Esperando confirmación del otro lado...',
          ].join('\n'),
          messageP2: 'Señal estabilizada. Confirma con ENTER para abrir la puerta.',
        }
      }

      return {
        ok: true,
        messageP1: `Giraste ${part}. El osito vibra suavemente.`,
        messageP2: `La señal mejora. Estabilidad: ${this.progress}/3.`,
      }
    }

    // Parte incorrecta → reiniciar progreso
    this.progress = 0
    return {
      ok: false,
      messageP1: `Giraste ${part}. El osito se tensó otra vez.`,
      messageP2: 'La señal se desestabilizó. La calibración volvió al inicio.',
    }
  },

  // ── J2: confirmar con ENTER (solo funciona si la secuencia está lista) ──
  confirmDevice(): { confirmed: boolean; message: string } {
    if (this.solved) {
      return { confirmed: false, message: 'Ya confirmado. La puerta está abierta.' }
    }

    if (!this.sequenceComplete) {
      return {
        confirmed: false,
        message: 'La señal todavía es inestable. El otro jugador aún no completó su parte.',
      }
    }

    // ¡Confirmar! Ambas puertas se abren
    this.solved = true
    return {
      confirmed: true,
      message: 'Señal confirmada. ¡Puerta desbloqueada!',
    }
  },

  // ── Estado visible en el panel del dispositivo de J2 ──────────────
  getDeviceStatus(): string {
    if (this.solved) {
      return '■ CONFIRMADO — Puerta desbloqueada.'
    }
    if (this.sequenceComplete) {
      return '▶ SEÑAL LISTA — Presiona ENTER para confirmar.'
    }
    if (this.progress === 0) return ' Señal muy inestable. No hay sincronía.'
    if (this.progress === 1) return ' Señal parcialmente estable. Algo cambió en el primer punto.'
    if (this.progress === 2) return ' Señal casi estable. Falta un último ajuste.'
    return 'Lectura desconocida.'
  },
}
