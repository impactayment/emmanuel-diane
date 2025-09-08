"use client"

import { useState, useEffect } from "react"

interface WeatherData {
  temperature: number
  weatherCode: number
  isDay: boolean
}

interface HourlyWeatherData {
  [hour: string]: WeatherData
}

interface WeatherResponse {
  current: {
    temperature_2m: number
    weather_code: number
    is_day: number
  }
  hourly: {
    time: string[]
    temperature_2m: number[]
    weather_code: number[]
    is_day: number[]
  }
}

// Coordonnées de Boissy-Saint-Léger (Domaine le plouy)
const BOISSY_LAT = 48.7511
const BOISSY_LON = 2.5097

// Fonction pour convertir le code météo en emoji et description
const getWeatherEmoji = (code: number, isDay: boolean): string => {
  // Codes météo selon la documentation Open-Meteo
  if (code === 0) return isDay ? "☀️" : "🌙" // Ciel dégagé
  if (code === 1 || code === 2) return isDay ? "🌤️" : "☁️" // Partiellement nuageux
  if (code === 3) return "☁️" // Nuageux
  if (code === 45 || code === 48) return "🌫️" // Brouillard
  if (code >= 51 && code <= 55) return "🌦️" // Bruine
  if (code >= 56 && code <= 57) return "🌨️" // Bruine verglaçante
  if (code >= 61 && code <= 65) return "🌧️" // Pluie
  if (code >= 66 && code <= 67) return "🌨️" // Pluie verglaçante
  if (code >= 71 && code <= 77) return "❄️" // Neige
  if (code >= 80 && code <= 82) return "🌧️" // Averses
  if (code >= 85 && code <= 86) return "🌨️" // Averses de neige
  if (code >= 95 && code <= 99) return "⛈️" // Orage
  return "☁️" // Par défaut
}

export function useWeather() {
  const [weather, setWeather] = useState<WeatherData | null>(null)
  const [hourlyWeather, setHourlyWeather] = useState<HourlyWeatherData>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        setLoading(true)
        setError(null)

        // Obtenir la date du mariage (14 septembre 2025)
        const weddingDate = new Date('2025-09-14')
        const today = new Date()
        
        // Si on est le jour du mariage, utiliser les prévisions horaires
        // Sinon, utiliser la météo actuelle pour tout
        const isWeddingDay = today.toDateString() === weddingDate.toDateString()
        
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${BOISSY_LAT}&longitude=${BOISSY_LON}&current=temperature_2m,weather_code,is_day&hourly=temperature_2m,weather_code,is_day&timezone=Europe/Paris&forecast_days=1`
        )

        if (!response.ok) {
          throw new Error("Erreur lors de la récupération de la météo")
        }

        const data: WeatherResponse = await response.json()

        setWeather({
          temperature: Math.round(data.current.temperature_2m),
          weatherCode: data.current.weather_code,
          isDay: data.current.is_day === 1,
        })
        
        // Traiter les données horaires
        const hourlyData: HourlyWeatherData = {}
        
        if (data.hourly && data.hourly.time) {
          data.hourly.time.forEach((time, index) => {
            const date = new Date(time)
            const hour = date.getHours()
            hourlyData[`${hour}h`] = {
              temperature: Math.round(data.hourly.temperature_2m[index]),
              weatherCode: data.hourly.weather_code[index],
              isDay: data.hourly.is_day[index] === 1
            }
          })
        }
        
        setHourlyWeather(hourlyData)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erreur inconnue")
        // En cas d'erreur, définir une météo par défaut
        setWeather({
          temperature: 20,
          weatherCode: 0,
          isDay: true,
        })
      } finally {
        setLoading(false)
      }
    }

    // Récupérer la météo immédiatement
    fetchWeather()

    // Mettre à jour la météo toutes les 30 minutes
    const interval = setInterval(fetchWeather, 30 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  const weatherEmoji = weather ? getWeatherEmoji(weather.weatherCode, weather.isDay) : "☀️"
  
  // Fonction pour obtenir la météo à une heure spécifique
  const getWeatherForTime = (timeString: string) => {
    // Extraire l'heure du format "14h30" -> 14
    const hour = parseInt(timeString.split('h')[0])
    const hourKey = `${hour}h`
    
    // Si on a des données horaires pour cette heure, les utiliser
    if (hourlyWeather[hourKey]) {
      const hourData = hourlyWeather[hourKey]
      return {
        temperature: hourData.temperature,
        weatherEmoji: getWeatherEmoji(hourData.weatherCode, hourData.isDay)
      }
    }
    
    // Sinon, utiliser la météo actuelle
    return {
      temperature: weather?.temperature ?? 20,
      weatherEmoji
    }
  }

  return {
    temperature: weather?.temperature ?? 20,
    weatherEmoji,
    getWeatherForTime,
    loading,
    error,
  }
}