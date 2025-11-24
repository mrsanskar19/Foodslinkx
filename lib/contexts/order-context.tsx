"use client"

import type React from "react"
import { createContext, useContext, useState, useCallback } from "react"

export interface Order {
  _id: string
  hotelId: string
  table: string
  items: Array<{
    _id: string
    name: string
    price: number
    quantity: number
    customization?: string
  }>
  total: number
  status: "pending" | "cooking" | "served" | "paid"
  location?: {
    lat: number
    lon: number
    accuracy: number
    verified: boolean
    note?: string
  }
  requiresReview?: boolean
  createdAt: string
}

interface OrderContextType {
  orders: Order[]
  currentOrder: Order | null
  setOrders: (orders: Order[]) => void
  setCurrentOrder: (order: Order | null) => void
  addOrder: (order: Order) => void
  updateOrder: (orderId: string, updates: Partial<Order>) => void
  removeOrder: (orderId: string) => void
  getUnpaidOrders: () => Order[]
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([])
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null)

  const addOrder = useCallback((order: Order) => {
    setOrders((prevOrders) => [...prevOrders, order])
  }, [])

  const updateOrder = useCallback(
    (orderId: string, updates: Partial<Order>) => {
      setOrders((prevOrders) => prevOrders.map((o) => (o._id === orderId ? { ...o, ...updates } : o)))
      if (currentOrder?._id === orderId) {
        setCurrentOrder((prev) => (prev ? { ...prev, ...updates } : null))
      }
    },
    [currentOrder],
  )

  const removeOrder = useCallback(
    (orderId: string) => {
      setOrders((prevOrders) => prevOrders.filter((o) => o._id !== orderId))
      if (currentOrder?._id === orderId) {
        setCurrentOrder(null)
      }
    },
    [currentOrder],
  )

  const getUnpaidOrders = useCallback(() => {
    return orders.filter((o) => o.status !== "paid")
  }, [orders])

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        setOrders,
        setCurrentOrder,
        addOrder,
        updateOrder,
        removeOrder,
        getUnpaidOrders,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error("useOrder must be used within OrderProvider")
  }
  return context
}
