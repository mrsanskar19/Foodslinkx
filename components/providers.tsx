"use client"

import type React from "react"
import { AuthProvider } from "@/lib/contexts/auth-context"
import { CartProvider } from "@/lib/contexts/cart-context"
import { OrderProvider } from "@/lib/contexts/order-context"
import { ToastProvider } from "@/lib/contexts/toast-context"

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <OrderProvider>
          <ToastProvider>
            {children}
          </ToastProvider>
        </OrderProvider>
      </CartProvider>
    </AuthProvider>
  )
}