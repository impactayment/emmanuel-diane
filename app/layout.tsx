import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display, Dancing_Script } from "next/font/google"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" })
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" })
const dancing = Dancing_Script({ subsets: ["latin"], variable: "--font-dancing" })

export const metadata: Metadata = {
  title: "Emmanuel & Diane",
  description: "Rejoignez-nous le 14 septembre 2025 pour célébrer notre union dans la joie et l'amour",
  keywords: "mariage, wedding, Emmanuel, Diane, célébration, amour",
  icons: {
    icon: "/favicon.svg",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" className="scroll-smooth">
      <body className={`${inter.variable} ${playfair.variable} ${dancing.variable} font-sans antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
