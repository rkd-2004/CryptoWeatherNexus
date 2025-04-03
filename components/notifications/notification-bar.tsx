"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Bell, Check, CheckCheck, Trash2, X, AlertTriangle, DollarSign, Cloud, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { RootState } from "@/redux/store"
import {
  markAllNotificationsAsRead,
  markNotificationAsRead,
  dismissNotification,
  clearNotifications,
  type NotificationType,
} from "@/redux/features/notificationsSlice"

export default function NotificationBar() {
  const dispatch = useDispatch()
  const notifications = useSelector((state: RootState) => state.notifications.items)
  const unreadCount = notifications.filter((n) => !n.read).length
  const [isOpen, setIsOpen] = useState(false)
  const [hasNewNotifications, setHasNewNotifications] = useState(false)
  const prevUnreadCountRef = useRef(unreadCount)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Animation effect when new notifications arrive
  useEffect(() => {
    if (unreadCount > prevUnreadCountRef.current) {
      setHasNewNotifications(true)
      const timer = setTimeout(() => {
        setHasNewNotifications(false)
      }, 2000)

      return () => clearTimeout(timer)
    }

    prevUnreadCountRef.current = unreadCount
  }, [unreadCount])

  // Handle clicks outside to close dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    const newIsOpen = !isOpen
    setIsOpen(newIsOpen)

    if (newIsOpen && unreadCount > 0) {
      // Mark all as read when opening the dropdown
      dispatch(markAllNotificationsAsRead())
    }
  }

  const handleClearNotifications = (e: React.MouseEvent) => {
    e.stopPropagation()
    dispatch(clearNotifications())
  }

  const handleMarkAsRead = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    dispatch(markNotificationAsRead(id))
  }

  const handleDismiss = (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    dispatch(dismissNotification(id))
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "price_alert":
        return <DollarSign className="h-4 w-4 text-green-500" />
      case "weather_alert":
        return <Cloud className="h-4 w-4 text-blue-500" />
      case "system":
        return <Info className="h-4 w-4 text-primary" />
      default:
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()

    // If today, show time only
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }

    // If this year, show month and day
    if (date.getFullYear() === now.getFullYear()) {
      return date.toLocaleDateString([], { month: "short", day: "numeric" })
    }

    // Otherwise show full date
    return date.toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        size="icon"
        className={cn("relative transition-all", hasNewNotifications && "animate-pulse")}
        onClick={toggleDropdown}
      >
        <Bell className="h-5 w-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
        <span className="sr-only">Notifications</span>
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-[350px] rounded-md border bg-popover shadow-lg z-50 animate-in fade-in-0 zoom-in-95 slide-in-from-top-2">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <h3 className="font-medium">Notifications</h3>
            <div className="flex items-center gap-1">
              {unreadCount === 0 && notifications.length > 0 && (
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClearNotifications}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Clear all notifications</span>
                </Button>
              )}

              {unreadCount > 0 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => dispatch(markAllNotificationsAsRead())}
                >
                  <CheckCheck className="h-4 w-4" />
                  <span className="sr-only">Mark all as read</span>
                </Button>
              )}
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
              <Bell className="mb-2 h-10 w-10 text-muted-foreground/50" />
              <p className="text-sm font-medium">No notifications</p>
              <p className="text-xs text-muted-foreground">
                You'll see notifications for price alerts, weather updates, and system messages here.
              </p>
            </div>
          ) : (
            <div className="max-h-[400px] overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "group relative border-b last:border-0 px-4 py-3 hover:bg-muted/50 transition-colors",
                    !notification.read && "bg-muted/30",
                  )}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 space-y-1">
                      <div className="flex items-start justify-between">
                        <span className={cn("font-medium text-sm", !notification.read && "font-semibold")}>
                          {notification.title}
                        </span>
                        <span className="text-[10px] text-muted-foreground ml-2 mt-1">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">{notification.message}</p>
                      {notification.actionUrl && (
                        <a
                          href={notification.actionUrl}
                          className="text-xs text-primary hover:underline inline-block mt-1"
                        >
                          {notification.actionLabel || "View details"}
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Action buttons that appear on hover */}
                  <div className="absolute right-2 top-2 hidden group-hover:flex items-center gap-1">
                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => handleMarkAsRead(e, notification.id)}
                      >
                        <Check className="h-3 w-3" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={(e) => handleDismiss(e, notification.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {notifications.length > 0 && (
            <div className="py-2 px-4 text-center text-xs text-muted-foreground border-t">
              {unreadCount === 0
                ? "All notifications have been read"
                : `You have ${unreadCount} unread notification${unreadCount !== 1 ? "s" : ""}`}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

