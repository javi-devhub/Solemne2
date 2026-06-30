import { Router } from 'express'

const router = Router()

type OpenWeatherResponse = {
  main: {
    temp: number
  }
  weather: {
    main: string
    description: string
  }[]
  dt: number
  sys: {
    sunrise: number
    sunset: number
  }
}

function normalizeCondition(weatherMain: string): 'rain' | 'thunderstorm' | 'mist' {
  const value = weatherMain.toLowerCase()

  if (value.includes('thunderstorm')) {
    return 'thunderstorm'
  }

  if (
    value.includes('mist') ||
    value.includes('fog') ||
    value.includes('haze') ||
    value.includes('smoke')
  ) {
    return 'mist'
  }

  return 'rain'
}

router.get('/', async (_req, res) => {
  try {
    const apiKey = process.env.OPENWEATHER_API_KEY

    if (!apiKey) {
      return res.status(500).json({
        message: 'Falta configurar OPENWEATHER_API_KEY',
      })
    }

    const params = new URLSearchParams({
      q: 'Bergen,NO',
      appid: apiKey,
      units: 'metric',
      lang: 'es',
    })

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?${params.toString()}`,
    )

    if (!response.ok) {
     const errorText = await response.text()

    console.error('OpenWeatherMap error:', {
        status: response.status,
        body: errorText,
    })

    return res.status(response.status).json({
        message: 'No se pudo obtener el clima desde OpenWeatherMap',
        status: response.status,
        detail: errorText,
    })
}

    const data = (await response.json()) as OpenWeatherResponse

    const weatherMain = data.weather[0]?.main ?? 'Rain'
    const condition = normalizeCondition(weatherMain)
    const temperature = Math.round(data.main.temp)

    const currentTime = data.dt
    const isNight = currentTime < data.sys.sunrise || currentTime > data.sys.sunset

    return res.json({
      condition,
      temperature,
      isNight,
    })
  } catch (error) {
    console.error('Error en /api/weather:', error)

    return res.status(500).json({
      message: 'Error interno al consultar el clima',
    })
  }
})

export default router