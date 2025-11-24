"use client"

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRealtimeData } from "@/hooks/use-realtime-data";
import { IOrder as Order } from "@/lib/models/Order";
import { Receipt, Table, Calendar, Download } from "lucide-react";
import CreateInvoiceModal from "@/components/dashboard/CreateInvoiceModal";

export default function InvoicesPage() {
  const params = useParams()
  const hotelId = params.id as string
  const { data, loading } = useRealtimeData<Order[]>(`/api/dashboard/hotels/${hotelId}/orders`, 10000)
  const [filter, setFilter] = useState<"all" | "paid" | "active">("all")
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredOrders = data?.filter((order) => {
    if (filter === "paid") {
      return order.status === "paid"
    }
    if (filter === "active") {
      return order.status !== "paid"
    }
    return true
  })

  const downloadInvoice = (orderId: string) => {
    window.open(`/hotels/${hotelId}/invoice/${orderId}`, '_blank')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                Invoice Management
              </h1>
              <p className="text-gray-600 text-lg">Download and manage customer invoices</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Invoices</p>
                <p className="text-2xl font-bold text-gray-800">{filteredOrders?.length || 0}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Receipt className="text-white" size={24} />
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
              All Invoices ({data?.length || 0})
            </button>
            <button
              onClick={() => setFilter("active")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'active'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Active Orders ({data?.filter((o) => o.status !== 'paid').length || 0})
            </button>
            <button
              onClick={() => setFilter("paid")}
              className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 ${
                filter === 'paid'
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid Invoices ({data?.filter((o) => o.status === 'paid').length || 0})
            </button>
          </div>
        </div>

        {/* Add Create Invoice Button Here */}
        <div className="mb-6 flex justify-end max-w-7xl mx-auto px-6">
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3 btn-gradient text-white rounded-xl font-semibold shadow-luxury hover:shadow-glow transition-all duration-300 transform hover:scale-105"
          >
            Create Invoice
          </button>
        </div>

        {/* Invoices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading Invoices...</h3>
              <p className="text-gray-600">Please wait while we fetch your invoices</p>
            </div>
          ) : filteredOrders?.length === 0 ? (
            <div className="col-span-full bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
              <Receipt className="text-gray-400 mx-auto mb-4" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No invoices found</h3>
              <p className="text-gray-600">No invoices match the selected filter</p>
            </div>
          ) : (
            filteredOrders?.map((order) => (
              <div
              key={order._id as string}
              className="bg-white border border-gray-200 rounded-2xl p-6 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Invoice #{(order._id as string).slice(-8).toUpperCase()}</h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                      <div className="flex items-center gap-1">
                        <Table size={14} />
                        Table {order.table}
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    order.status === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : order.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </div>
                </div>

                {/* Items Summary */}
                <div className="space-y-2 mb-4">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-700">{item.quantity}x {item.name}</span>
                      <span className="text-gray-900 font-medium">₹{item.price * item.quantity}</span>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="text-sm text-gray-500">+{order.items.length - 3} more items</p>
                  )}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center mb-6 p-3 bg-gray-50 rounded-lg">
                  <span className="font-semibold text-gray-900">Total:</span>
                  <span className="text-xl font-bold text-green-600">₹{order.total}</span>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => downloadInvoice(order._id as string)}
                  className="w-full bg-gradient-to-r from-green-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-green-600 hover:to-teal-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                  <Download size={18} />
                  Download Invoice
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Invoice Modal */}
      {isModalOpen && (
        <CreateInvoiceModal
          hotelId={hotelId}
          onClose={() => setIsModalOpen(false)}
          onInvoiceCreated={() => {
            setIsModalOpen(false);
            // Refresh orders list by some method
          }}
        />
      )}
    </div>
  )
}
