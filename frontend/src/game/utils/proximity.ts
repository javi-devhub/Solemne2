/**
 * proximity.ts — detección de cercanía e interacción basada en rectángulos (AABB)
 * en vez de distancia circular a un punto central.
 *
 * Por qué: un objeto como la puerta (60×100) es alargado. Medir la distancia
 * al punto central con un círculo fijo hace que, en diagonal, se pueda
 * interactuar desde más lejos de lo esperado, y en línea recta desde menos.
 * Calculando la distancia al BORDE más cercano del rectángulo, el área de
 * interacción respeta la forma real del objeto.
 */

export interface AABBLike {
  x: number
  y: number
  width: number
  height: number
}

/**
 * Distancia desde un punto (px, py) al borde más cercano del rectángulo `box`.
 * Devuelve 0 si el punto ya está dentro del rectángulo.
 */
export function distanceToBox(px: number, py: number, box: AABBLike): number {
  const left   = box.x - box.width / 2
  const right  = box.x + box.width / 2
  const top    = box.y - box.height / 2
  const bottom = box.y + box.height / 2

  const dx = Math.max(left - px, 0, px - right)
  const dy = Math.max(top - py, 0, py - bottom)

  return Math.sqrt(dx * dx + dy * dy)
}

/**
 * Encuentra, dentro de `list`, el objeto más cercano a (px, py) cuyo borde
 * esté a una distancia menor o igual a `margin`. Devuelve null si ninguno califica.
 */
export function findNearestInteractable<T extends AABBLike>(
  px: number,
  py: number,
  list: T[],
  margin: number,
): T | null {
  let nearest: T | null = null
  let minDist = margin

  for (const obj of list) {
    const dist = distanceToBox(px, py, obj)
    if (dist <= minDist) {
      minDist = dist
      nearest = obj
    }
  }

  return nearest
}