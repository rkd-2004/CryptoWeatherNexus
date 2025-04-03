import { Suspense } from "react"
import { WeatherDetail } from "@/components/weather/weather-detail"
import { Skeleton } from "@/components/ui/skeleton"
import { notFound } from "next/navigation"

export async function generateStaticParams() {
  // Pre-generate pages for common cities
  return [{ city: "new-york" }, { city: "london" }, { city: "tokyo" }]
}

export default function CityPage({ params }: { params: { city: string } }) {
  const city = params.city

  // Validate city param
  if (!city || typeof city !== "string") {
    return notFound()
  }

  // Format city name for display
  const formattedCity = city
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ")

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{formattedCity} Weather</h1>

      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-lg" />}>
        <WeatherDetail city={city} />
      </Suspense>
    </div>
  )
}

