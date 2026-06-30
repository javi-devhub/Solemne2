const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3001'

export type WeatherAtmosphere = {
  condition: 'rain' | 'thunderstorm' | 'mist'
  temperature: number
  isNight: boolean
}

export async function getWeatherAtmosphere(): Promise<WeatherAtmosphere> {
  const response = await fetch(`${API_URL}/api/weather`)

  if (!response.ok) {
    throw new Error('No se pudo obtener el clima')
  }

  return response.json()
}