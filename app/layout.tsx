import type React from "react"
import { Inter } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import ReduxProvider from "@/redux/provider"
import WebSocketProvider from "@/components/websocket-provider"
import MainNav from "@/components/main-nav"
import SideNav from "@/components/side-nav"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "CryptoWeather Nexus",
  description: "Weather and Cryptocurrency Dashboard",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ReduxProvider>
            <WebSocketProvider>
              <div className="flex min-h-screen flex-col">
                <MainNav />
                <div className="flex flex-1">
                  <SideNav />
                  <main className="flex-1 p-4 md:p-6">{children}</main>
                </div>
                <Toaster />
              </div>
            </WebSocketProvider>
          </ReduxProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}



import './globals.css'