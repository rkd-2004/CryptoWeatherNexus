import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit"

interface CryptoData {
  id: string
  name: string
  symbol: string
  price: number
  priceChange24h: number
  volume24h: number
  marketCap: number
  allTimeHigh?: number
  circulatingSupply?: number
}

interface CryptoHistoryItem {
  date: string
  price: number
}

interface CryptoState {
  data: {
    [id: string]: CryptoData
  }
  history: {
    [id: string]: CryptoHistoryItem[]
  }
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: CryptoState = {
  data: {},
  history: {},
  status: "idle",
  error: null,
}


export const fetchCryptoData = createAsyncThunk("crypto/fetchCryptoData", async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 800))

    // Sample crypto data
    const cryptoData = {
      bitcoin: {
        id: "bitcoin",
        name: "Bitcoin",
        symbol: "BTC",
        price: 45000 + (Math.random() * 5000 - 2500),
        priceChange24h: Number.parseFloat((Math.random() * 10 - 5).toFixed(2)),
        volume24h: 25000000000 + Math.random() * 5000000000,
        marketCap: 850000000000 + Math.random() * 40000000000,
        allTimeHigh: 69000,
        circulatingSupply: 19000000,
      },
      ethereum: {
        id: "ethereum",
        name: "Ethereum",
        symbol: "ETH",
        price: 3000 + (Math.random() * 500 - 250),
        priceChange24h: Number.parseFloat((Math.random() * 12 - 6).toFixed(2)),
        volume24h: 15000000000 + Math.random() * 3000000000,
        marketCap: 360000000000 + Math.random() * 20000000000,
        allTimeHigh: 4800,
        circulatingSupply: 120000000,
      },
      cardano: {
        id: "cardano",
        name: "Cardano",
        symbol: "ADA",
        price: 1.2 + (Math.random() * 0.4 - 0.2),
        priceChange24h: Number.parseFloat((Math.random() * 15 - 7.5).toFixed(2)),
        volume24h: 3000000000 + Math.random() * 1000000000,
        marketCap: 40000000000 + Math.random() * 5000000000,
        allTimeHigh: 3.1,
        circulatingSupply: 33000000000,
      },
    }

    return cryptoData
  } catch (error) {
    throw new Error("Failed to fetch cryptocurrency data")
  }
})

// Simulated history data
export const fetchCryptoHistory = createAsyncThunk("crypto/fetchCryptoHistory", async (id: string) => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Base prices for cryptocurrencies
    const priceBase =
      {
        bitcoin: 45000,
        ethereum: 3000,
        cardano: 1.2,
      }[id] || 100

    // Generate 7 days of price history
    const historyData: CryptoHistoryItem[] = []
    const today = new Date()

    for (let i = 0; i < 7; i++) {
      const date = new Date()
      date.setDate(today.getDate() - i)

      // Create a realistic price trend
      const dayFactor = (7 - i) / 7 // Newer days have higher factor
      const randomChange = (Math.random() * 0.1 - 0.05) * priceBase // -5% to +5%
      const trendFactor = Math.sin(i) * priceBase * 0.03 // Creates a sine wave pattern

      const price = priceBase + randomChange * dayFactor + trendFactor

      historyData.push({
        date: date.toISOString(),
        price: Number.parseFloat(price.toFixed(2)),
      })
    }

    return {
      id,
      history: historyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    }
  } catch (error) {
    throw new Error("Failed to fetch cryptocurrency history")
  }
})

const cryptoSlice = createSlice({
  name: "crypto",
  initialState,
  reducers: {
    updateCryptoPrice: (state, action: PayloadAction<{ id: string; price: number }>) => {
      const { id, price } = action.payload

      if (state.data[id]) {
        // Calculate price change based on previous price
        const previousPrice = state.data[id].price
        const priceChangePercent = ((price - previousPrice) / previousPrice) * 100

        // Update the price and 24h change
        state.data[id].price = price
        // Adjust the 24h change - in a real app, this would be calculated differently
        state.data[id].priceChange24h += Number.parseFloat(priceChangePercent.toFixed(2)) / 10
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCryptoData.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCryptoData.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.data = action.payload
      })
      .addCase(fetchCryptoData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch cryptocurrency data"
      })
      .addCase(fetchCryptoHistory.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchCryptoHistory.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.history[action.payload.id] = action.payload.history
      })
      .addCase(fetchCryptoHistory.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch cryptocurrency history"
      })
  },
})

export const { updateCryptoPrice } = cryptoSlice.actions
export default cryptoSlice.reducer

