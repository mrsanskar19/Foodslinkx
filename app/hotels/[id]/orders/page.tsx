"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import HotelNavbar from "@/components/hotel/HotelNavbar"
import BottomNav from "@/components/hotel/BottomNav"
import MainLayout from "@/components/layout/MainLayout"
import { getDeviceId } from "@/lib/utils/device-id"
import Link from "next/link"
import { Clock, CheckCircle, Utensils } from "lucide-react"

interface OrderItem {
  _id?: string
  menuItemId: string
  name: string
  price: number
  quantity: number
  customization?: string
}

interface Order {
  _id: string
  items: OrderItem[]
  total: number
  status: "pending" | "cooking" | "served" | "paid"
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const params = useParams()
  const hotelId = params.id as string
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [hotelName, setHotelName] = useState("")

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const deviceId = getDeviceId()
        const response = await fetch(`/api/orders?hotelId=${hotelId}&deviceId=${deviceId}`)

        if (response.ok) {
          const data = await response.json()
          setOrders(Array.isArray(data) ? data : [data])
        }

        const hotelResponse = await fetch(`/api/hotels/${hotelId}`)
        if (hotelResponse.ok) {
          const hotelData = await hotelResponse.json()
          setHotelName(hotelData.name)
        }
      } catch (error) {
        console.error("Error fetching orders:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()

    // Poll for updates every 3 seconds
    const interval = setInterval(fetchOrders, 3000)
    return () => clearInterval(interval)
  }, [hotelId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock size={20} className="text-yellow-500" />
      case "cooking":
        return <Utensils size={20} className="text-blue-500" />
      case "served":
        return <CheckCircle size={20} className="text-green-500" />
      case "paid":
        return <CheckCircle size={20} className="text-green-600" />
      default:
        return null
    }
  }

  const getStatusLabel = (status: string) => {
    return status?.charAt(0).toUpperCase() + status?.slice(1)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading orders...</p>
        </div>
      </div>
    )
  }

  return (
    <MainLayout hotelId={hotelId}>
      <HotelNavbar hotelName={hotelName} onSearch={function (query: string): void {
        console.log("not working")
      } } />
      <div className="flex flex-col min-h-screen bg-background pb-20">
        <main className="flex-1 px-4 py-4">
          <h2 className="text-2xl font-bold text-foreground mb-4">Your Orders</h2>
          {(orders.length === 0) || orders[0] == null ? (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <p className="text-muted-foreground">No orders yet</p>
              <Link
                href="/"
                className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-center"
              >
                Home
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order?._id} className="bg-card border-2 border-border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <p className="text-sm text-muted-foreground">Order ID: {order?._id.slice(-6)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order?.createdAt).toLocaleString()}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order?.status)}
                      <span className="font-semibold text-foreground">{getStatusLabel(order?.status)}</span>
                    </div>
                  </div>

                  <div className="space-y-2 mb-3 pb-3 border-b-2 border-border">
                    {order?.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span className="text-foreground">
                          {item.quantity}x {item.name}
                        </span>
                        <span className="text-foreground">₹{item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between font-bold text-foreground mb-3">
                    <span>Total:</span>
                    <span className="text-primary">₹{order?.total}</span>
                  </div>

                  <div className="flex gap-2">
                    <Link
                      href={`./pay?orderId=${order?._id}`}
                      className="inline-block px-4 py-2 bg-primary text-white rounded hover:bg-primary-dark text-center"
                    >
                      Pay Bill
                    </Link>
                    <Link
                      href={`./invoice/${order?._id}`}
                      className="inline-block px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 text-center"
                    >
                      Download Invoice
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <BottomNav hotelId={hotelId} />
      </div>
    </MainLayout>
  )
}
