import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"

interface NewsArticle {
  title: string
  description: string
  url: string
  publishedAt: string
  source: string
}

interface NewsState {
  articles: NewsArticle[]
  status: "idle" | "loading" | "succeeded" | "failed"
  error: string | null
}

const initialState: NewsState = {
  articles: [],
  status: "idle",
  error: null,
}

// Simulated API call - in a real app, replace with actual News API
export const fetchNewsData = createAsyncThunk("news/fetchNewsData", async () => {
  try {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Sample news data
    const newsArticles: NewsArticle[] = [
      {
        title: "Bitcoin Reaches New Monthly High as Market Sentiment Turns Bullish",
        description:
          "Bitcoin has surged to a new monthly high, breaking through the $50,000 resistance level as market sentiment turns increasingly bullish following positive regulatory developments.",
        url: "https://example.com/bitcoin-new-high",
        publishedAt: new Date(Date.now() - 4 * 3600000).toISOString(), // 4 hours ago
        source: "CryptoNews",
      },
      {
        title: "Ethereum Gas Fees Drop to Lowest Level in Months After Network Upgrade",
        description:
          "Ethereum's gas fees have dropped to their lowest levels in months following the latest network upgrade, making transactions more affordable for users and developers.",
        url: "https://example.com/ethereum-gas-fees",
        publishedAt: new Date(Date.now() - 8 * 3600000).toISOString(), // 8 hours ago
        source: "BlockchainInsider",
      },
      {
        title: "Major Bank Announces Crypto Custody Service for Institutional Clients",
        description:
          "One of the world's largest banks has announced a new cryptocurrency custody service aimed at institutional clients, signaling growing mainstream acceptance of digital assets.",
        url: "https://example.com/bank-crypto-custody",
        publishedAt: new Date(Date.now() - 14 * 3600000).toISOString(), // 14 hours ago
        source: "FinanceDaily",
      },
      {
        title: "Cardano Foundation Announces Major Partnership for Smart Contract Deployment",
        description:
          "The Cardano Foundation has announced a strategic partnership with a leading technology firm to accelerate smart contract deployment and adoption on the Cardano blockchain.",
        url: "https://example.com/cardano-partnership",
        publishedAt: new Date(Date.now() - 28 * 3600000).toISOString(), // 28 hours ago
        source: "CryptoInsider",
      },
      {
        title: "Regulators Propose New Framework for Cryptocurrency Exchanges",
        description:
          "Global financial regulators have proposed a new comprehensive framework for cryptocurrency exchanges, aiming to enhance consumer protection while fostering innovation in the sector.",
        url: "https://example.com/crypto-regulation",
        publishedAt: new Date(Date.now() - 36 * 3600000).toISOString(), // 36 hours ago
        source: "RegulationToday",
      },
    ]

    return newsArticles
  } catch (error) {
    throw new Error("Failed to fetch news data")
  }
})

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNewsData.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchNewsData.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.articles = action.payload
      })
      .addCase(fetchNewsData.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message || "Failed to fetch news data"
      })
  },
})

export default newsSlice.reducer

