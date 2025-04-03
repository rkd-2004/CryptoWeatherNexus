import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface WeatherData {
  temperature: number
  feelsLike: number
  humidity: number
  conditions: string
  windSpeed: number
  tempMin: number
  tempMax: number
}

interface WeatherHistoryItem {
  date: string
  temperature: number
  feelsLike: number
  humidity: number
  conditions: string
}

interface WeatherState {
  data: {
    [city: string]: WeatherData
  }
  history: {
    [city: string]: WeatherHistoryItem[]
  }
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: WeatherState = {
  data: {},
  history: {},
  status: "idle",
  error: null,
}

// Simulated API call - in a real app, replace with actual OpenWeatherMap API call
export const fetchWeatherData = createAsyncThunk("weather/fetchWeatherData", async (city: string) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Convert city to lowercase and replace spaces with dashes for storage
    const cityKey = city.toLowerCase().replace(/\s+/g, "-")

    // Simulate weather data
    const tempBase =
      {
        "new-york": 20,
        london: 15,
        tokyo: 25,
      }[cityKey] || 18

    const temp = tempBase + (Math.random() * 10 - 5)
    const feels = temp - Math.random() * 3

    const conditions = ["Sunny", "Cloudy", "Partly Cloudy", "Rainy", "Stormy"]
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)]

    return {
      city: cityKey,
      data: {
        temperature: Number.parseFloat(temp.toFixed(1)),
        feelsLike: Number.parseFloat(feels.toFixed(1)),
        humidity: Math.floor(Math.random() * 50 + 30),
        conditions: randomCondition,
        windSpeed: Number.parseFloat((Math.random() * 8 + 2).toFixed(1)),
        tempMin: Number.parseFloat((temp - Math.random() * 5).toFixed(1)),
        tempMax: Number.parseFloat((temp + Math.random() * 5).toFixed(1)),
      },
    }
  } catch (error) {
    throw new Error("Failed to fetch weather data")
  }
})

// Simulated history data
export const fetchWeatherHistory = createAsyncThunk("weather/fetchWeatherHistory", async (city: string) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const cityKey = city.toLowerCase()

    // Base temperature for this city
    const tempBase =
      {
        "new-york": 20,
        london: 15,
        tokyo: 25,
      }[cityKey] || 18

    // Generate 5 days of history data
    const historyData: WeatherHistoryItem[] = []
    const conditions = ["Sunny", "Cloudy", "Partly Cloudy", "Rainy", "Stormy"]

    const today = new Date()

    for (let i = 0; i < 5; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      const temp = tempBase + (Math.random() * 6 - 3)
      const feels = temp - Math.random() * 2

      historyData.push({
        date: date.toISOString(),
        temperature: Number.parseFloat(temp.toFixed(1)),
        feelsLike: Number.parseFloat(feels.toFixed(1)),
        humidity: Math.floor(Math.random() * 50 + 30),
        conditions: conditions[Math.floor(Math.random() * conditions.length)],
      })
    }

    return {
      city: cityKey,
      history: historyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    }
  } catch (error) {
    throw new Error("Failed to fetch weather history")
  }
})

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWeatherData.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchWeatherData.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data[action.payload.city] = action.payload.data
      })
      .addCase(fetchWeatherData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch weather data"
      })
      .addCase(fetchWeatherHistory.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchWeatherHistory.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.history[action.payload.city] = action.payload.history
      })
      .addCase(fetchWeatherHistory.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch weather history"
      })
  },
})

export default weatherSlice.reducer

