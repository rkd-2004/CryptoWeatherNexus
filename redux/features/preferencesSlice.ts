import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

interface FavoriteItem {
  id: string
  name: string
  type: "city" | "crypto"
}

interface PreferencesState {
  favorites: FavoriteItem[]
}

// Load initial state from localStorage if available
const loadInitialState = (): PreferencesState => {
  if (typeof window === "undefined") {
    return { favorites: [] }
  }

  try {
    const savedFavorites = localStorage.getItem("crypto-weather-favorites")
    if (savedFavorites) {
      return { favorites: JSON.parse(savedFavorites) }
    }
  } catch (e) {
    console.error("Failed to load favorites from localStorage", e)
  }

  return { favorites: [] }
}

const preferencesSlice = createSlice({
  name: "preferences",
  initialState: loadInitialState(),
  reducers: {
    toggleFavorite: (state, action: PayloadAction<FavoriteItem>) => {
      const { id, type } = action.payload
      const existingIndex = state.favorites.findIndex((f) => f.id === id && f.type === type)

      if (existingIndex >= 0) {
        // Remove from favorites
        state.favorites.splice(existingIndex, 1)
      } else {
        // Add to favorites
        state.favorites.push(action.payload)
      }

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("crypto-weather-favorites", JSON.stringify(state.favorites))
      }
    },
    clearFavorites: (state) => {
      state.favorites = []

      // Clear from localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("crypto-weather-favorites")
      }
    },
  },
})

export const { toggleFavorite, clearFavorites } = preferencesSlice.actions
export default preferencesSlice.reducer

