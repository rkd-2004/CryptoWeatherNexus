import { Suspense } from "react"
import WeatherSection from "@/components/weather/weather-section"
import CryptoSection from "@/components/crypto/crypto-section"
import NewsSection from "@/components/news/news-section"
import { Skeleton } from "@/components/ui/skeleton"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Dashboard</h1>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
          <WeatherSection />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
          <CryptoSection />
        </Suspense>

        <div className="md:col-span-2 lg:col-span-1">
          <Suspense fallback={<Skeleton className="h-[300px] w-full rounded-lg" />}>
            <NewsSection />
          </Suspense>
        </div>
      </div>
    </div>
  )
}

