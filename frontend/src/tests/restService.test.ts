import { afterEach, describe, expect, it, vi } from 'vitest'

import { getWeatherAtmosphere } from '@/services/restService'

describe('restService', () => {
  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllGlobals()
  })

  it('obtiene la atmósfera desde /api/weather', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        condition: 'rain',
        temperature: 13,
        isNight: true,
      }),
    })

    vi.stubGlobal('fetch', fetchMock)

    const atmosphere = await getWeatherAtmosphere()

    expect(atmosphere).toEqual({
      condition: 'rain',
      temperature: 13,
      isNight: true,
    })

    expect(fetchMock).toHaveBeenCalledWith(
      expect.stringContaining('/api/weather'),
    )
  })

  it('lanza error si el backend responde con error', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({
          message: 'Error',
        }),
      }),
    )

    await expect(getWeatherAtmosphere()).rejects.toThrow(
      'No se pudo obtener el clima',
    )
  })
})