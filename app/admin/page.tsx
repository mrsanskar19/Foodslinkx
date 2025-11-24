"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { CheckCircle, TrendingUp, Users, Calendar, AlertCircle, Plus, Building2, DollarSign, Activity } from "lucide-react"

interface Hotel {
  _id: string
  name: string
  address: string
  verified: boolean
  plan: "free" | "basic" | "premium"
  planExpiry: string
  maxTables: number
  maxOrdersPerTable: number
  createdAt: string
}

interface Stats {
  totalHotels: number
  verifiedHotels: number
  totalOrders: number
  totalRevenue: number
}

export default function AdminPanel() {
  const [hotels, setHotels] = useState<Hotel[]>([])
  const [stats, setStats] = useState<Stats>({ totalHotels: 0, verifiedHotels: 0, totalOrders: 0, totalRevenue: 0 })
  const [loading, setLoading] = useState(true)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)
  const [showPlanModal, setShowPlanModal] = useState(false)
  const [newPlan, setNewPlan] = useState<"free" | "basic" | "premium">("free")

  useEffect(() => {
    const fetchData = async () => {
      try {
        const hotelsResponse = await fetch("/api/admin/hotels")
        if (hotelsResponse.ok) {
          const hotelsData = await hotelsResponse.json()
          setHotels(hotelsData.hotels)
        }

        const statsResponse = await fetch("/api/admin/stats")
        if (statsResponse.ok) {
          const statsData = await statsResponse.json()
          setStats(statsData)
        }
      } catch (error) {
        console.error("Error fetching admin data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  const handleVerifyHotel = async (hotelId: string) => {
    try {
      const response = await fetch(`/api/admin/hotels/${hotelId}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: true }),
      })

      if (response.ok) {
        setHotels((prev) => prev.map((h) => (h._id === hotelId ? { ...h, verified: true } : h)))
      }
    } catch (error) {
      console.error("Error verifying hotel:", error)
    }
  }

  const handleChangePlan = async () => {
    if (!selectedHotel) return

    try {
      const response = await fetch(`/api/admin/hotels/${selectedHotel._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: newPlan }),
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setHotels((prev) => prev.map((h) => (h._id === selectedHotel._id ? data.hotel : h)))
        setShowPlanModal(false)
        setSelectedHotel(null)
      }
    } catch (error) {
      console.error("Error changing plan:", error)
    }
  }

  const handleRejectHotel = async (hotelId: string) => {
    try {
      await fetch(`/api/admin/hotels/${hotelId}`, { method: "DELETE" })
      setHotels((prev) => prev.filter((h) => h._id !== hotelId))
    } catch (error) {
      console.error("Error rejecting hotel:", error)
    }
  }

  const isPlanExpired = (expiryDate: string) => {
    return new Date(expiryDate) < new Date()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading admin dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="max-w-7xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent mb-2">
              Admin Dashboard
            </h1>
            <p className="text-slate-600 text-lg">Manage hotels, plans, and view analytics</p>
          </div>
          <Link href="/admin/hotels/create">
            <button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5">
              <Plus size={20} />
              Create Hotel
            </button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <Building2 size={32} className="opacity-90" />
              <div className="bg-white/20 rounded-full p-2">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-blue-100 text-sm font-medium mb-1">Total Hotels</p>
            <p className="text-3xl font-bold">{stats.totalHotels}</p>
          </div>

          <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <CheckCircle size={32} className="opacity-90" />
              <div className="bg-white/20 rounded-full p-2">
                <Activity size={16} />
              </div>
            </div>
            <p className="text-green-100 text-sm font-medium mb-1">Verified Hotels</p>
            <p className="text-3xl font-bold">{stats.verifiedHotels}</p>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <Users size={32} className="opacity-90" />
              <div className="bg-white/20 rounded-full p-2">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-purple-100 text-sm font-medium mb-1">Total Orders</p>
            <p className="text-3xl font-bold">{stats.totalOrders}</p>
          </div>

          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <div className="flex items-center justify-between mb-4">
              <DollarSign size={32} className="opacity-90" />
              <div className="bg-white/20 rounded-full p-2">
                <TrendingUp size={16} />
              </div>
            </div>
            <p className="text-orange-100 text-sm font-medium mb-1">Revenue</p>
            <p className="text-3xl font-bold">₹{stats.totalRevenue}</p>
          </div>
        </div>

        {/* Hotels Table */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 overflow-hidden">
          <div className="p-6 border-b border-slate-200/60">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Building2 size={24} className="text-blue-600" />
              Hotels Management
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-slate-50 to-slate-100">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Hotel Name</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Plan</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Expiry</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {hotels && hotels.length > 0 ? hotels.map((hotel) => (
                  <tr key={hotel._id} className="border-t border-slate-200/60 hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 text-slate-800 font-semibold">{hotel.name}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold capitalize ${
                        hotel.plan === 'premium' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                        hotel.plan === 'basic' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                        'bg-gray-100 text-gray-800 border border-gray-200'
                      }`}>
                        {hotel.plan}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      <div className="flex items-center gap-2">
                        <Calendar size={16} className="text-slate-400" />
                        {new Date(hotel.planExpiry).toLocaleDateString()}
                        {isPlanExpired(hotel.planExpiry) && <AlertCircle size={16} className="text-red-500" />}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {hotel.verified ? (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-100 text-green-800 text-sm font-semibold border border-green-200">
                          <CheckCircle size={16} />
                          Verified
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-yellow-100 text-yellow-800 text-sm font-semibold border border-yellow-200">
                          <AlertCircle size={16} />
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {!hotel.verified && (
                          <button
                            onClick={() => handleVerifyHotel(hotel._id)}
                            className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg text-sm font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
                          >
                            Verify
                          </button>
                        )}
                        <button
                          onClick={() => {
                            setSelectedHotel(hotel)
                            setNewPlan(hotel.plan)
                            setShowPlanModal(true)
                          }}
                          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
                        >
                          Change Plan
                        </button>
                        <button
                          onClick={() => handleRejectHotel(hotel._id)}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-colors duration-150 shadow-sm hover:shadow-md"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                      <Building2 size={48} className="mx-auto mb-4 text-slate-300" />
                      <p className="text-lg font-medium">No hotels found</p>
                      <p className="text-sm">Create your first hotel to get started</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Plan Modal */}
      {showPlanModal && selectedHotel && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Change Plan</h2>
            <p className="text-slate-600 mb-6">{selectedHotel.name}</p>

            <div className="space-y-3 mb-8">
              {(["free", "basic", "premium"] as const).map((plan) => (
                <label
                  key={plan}
                  className={`flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition-all duration-200 ${
                    newPlan === plan
                      ? 'border-blue-500 bg-blue-50 shadow-md'
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="plan"
                    value={plan}
                    checked={newPlan === plan}
                    onChange={(e) => setNewPlan(e.target.value as "free" | "basic" | "premium")}
                    className="w-5 h-5 text-blue-600"
                  />
                  <div>
                    <span className="font-semibold text-slate-800 capitalize">{plan}</span>
                    <p className="text-sm text-slate-600">
                      {plan === 'free' && 'Basic features, limited tables'}
                      {plan === 'basic' && 'Enhanced features, more tables'}
                      {plan === 'premium' && 'All features, unlimited tables'}
                    </p>
                  </div>
                </label>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowPlanModal(false)}
                className="flex-1 px-6 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-semibold transition-colors duration-150"
              >
                Cancel
              </button>
              <button
                onClick={handleChangePlan}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold transition-all duration-150 shadow-lg hover:shadow-xl"
              >
                Update Plan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
