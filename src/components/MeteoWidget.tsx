import { useState, useEffect } from 'react'
import { Cloud, Sun, CloudRain, Wind, Droplets, Thermometer, Calendar, MapPin, TrendingUp, AlertTriangle } from 'lucide-react'

interface WeatherData {
  current: {
    temp: number
    humidity: number
    windSpeed: number
    condition: 'sunny' | 'cloudy' | 'rainy'
    description: string
  }
  forecast: Array<{
    day: string
    temp: number
    humidity: number
    condition: 'sunny' | 'cloudy' | 'rainy'
    precipitation: number
  }>
  agricultural: {
    evapotranspiration: number
    soilMoisture: number
    growingDegreeDays: number
    frostRisk: boolean
    irrigationRecommendation: string
  }
}

// Simulated weather data - in production, this would come from OpenWeatherMap or similar API
const mockWeatherData: WeatherData = {
  current: {
    temp: 22,
    humidity: 65,
    windSpeed: 12,
    condition: 'sunny',
    description: 'Ensoleillé'
  },
  forecast: [
    { day: 'Auj.', temp: 22, humidity: 65, condition: 'sunny', precipitation: 0 },
    { day: 'Mar', temp: 24, humidity: 60, condition: 'cloudy', precipitation: 2 },
    { day: 'Mer', temp: 20, humidity: 75, condition: 'rainy', precipitation: 15 },
    { day: 'Jeu', temp: 21, humidity: 70, condition: 'cloudy', precipitation: 5 },
    { day: 'Ven', temp: 23, humidity: 55, condition: 'sunny', precipitation: 0 },
    { day: 'Sam', temp: 25, humidity: 50, condition: 'sunny', precipitation: 0 },
    { day: 'Dim', temp: 24, humidity: 60, condition: 'sunny', precipitation: 0 },
  ],
  agricultural: {
    evapotranspiration: 4.2,
    soilMoisture: 72,
    growingDegreeDays: 185,
    frostRisk: false,
    irrigationRecommendation: 'Irrigation recommandée mercredi (précipitations attendues)'
  }
}

const getWeatherIcon = (condition: string, className = 'w-6 h-6') => {
  switch (condition) {
    case 'sunny':
      return <Sun className={`${className} text-yellow-500`} />
    case 'cloudy':
      return <Cloud className={`${className} text-gray-500`} />
    case 'rainy':
      return <CloudRain className={`${className} text-blue-500`} />
    default:
      return <Sun className={`${className} text-yellow-500`} />
  }
}

export default function MeteoWidget() {
  const [weather, setWeather] = useState<WeatherData>(mockWeatherData)
  const [loading, setLoading] = useState(false)
  const [location, setLocation] = useState('Ferme de la Vallée, Bordeaux')

  // In production, fetch from weather API
  useEffect(() => {
    // fetchWeatherData()
  }, [])

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="w-5 h-5 text-green-600" />
          <span className="text-gray-500">{location}</span>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Météo Agricole</h1>
        <p className="text-gray-500 mt-1">Prévisions et recommandations pour vos cultures.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Current Weather */}
        <div className="lg:col-span-2 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-8 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 mb-1">Aujourd'hui</p>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold">{weather.current.temp}°</span>
                <span className="text-2xl text-blue-100">C</span>
              </div>
              <p className="text-xl mt-2">{weather.current.description}</p>
            </div>
            <div className="text-right">
              {getWeatherIcon(weather.current.condition, 'w-24 h-24')}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 mt-8 pt-8 border-t border-blue-400">
            <div className="flex items-center gap-3">
              <Droplets className="w-6 h-6 text-blue-200" />
              <div>
                <p className="text-blue-100 text-sm">Humidité</p>
                <p className="text-xl font-semibold">{weather.current.humidity}%</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Wind className="w-6 h-6 text-blue-200" />
              <div>
                <p className="text-blue-100 text-sm">Vent</p>
                <p className="text-xl font-semibold">{weather.current.windSpeed} km/h</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Thermometer className="w-6 h-6 text-blue-200" />
              <div>
                <p className="text-blue-100 text-sm">Ressenti</p>
                <p className="text-xl font-semibold">{weather.current.temp + 2}°C</p>
              </div>
            </div>
          </div>
        </div>

        {/* Agricultural Insights */}
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            Indices Agricoles
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-green-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Évapotranspiration</span>
                <span className="text-lg font-bold text-green-700">{weather.agricultural.evapotranspiration} mm</span>
              </div>
              <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: '65%' }} />
              </div>
            </div>

            <div className="p-4 bg-blue-50 rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Humidité du sol</span>
                <span className="text-lg font-bold text-blue-700">{weather.agricultural.soilMoisture}%</span>
              </div>
              <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: `${weather.agricultural.soilMoisture}%` }} />
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Degrés-jours</span>
                <span className="text-lg font-bold text-yellow-700">{weather.agricultural.growingDegreeDays}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Cumul depuis semis</p>
            </div>

            {weather.agricultural.frostRisk && (
              <div className="p-4 bg-red-50 rounded-xl flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="font-medium text-red-700">Risque de gel</p>
                  <p className="text-sm text-red-600">Protection recommandée</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 7-Day Forecast */}
      <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-gray-600" />
          Prévisions 7 jours
        </h3>
        
        <div className="grid grid-cols-7 gap-4">
          {weather.forecast.map((day, index) => (
            <div 
              key={index} 
              className={`p-4 rounded-xl text-center transition-colors ${
                index === 0 ? 'bg-blue-50 border-2 border-blue-200' : 'bg-gray-50 hover:bg-gray-100'
              }`}
            >
              <p className="text-sm font-medium text-gray-600 mb-2">{day.day}</p>
              <div className="flex justify-center mb-2">
                {getWeatherIcon(day.condition, 'w-8 h-8')}
              </div>
              <p className="text-xl font-bold text-gray-900">{day.temp}°</p>
              <div className="mt-2 pt-2 border-t border-gray-200">
                <div className="flex items-center justify-center gap-1 text-sm text-blue-600">
                  <Droplets className="w-3 h-3" />
                  {day.precipitation}mm
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Irrigation Recommendation */}
      <div className="mt-6 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-6 text-white">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center flex-shrink-0">
            <Droplets className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-1">Recommandation Irrigation</h3>
            <p className="text-green-100">{weather.agricultural.irrigationRecommendation}</p>
            <div className="flex items-center gap-4 mt-4">
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                Économie potentielle: 25%
              </span>
              <span className="px-3 py-1 bg-white/20 rounded-full text-sm">
                Prochain arrosage: Jeudi
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
