"use client"

import type React from "react"
import { Providers } from "@/components/providers"

interface ClientProvidersProps {
  children: React.ReactNode
}

export function ClientProviders({ children }: ClientProvidersProps) {
  return <Providers>{children}</Providers>
}