"use client"

import { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { Clock, Utensils, CheckCircle, DollarSign, TrendingUp, Users, Star } from "lucide-react"
import OrderCard from "@/components/dashboard/OrderCard"
import StatsCard from "@/components/dashboard/StatsCard"
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

export default function HotelDashboard() {
  const params = useParams()
  const hotelId = params.id as string
  const [stats, setStats] = useState({ pending: 0, cooking: 0, served: 0, paid: 0 })
  const [hotelData,setHotelData] = useState<any>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState<null | Order["status"]>(null)

  const { data, loading, error } = useRealTimeFetch(`/api/dashboard/hotels/${hotelId}/orders`, 10000)

  useEffect(() => {

    const fetchHotel = async()=>{
      try {
        const res = await fetch(`/api/hotels/${hotelId}`)
        if (!res.ok) {
          throw new Error('Failed to fetch hotel data')
        }
        const data = await res.json()
        setHotelData(data)
      } catch (err) {
        console.error('Error fetching hotel data:', err)
        return null
      }
    }

    fetchHotel()
    
    if (!data || !Array.isArray(data)) {
      setStats({ pending: 0, cooking: 0, served: 0, paid: 0 })
      return
    }

    const newStats = data.reduce(
      (acc, order) => {
        switch (order.status) {
          case "pending":
            acc.pending += 1
            break
          case "cooking":
            acc.cooking += 1
            break
          case "served":
            acc.served += 1
            break
          case "paid":
            acc.paid += 1
            break
          default:
            break
        }
        return acc
      },
      { pending: 0, cooking: 0, served: 0, paid: 0 }
    )

    setStats(newStats)
  }, [data])

  const handleRefresh = () => {
    window.location.reload()
  }

  // Filter data based on searchTerm (table or order ID) and filterStatus
  const filteredOrders = data?.filter((order: Order) => {
    const term = searchTerm.toLowerCase()
    const matchesTable = order.table.toLowerCase().includes(term)
    const matchesOrderId = order._id.toLowerCase().includes(term)
    const matchesStatus = filterStatus ? order.status === filterStatus : true
    return (matchesTable || matchesOrderId) && matchesStatus
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                {hotelData?.name || "Loading.."}
              </h1>
              <p className="text-gray-600 text-lg">Real-time order management dashboard</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Today's Orders</p>
                <p className="text-2xl font-bold text-gray-800">{stats.pending + stats.cooking + stats.served + stats.paid}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <TrendingUp className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Pending Orders</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-xl flex items-center justify-center">
                <Clock className="text-yellow-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Cooking</p>
                <p className="text-3xl font-bold text-blue-600">{stats.cooking}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Utensils className="text-blue-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Served</p>
                <p className="text-3xl font-bold text-green-600">{stats.served}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Paid Orders</p>
                <p className="text-3xl font-bold text-purple-600">{stats.paid}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search by table number or order ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <div className="flex gap-4">
              <select
                value={filterStatus || ""}
                onChange={(e) => setFilterStatus(e.target.value ? (e.target.value as Order["status"]) : null)}
                className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 min-w-[180px]"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="cooking">Cooking</option>
                <option value="served">Served</option>
                <option value="paid">Paid</option>
              </select>

              <button
                disabled={loading}
                onClick={handleRefresh}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Refreshing...
                  </div>
                ) : (
                  "Refresh"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Orders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredOrders?.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-gray-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No orders yet</h3>
              <p className="text-gray-600">Orders will appear here as customers place them</p>
            </div>
          ) : (
            filteredOrders?.map((order: Order) => (
              <div key={order._id} className="transform hover:scale-105 transition-all duration-300">
                <OrderCard order={order} hotelId={hotelId} />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
