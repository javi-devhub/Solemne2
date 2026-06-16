export interface InteractableObject {
  id: string
  x: number
  y: number
  width: number
  height: number
  // Lo que ve cada jugador al inspeccionar
  descriptionP1: string
  descriptionP2: string
  // Prompt que aparece al acercarse
  promptP1: string
  promptP2: string
  // Si forma parte de un puzzle
  puzzleId?: string
  // Acciones disponibles (para objetos de puzzle)
  actions?: PuzzleAction[]
}

export interface PuzzleAction {
  id: string
  label: string        // "GIRAR", "PRESIONAR", "SOLTAR"
  triggeredBy: 1 | 2  // qué jugador ejecuta esta acción
  order: number        // posición en la secuencia correcta
}