import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { PlayerState } from '@/types/player'

const defaultPlayer1 = (): PlayerState => ({
  id: 1,
  name: 'Jugador 1',
  position: { x: 300, y: 480 },
  isMoving: false,
  facingDirection: 'right',
  health: 100,
  sanity: 100,
  isAlive: true,
})

const defaultPlayer2 = (): PlayerState => ({
  id: 2,
  name: 'Jugador 2',
  position: { x: 980, y: 480 },
  isMoving: false,
  facingDirection: 'left',
  health: 100,
  sanity: 100,
  isAlive: true,
})

export const usePlayerStore = defineStore('player', () => {
  const player1 = ref<PlayerState>(defaultPlayer1())
  const player2 = ref<PlayerState>(defaultPlayer2())

  function resetPlayers() {
    player1.value = defaultPlayer1()
    player2.value = defaultPlayer2()
  }

  function updatePosition(playerId: 1 | 2, x: number, y: number) {
    const player = playerId === 1 ? player1 : player2
    player.value.position = { x, y }
  }

  function decreaseSanity(playerId: 1 | 2, amount: number) {
    const player = playerId === 1 ? player1 : player2
    player.value.sanity = Math.max(0, player.value.sanity - amount)
    if (player.value.sanity === 0) player.value.isAlive = false
  }

  return {
    player1,
    player2,
    resetPlayers,
    updatePosition,
    decreaseSanity,
  }
})