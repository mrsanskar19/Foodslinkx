"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Trash2, ClipboardList } from "lucide-react"
import OrderCard from "@/components/dashboard/OrderCard"
import { useRealTimeFetch } from "@/lib/fetchReal"

interface OrderItem {
  _id: string
  name: string
  price: number
  quantity: number
  customization?: string
}

interface Order {
  _id: string
  table: string
  items: OrderItem[]
  total: number
  status: "pending" | "cooking" | "served" | "paid"
  createdAt: string
  updatedAt: string
}

export default function OrdersPage() {
  const params = useParams()
  const hotelId = params.id as string
  const { data, loading, error } = useRealTimeFetch(`/api/dashboard/hotels/${hotelId}/orders`, 10000)
  const [filter, setFilter] = useState<"all" | "paid" | "active">("all")

  const handleDelete = async (orderId: string) => {
    if (confirm("Are you sure you want to delete this order?")) {
      try {
        const res = await fetch(`/api/orders/${orderId}`, {
          method: "DELETE",
        })
        if (!res.ok) {
          throw new Error("Failed to delete order")
        }
        // You might want to refresh the data here
      } catch (error) {
        console.error("Error deleting order:", error)
        alert("Failed to delete order")
      }
    }
  }

  const filteredOrders = data?.filter((order: Order) => {
    if (filter === "paid") {
      return order.status === "paid"
    }
    if (filter === "active") {
      return order.status !== "paid"
    }
    return true
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Orders Management
              </h1>
              <p className="text-gray-600 text-lg">Track and manage all customer orders</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-2xl font-bold text-gray-800">{filteredOrders?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <ClipboardList className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-wrap justify-center gap-4">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All Orders ({data?.length || 0})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'active'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active Orders ({data?.filter((o: Order) => o.status !== 'paid').length || 0})
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'paid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid Orders ({data?.filter((o: Order) => o.status === 'paid').length || 0})
            </button>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Orders...</h3>
              <p className="text-gray-600">Please wait while we fetch your orders</p>
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <ClipboardList className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders found</h3>
              <p className="text-gray-600">No orders match the selected filter</p>
            </div>
          ) : (
            filteredOrders?.map((order: Order) => (
              <div key={order._id} className="relative transform hover:scale-105 transition-all duration-300">
                <OrderCard order={order} hotelId={hotelId} />
                <button
                  onClick={() => handleDelete(order._id)}
                  className="absolute top-4 right-4 bg-red-500 text-white p-2 rounded-full hover:bg-red-600 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-110"
                  aria-label="Delete Order"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
