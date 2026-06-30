import { defineStore } from 'pinia'
import { ref } from 'vue'

export type WeatherCondition = 'rain' | 'thunderstorm' | 'mist'

export type WeatherAtmosphere = {
  condition: WeatherCondition
  temperature: number
  isNight: boolean
}

export const useWeatherStore = defineStore('weather', () => {
  const atmosphere = ref<WeatherAtmosphere | null>(null)

  function setAtmosphere(value: WeatherAtmosphere) {
    atmosphere.value = value
  }

  return {
    atmosphere,
    setAtmosphere,
  }
})