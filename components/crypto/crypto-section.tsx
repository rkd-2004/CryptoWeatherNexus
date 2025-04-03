"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useDispatch, useSelector } from "react-redux"
import { fetchCryptoData } from "@/redux/features/cryptoSlice"
import type { AppDispatch, RootState } from "@/redux/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { ArrowDown, ArrowUp, CreditCard, DollarSign, Star } from "lucide-react"
import { toggleFavorite } from "@/redux/features/preferencesSlice"

export default function CryptoSection() {
  const dispatch = useDispatch<AppDispatch>()
  const { data, status, error } = useSelector((state: RootState) => state.crypto)
  const favorites = useSelector((state: RootState) => state.preferences.favorites)

  // Cryptocurrencies to display
  const cryptos = ["bitcoin", "ethereum", "cardano"]

  useEffect(() => {
    // Fetch crypto data
    if (status === "idle") {
      dispatch(fetchCryptoData())
    }

    // Refresh data every 60 seconds (in addition to WebSocket updates)
    const interval = setInterval(() => {
      dispatch(fetchCryptoData())
    }, 60000)

    return () => clearInterval(interval)
  }, [dispatch, status])

  const handleToggleFavorite = (crypto: string) => {
    const cryptoName = data[crypto]?.name || crypto.charAt(0).toUpperCase() + crypto.slice(1)
    dispatch(
      toggleFavorite({
        id: crypto,
        name: cryptoName,
        type: "crypto",
      }),
    )
  }

  const isFavorite = (crypto: string) => {
    return favorites.some((f) => f.id === crypto && f.type === "crypto")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(price)
  }

  const formatMarketCap = (marketCap: number) => {
    if (marketCap >= 1e12) return `$${(marketCap / 1e12).toFixed(2)}T`
    if (marketCap >= 1e9) return `$${(marketCap / 1e9).toFixed(2)}B`
    if (marketCap >= 1e6) return `$${(marketCap / 1e6).toFixed(2)}M`
    return `$${marketCap.toFixed(2)}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cryptocurrency</CardTitle>
        <CardDescription>Live prices of major cryptocurrencies</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {cryptos.map((crypto) => {
            const cryptoData = data[crypto]
            const loading = status === "loading" && !cryptoData
            const failed = status === "failed" && !cryptoData

            return (
              <div key={crypto} className="flex items-center justify-between rounded-lg border p-3">
                <div className="space-y-1">
                  <h3 className="font-medium">
                    {cryptoData?.name || crypto.charAt(0).toUpperCase() + crypto.slice(1)}
                  </h3>
                  {loading && <Skeleton className="h-4 w-24" />}
                  {failed && <p className="text-sm text-destructive">Failed to load data</p>}
                  {cryptoData && (
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <DollarSign className="mr-1 h-3 w-3" />
                        {formatPrice(cryptoData.price)}
                      </div>
                      <div className="flex items-center">
                        <span
                          className={`mr-1 flex items-center ${
                            cryptoData.priceChange24h >= 0 ? "text-green-500" : "text-red-500"
                          }`}
                        >
                          {cryptoData.priceChange24h >= 0 ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : (
                            <ArrowDown className="h-3 w-3" />
                          )}
                          {Math.abs(cryptoData.priceChange24h).toFixed(2)}%
                        </span>
                      </div>
                      <div className="hidden sm:flex sm:items-center">
                        <CreditCard className="mr-1 h-3 w-3" />
                        {formatMarketCap(cryptoData.marketCap)}
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" onClick={() => handleToggleFavorite(crypto)} className="h-8 w-8">
                    <Star
                      className={`h-4 w-4 ${
                        isFavorite(crypto) ? "fill-primary text-primary" : "text-muted-foreground"
                      }`}
                    />
                    <span className="sr-only">{isFavorite(crypto) ? "Remove from favorites" : "Add to favorites"}</span>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="h-8">
                    <Link href={`/crypto/${crypto}`}>Details</Link>
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

