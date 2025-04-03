"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Cloud, CreditCard, Home, Star } from "lucide-react"
import { cn } from "@/lib/utils"
import { useSelector } from "react-redux"
import type { RootState } from "@/redux/store"

export default function SideNav() {
  const pathname = usePathname()
  const favorites = useSelector((state: RootState) => state.preferences.favorites)

  const routes = [
    {
      href: "/",
      label: "Dashboard",
      icon: Home,
    },
    {
      href: "/weather/new-york",
      label: "Weather",
      icon: Cloud,
    },
    {
      href: "/crypto/bitcoin",
      label: "Crypto",
      icon: CreditCard,
    },
  ]

  return (
    <nav className="flex h-full w-[250px] flex-col border-r bg-muted/40 p-4">
      <div className="flex flex-col gap-2">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={cn(
              "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted",
              pathname === route.href && "bg-muted",
            )}
          >
            <route.icon className="h-4 w-4" />
            {route.label}
          </Link>
        ))}
      </div>

      {favorites.length > 0 && (
        <>
          <div className="my-4 border-t" />
          <div className="mb-2 flex items-center gap-2">
            <Star className="h-4 w-4" />
            <h3 className="text-sm font-medium">Favorites</h3>
          </div>
          <div className="flex flex-col gap-2">
            {favorites.map((favorite) => (
              <Link
                key={favorite.id}
                href={favorite.type === "city" ? `/weather/${favorite.id}` : `/crypto/${favorite.id}`}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted"
              >
                {favorite.type === "city" ? <Cloud className="h-4 w-4" /> : <CreditCard className="h-4 w-4" />}
                {favorite.name}
              </Link>
            ))}
          </div>
        </>
      )}
    </nav>
  )
}

