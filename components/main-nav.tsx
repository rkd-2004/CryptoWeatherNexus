"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"
import SideNav from "./side-nav"
import NotificationBar from "./notifications/notification-bar"

export default function MainNav() {
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2 md:gap-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0">
              <SideNav />
            </SheetContent>
          </Sheet>

          <Link href="/" className="font-bold">
            CryptoWeather Nexus
          </Link>

          <nav className="hidden md:flex md:gap-4">
            <Link
              href="/"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname === "/" ? "text-primary" : "text-muted-foreground",
              )}
            >
              Dashboard
            </Link>
            <Link
              href="/weather/new-york"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith("/weather") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Weather
            </Link>
            <Link
              href="/crypto/bitcoin"
              className={cn(
                "text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith("/crypto") ? "text-primary" : "text-muted-foreground",
              )}
            >
              Crypto
            </Link>
          </nav>
        </div>

        <div className="flex items-center gap-2">
          <NotificationBar />
        </div>
      </div>
    </header>
  )
}

