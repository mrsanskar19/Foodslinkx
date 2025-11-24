"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { getDeviceId } from "@/lib/utils/device-id"

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  customization?: string
}

interface Order {
  _id: string
  hotelId: string
  table: string
  items: OrderItem[]
  total: number
  status: "pending" | "cooking" | "served" | "paid"
  location?: {
    verified: boolean
    note?: string
  }
  requiresReview?: boolean
  createdAt: string
}

export default function OrderStack() {
  const params = useParams()
  const hotelId = params.id as string
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const deviceId = getDeviceId()
        const response = await fetch(`/api/orders?hotelId=${hotelId}&deviceId=${deviceId}`)

        if (response.ok) {
          const order = await response.json()
          if (order) {
            setOrders([order])
          }
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
    const interval = setInterval(fetchOrders, 5000)
    return () => clearInterval(interval)
  }, [hotelId])

  if (loading) {
    return null
  }

  if (orders.length === 0) {
    return null
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={20} className="text-yellow-500" />
      case "cooking":
        return <Clock size={20} className="text-blue-500" />
      case "served":
        return <CheckCircle size={20} className="text-green-500" />
      case "paid":
        return <CheckCircle size={20} className="text-gray-500" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "pending":
        return "Pending"
      case "cooking":
        return "Cooking"
      case "served":
        return "Served"
      case "paid":
        return "Paid"
      default:
        return status
    }
  }

  return (
    <div className="fixed top-14 right-4 z-30 max-w-sm">
      {orders?.map((order) => (
        <div key={order._id} className="bg-card border-2 border-border rounded-lg p-4 mb-3 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              {getStatusIcon(order.status)}
              <span className="font-semibold text-foreground">{getStatusLabel(order.status)}</span>
            </div>
            {order.requiresReview && (
              <div className="flex items-center gap-1 text-red-500">
                <AlertCircle size={16} />
                <span className="text-xs font-medium">Review</span>
              </div>
            )}
          </div>

          <div className="text-sm text-muted-foreground mb-2">
            Table: <span className="font-semibold text-foreground">{order?.table}</span>
          </div>

          <div className="text-sm text-muted-foreground mb-3">
            Items: <span className="font-semibold text-foreground">{order?.items?.length}</span>
          </div>

          <div className="border-t border-border pt-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">Total:</span>
              <span className="font-bold text-primary">₹{order?.total}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
