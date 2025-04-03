"use client"

import { type ReactNode, useEffect } from "react"
import { useDispatch } from "react-redux"
import { updateCryptoPrice } from "@/redux/features/cryptoSlice"
import { addNotification } from "@/redux/features/notificationsSlice"
import { useToast } from "@/hooks/use-toast"

export default function WebSocketProvider({ children }: { children: ReactNode }) {
  const dispatch = useDispatch()
  const { toast } = useToast()

  // Simulated real-time updates instead of actual WebSocket
  useEffect(() => {
    console.log("Setting up simulated real-time updates")

    // Add a system notification on startup
    setTimeout(() => {
      dispatch(
        addNotification({
          type: "system",
          title: "Welcome to CryptoWeather Nexus",
          message: "Stay updated with real-time crypto prices and weather alerts.",
          timestamp: new Date().toISOString(),
        }),
      )
    }, 2000)

    // Simulate crypto price updates
    const cryptoUpdateInterval = setInterval(() => {
      const cryptos = ["bitcoin", "ethereum", "cardano"]
      const randomCrypto = cryptos[Math.floor(Math.random() * cryptos.length)]

      // Generate a random price change (small fluctuation)
      const basePrice =
        {
          bitcoin: 45000,
          ethereum: 3000,
          cardano: 1.2,
        }[randomCrypto] || 100

      const priceChange = (Math.random() * 0.02 - 0.01) * basePrice // -1% to +1%
      const newPrice = basePrice + priceChange

      // Update the price in Redux
      dispatch(
        updateCryptoPrice({
          id: randomCrypto,
          price: newPrice,
        }),
      )

      // Occasionally add a notification for significant price changes
      if (Math.random() < 0.05) {
        // 5% chance to trigger notification
        const priceChangeDirection = priceChange > 0 ? "increased" : "decreased"
        const percentChange = ((Math.abs(priceChange) / basePrice) * 100).toFixed(2)

        const cryptoName = randomCrypto.charAt(0).toUpperCase() + randomCrypto.slice(1)

        dispatch(
          addNotification({
            type: "price_alert",
            title: `${cryptoName} Alert`,
            message: `Price has ${priceChangeDirection} by ${percentChange}% in the last hour`,
            timestamp: new Date().toISOString(),
            actionUrl: `/crypto/${randomCrypto}`,
            actionLabel: `View ${cryptoName} details`,
          }),
        )

        toast({
          title: `${cryptoName} Alert`,
          description: `Price has ${priceChangeDirection} by ${percentChange}% in the last hour`,
        })
      }
    }, 10000) // Update every 10 seconds

    // Set up simulated weather alerts
    const weatherAlertInterval = setInterval(() => {
      // Random chance to dispatch weather alert
      if (Math.random() < 0.1) {
        // 10% chance every interval
        const cities = ["New York", "London", "Tokyo"]
        const weatherEvents = ["Heavy Rain", "Thunderstorm", "Heat Wave", "Snowfall", "High Winds"]

        const city = cities[Math.floor(Math.random() * cities.length)]
        const cityId = city.toLowerCase().replace(" ", "-")
        const event = weatherEvents[Math.floor(Math.random() * weatherEvents.length)]

        dispatch(
          addNotification({
            type: "weather_alert",
            title: `Weather Alert: ${city}`,
            message: `${event} expected in the next 24 hours`,
            timestamp: new Date().toISOString(),
            actionUrl: `/weather/${cityId}`,
            actionLabel: `View ${city} weather`,
          }),
        )

        toast({
          title: `Weather Alert: ${city}`,
          description: `${event} expected in the next 24 hours`,
        })
      }
    }, 30000) // Check every 30 seconds

    // Cleanup on unmount
    return () => {
      clearInterval(cryptoUpdateInterval)
      clearInterval(weatherAlertInterval)
    }
  }, [dispatch, toast])

  return <>{children}</>
}

