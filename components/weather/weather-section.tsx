"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { fetchWeatherData } from "@/redux/features/weatherSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Cloud, Droplets, Star, Thermometer } from "lucide-react"
import { toggleFavorite } from "@/redux/features/preferencesSlice"

export default function WeatherSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, status, error } = useSelector((state: RootState) => state.weather)
  const favorites = useSelector((state: RootState) => state.preferences.favorites)

  // Cities to display
  const cities = ["New York", "London", "Tokyo"]

  useEffect(() => {
    // Fetch weather data for each city
    cities.forEach((city) => {
      if (!data[city.toLowerCase().replace(" ", "-")] || status === "idle") {
        dispatch(fetchWeatherData(city))
      }
    })

    // Refresh data every 60 seconds
    const interval = setInterval(() => {
      cities.forEach((city) => {
        dispatch(fetchWeatherData(city))
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch, data, status])

  const handleToggleFavorite = (city: string) => {
    const cityId = city.toLowerCase().replace(" ", "-")
    dispatch(
      toggleFavorite({
        id: cityId,
        name: city,
        type: "city",
      }),
    )
  }

  const isFavorite = (city: string) => {
    const cityId = city.toLowerCase().replace(" ", "-")
    return favorites.some((f) => f.id === cityId && f.type === "city")
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weather</CardTitle>
        <CardDescription>Current weather conditions in major cities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cities.map((city) => {
            const cityId = city.toLowerCase().replace(" ", "-")
            const cityData = data[cityId]
            const loading = status === "loading" && !cityData
            const failed = status === "failed" && !cityData

            return (
              <div key={city} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <h3 className="font-medium">{city}</h3>
                  {loading && <Skeleton className="h-4 w-24" />}
                  {failed && <p className="text-sm text-destructive">Failed to load data</p>}
                  {cityData && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Thermometer className="mr-1 h-3 w-3" />
                        {cityData.temperature}°C
                      </div>
                      <div className="flex items-center">
                        <Droplets className="mr-1 h-3 w-3" />
                        {cityData.humidity}%
                      </div>
                      <div className="flex items-center">
                        <Cloud className="mr-1 h-3 w-3" />
                        {cityData.conditions}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(city)} className="h-8 w-8">
                    <Star
                      className={`h-4 w-4 ${isFavorite(city) ? "fill-primary text-primary" : "text-muted-foreground"}`}
                    />
                    <span className="sr-only">{isFavorite(city) ? "Remove from favorites" : "Add to favorites"}</span>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link href={`/weather/${cityId}`}>Details</Link>
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

