import { createSlice, type PayloadAction } from "@reduxjs/toolkit"

export type NotificationType = "price_alert" | "weather_alert" | "system"

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  timestamp: string
  read: boolean
  actionUrl?: string
  actionLabel?: string
}

interface NotificationsState {
  items: Notification[]
  preferences: {
    soundEnabled: boolean
    desktopNotificationsEnabled: boolean
  }
}

// Load notifications from localStorage if available
const loadNotificationsFromStorage = (): Notification[] => {
  if (typeof window === "undefined") return []

  try {
    const storedNotifications = localStorage.getItem("cryptoweather-notifications")
    if (storedNotifications) {
      return JSON.parse(storedNotifications)
    }
  } catch (error) {
    console.error("Failed to load notifications from localStorage:", error)
  }

  return []
}

// Save notifications to localStorage
const saveNotificationsToStorage = (notifications: Notification[]) => {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem("cryptoweather-notifications", JSON.stringify(notifications))
  } catch (error) {
    console.error("Failed to save notifications to localStorage:", error)
  }
}

const initialState: NotificationsState = {
  items: loadNotificationsFromStorage(),
  preferences: {
    soundEnabled: false,
    desktopNotificationsEnabled: false,
  },
}

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: (state, action: PayloadAction<Omit<Notification, "id" | "read">>) => {
      // Add new notification to the beginning of the array with a unique ID and read status
      const newNotification = {
        ...action.payload,
        id: Date.now().toString(),
        read: false,
      }

      state.items.unshift(newNotification)

      // Limit to 20 notifications
      if (state.items.length > 20) {
        state.items = state.items.slice(0, 20)
      }

      // Save to localStorage
      saveNotificationsToStorage(state.items)
    },
    markAllNotificationsAsRead: (state) => {
      state.items = state.items.map((notification) => ({
        ...notification,
        read: true,
      }))

      // Save to localStorage
      saveNotificationsToStorage(state.items)
    },
    markNotificationAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.items.find((item) => item.id === action.payload)
      if (notification) {
        notification.read = true

        // Save to localStorage
        saveNotificationsToStorage(state.items)
      }
    },
    dismissNotification: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload)

      // Save to localStorage
      saveNotificationsToStorage(state.items)
    },
    clearNotifications: (state) => {
      state.items = []

      // Save to localStorage
      saveNotificationsToStorage(state.items)
    },
    updateNotificationPreferences: (state, action: PayloadAction<Partial<NotificationsState["preferences"]>>) => {
      state.preferences = {
        ...state.preferences,
        ...action.payload,
      }
    },
  },
})

export const {
  addNotification,
  markAllNotificationsAsRead,
  markNotificationAsRead,
  dismissNotification,
  clearNotifications,
  updateNotificationPreferences,
} = notificationsSlice.actions

export default notificationsSlice.reducer

