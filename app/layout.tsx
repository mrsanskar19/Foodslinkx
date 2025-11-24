import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ClientProviders } from "@/components/client-providers"

export const metadata: Metadata = {
  title: "Hotel Order Management",
  description: "Real-time hotel order management system",
  generator: 'v0.app'
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <ClientProviders>
          {children}
        </ClientProviders>
      </body>
    </html>
  )
}
