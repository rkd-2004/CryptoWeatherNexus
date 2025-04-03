"use client"

import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchCryptoData, fetchCryptoHistory } from "@/redux/features/cryptoSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { LineChart, ChartContainer } from "@/components/ui/chart"
import { CartesianGrid, Tooltip, XAxis, YAxis, Line } from "recharts"
import { ArrowDown, ArrowUp, CreditCard, DollarSign, Star, TrendingUp, Volume2 } from "lucide-react"
import { toggleFavorite } from "@/redux/features/preferencesSlice"

export function CryptoDetail({ id }: { id: string }) {
  const dispatch = useDispatch<AppDispatch>()
  const { data, history, status, error } = useSelector((state: RootState) => state.crypto)
  const favorites = useSelector((state: RootState) => state.preferences.favorites)

  useEffect(() => {
    // Fetch current crypto data if not already loaded
    if (!data[id] || status === "idle") {
      dispatch(fetchCryptoData())
    }

    // Fetch crypto history
    dispatch(fetchCryptoHistory(id))

    // Refresh data every 60 seconds (in addition to WebSocket updates)
    const interval = setInterval(() => {
      dispatch(fetchCryptoData())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch, id, data, status])

  const cryptoData = data[id]
  const cryptoHistory = history[id] || []
  const loading = status === "loading" && !cryptoData
  const historyLoading = status === "loading" && cryptoHistory.length === 0

  const handleToggleFavorite = () => {
    const cryptoName = cryptoData?.name || id.charAt(0).toUpperCase() + id.slice(1)
    dispatch(
      toggleFavorite({
        id,
        name: cryptoName,
        type: "crypto",
      }),
    )
  }

  const isFavorite = favorites.some((f) => f.id === id && f.type === "crypto")

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatLargeNumber = (num: number) => {
    if (num >= 1e12) return `${(num / 1e12).toFixed(2)}T`
    if (num >= 1e9) return `${(num / 1e9).toFixed(2)}B`
    if (num >= 1e6) return `${(num / 1e6).toFixed(2)}M`
    return num.toFixed(2)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{cryptoData?.name || id.charAt(0).toUpperCase() + id.slice(1)}</CardTitle>
              <CardDescription>Current market data</CardDescription>
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
          ) : cryptoData ? (
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center sm:flex-row sm:gap-8">
                <div className="flex items-center justify-center gap-2 text-5xl font-bold">
                  {formatPrice(cryptoData.price)}
                </div>
                <div className="flex items-center text-2xl font-medium">
                  <span className={cryptoData.priceChange24h >= 0 ? "text-green-500" : "text-red-500"}>
                    {cryptoData.priceChange24h >= 0 ? (
                      <ArrowUp className="mr-1 h-5 w-5 inline" />
                    ) : (
                      <ArrowDown className="mr-1 h-5 w-5 inline" />
                    )}
                    {Math.abs(cryptoData.priceChange24h).toFixed(2)}%
                  </span>
                  <span className="text-sm ml-1 text-muted-foreground">(24h)</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <CreditCard className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">Market Cap</div>
                  <div className="text-lg font-semibold">${formatLargeNumber(cryptoData.marketCap)}</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <Volume2 className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">Volume (24h)</div>
                  <div className="text-lg font-semibold">${formatLargeNumber(cryptoData.volume24h)}</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <TrendingUp className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">All Time High</div>
                  <div className="text-lg font-semibold">{formatPrice(cryptoData.allTimeHigh || 0)}</div>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg border p-4">
                  <DollarSign className="mb-2 h-6 w-6" />
                  <div className="text-xs text-muted-foreground">Circulating Supply</div>
                  <div className="text-lg font-semibold">{formatLargeNumber(cryptoData.circulatingSupply || 0)}</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex h-24 items-center justify-center">
              <p className="text-destructive">Failed to load cryptocurrency data</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Price History</CardTitle>
          <CardDescription>Last 7 days price data</CardDescription>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <Skeleton className="h-80 w-full" />
          ) : cryptoHistory.length > 0 ? (
            <div className="h-80">
              <ChartContainer
                config={{
                  price: {
                    label: "Price (USD)",
                    color: "hsl(var(--chart-1))",
                  },
                }}
              >
                <LineChart data={cryptoHistory} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="date"
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => new Date(value).toLocaleDateString(undefined, { weekday: "short" })}
                  />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `$${value.toFixed(2)}`} />
                  <Tooltip formatter={(value) => [`$${Number(value).toFixed(2)}`, "Price"]} />
                  <Line type="monotone" dataKey="price" stroke="var(--color-price)" dot={false} />
                </LineChart>
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

