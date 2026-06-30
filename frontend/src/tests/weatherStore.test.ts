import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

import { useWeatherStore } from '@/stores/weatherStore'

describe('weatherStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('inicia sin atmósfera cargada', () => {
    const weatherStore = useWeatherStore()

    expect(weatherStore.atmosphere).toBeNull()
  })

  it('guarda la atmósfera recibida desde el servicio REST', () => {
    const weatherStore = useWeatherStore()

    weatherStore.setAtmosphere({
      condition: 'rain',
      temperature: 13,
      isNight: true,
    })

    expect(weatherStore.atmosphere).toEqual({
      condition: 'rain',
      temperature: 13,
      isNight: true,
    })
  })
})