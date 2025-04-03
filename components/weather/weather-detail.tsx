"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchWeatherData, fetchWeatherHistory } from "@/redux/features/weatherSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { AreaChart, ChartContainer } from "@/components/ui/chart"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { CartesianGrid, Tooltip, XAxis, YAxis, Area } from "recharts"
import { Droplets, Star, Thermometer, Wind } from "lucide-react"
import { toggleFavorite } from "@/redux/features/preferencesSlice"

export function WeatherDetail({ city }: { city: string }) {
  const dispatch = useDispatch<AppDispatch>()
  const { data, history, status, error } = useSelector((state: RootState) => state.weather)
  const favorites = useSelector((state: RootState) => state.preferences.favorites)

  const formattedCity = city
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  useEffect(() => {
    // Fetch current weather data
    dispatch(fetchWeatherData(formattedCity))

    // Fetch weather history
    dispatch(fetchWeatherHistory(city))

    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      dispatch(fetchWeatherData(formattedCity))
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch, city, formattedCity])

  const weatherData = data[city]
  const weatherHistory = history[city] || []
  const loading = status === "loading" && !weatherData
  const historyLoading = status === "loading" && weatherHistory.length === 0

  const handleToggleFavorite = () => {
    dispatch(
      toggleFavorite({
        id: city,
        name: formattedCity,
        type: "city",
      }),
    )
  }

  const isFavorite = favorites.some((f) => f.id === city && f.type === "city")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Current Weather</CardTitle>
              <CardDescription>Real-time conditions for {formattedCity}</CardDescription>
            </div>
            <Button variant="outline" size="icon" onClick={handleToggleFavorite}>
              <Star className={`h-4 w-4 ${isFavorite ? "fill-primary text-primary" : ""}`} />
              <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-24 w-full" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            </div>
          ) : weatherData ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-8">
                <div className="flex items-center justify-center gap-2 text-5xl font-bold">
                  {weatherData.temperature}°C
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-xl font-medium">{weatherData.conditions}</div>
                  <div className="text-sm text-muted-foreground">Feels like {weatherData.feelsLike}°C</div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Droplets className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">Humidity</div>
                  <div className="text-lg font-semibold">{weatherData.humidity}%</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Wind className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">Wind</div>
                  <div className="text-lg font-semibold">{weatherData.windSpeed} m/s</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Thermometer className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">Min Temp</div>
                  <div className="text-lg font-semibold">{weatherData.tempMin}°C</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Thermometer className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">Max Temp</div>
                  <div className="text-lg font-semibold">{weatherData.tempMax}°C</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center">
              <p className="text-destructive">Failed to load weather data</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Temperature History</CardTitle>
          <CardDescription>Last 5 days temperature data</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : weatherHistory.length > 0 ? (
            <div className="h-80">
              <ChartContainer
                config={{
                  temperature: {
                    label: "Temperature (°C)",
                    color: "hsl(var(--chart-1))",
                  },
                  feelsLike: {
                    label: "Feels Like (°C)",
                    color: "hsl(var(--chart-2))",
                  },
                }}
              >
                <AreaChart data={weatherHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: "short" })}
                  />
                  <YAxis tickLine={false} axisLine={false} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="temperature"
                    fill="var(--color-temperature)"
                    stroke="var(--color-temperature)"
                  />
                  <Area
                    type="monotone"
                    dataKey="feelsLike"
                    fill="var(--color-feelsLike)"
                    stroke="var(--color-feelsLike)"
                  />
                </AreaChart>
              </ChartContainer>
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center">
              <p className="text-destructive">No history data available</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

