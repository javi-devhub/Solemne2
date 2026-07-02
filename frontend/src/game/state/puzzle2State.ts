export type WallSymbol = 'casa' | 'osito' | 'puerta'

// ── Orden real de los símbolos en la pared, de izquierda a derecha ──────
// Esto es lo que ve la Jugadora 1 (la que recuerda).
const symbolOrder: WallSymbol[] = ['casa', 'osito', 'puerta']

// ── Número asociado a cada posición de la cuadrícula ─────────────────────
// Esto es lo que ve la Jugadora 2 (la que olvida). El índice corresponde
// a la posición de symbolOrder (0 = posición #1, 1 = posición #2, etc).
const positionNumbers: number[] = [4, 1, 7]

// El código correcto son los números leídos en orden: "417"
const CORRECT_CODE = positionNumbers.join('')

export const puzzle2State = {
  /** Dígitos que J2 ha ingresado hasta ahora (máx. 3 caracteres). */
  enteredCode: '' as string,

  /** true una vez que se ingresó el código correcto. */
  solved: false,

  /** true justo después de un intento fallido (feedback visual/glitch). */
  lastAttemptWrong: false,

  // ── Reset completo para nueva partida ─────────────────────────────
  reset() {
    this.enteredCode = ''
    this.solved = false
    this.lastAttemptWrong = false
  },

  // ── Datos que ve cada jugadora ─────────────────────────────────────
  getSymbolOrder(): WallSymbol[] {
    return symbolOrder
  },

  getPositionNumbers(): number[] {
    return positionNumbers
  },

  // ── J2: escribir el código en el panel ─────────────────────────────
  appendDigit(digit: string) {
    if (this.solved) return
    if (this.enteredCode.length >= CORRECT_CODE.length) return
    this.enteredCode += digit
    this.lastAttemptWrong = false
  },

  deleteLastDigit() {
    if (this.solved) return
    this.enteredCode = this.enteredCode.slice(0, -1)
    this.lastAttemptWrong = false
  },

  // ── J2: confirmar el código con ENTER ───────────────────────────────
  submitCode(): { correct: boolean; message: string } {
    if (this.solved) {
      return { correct: true, message: 'El panel ya está desbloqueado.' }
    }

    if (this.enteredCode.length < CORRECT_CODE.length) {
      return {
        correct: false,
        message: `Código incompleto. Faltan ${CORRECT_CODE.length - this.enteredCode.length} dígito(s).`,
      }
    }

    if (this.enteredCode === CORRECT_CODE) {
      this.solved = true
      this.lastAttemptWrong = false
      return { correct: true, message: 'Código correcto. El panel se desbloquea.' }
    }

    this.lastAttemptWrong = true
    this.enteredCode = ''
    return { correct: false, message: 'Código incorrecto. La pared vibra levemente.' }
  },

  // ── Estado visible en el panel de J2 ────────────────────────────────
  getPanelStatus(): string {
    if (this.solved) return '■ CONFIRMADO — Panel desbloqueado.'
    if (this.lastAttemptWrong) return '✕ Código incorrecto. Vuelve a intentar.'
    return `Dígitos ingresados: ${this.enteredCode.length}/${CORRECT_CODE.length}`
  },
}
