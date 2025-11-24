'use client'

import { useState, useEffect, useRef } from 'react'
import { useParams } from 'next/navigation'
import { QrCode, Download, RotateCcw, Table, Smartphone, Printer } from 'lucide-react'

export default function QRPage() {
  const params = useParams()
  const hotelId = params.id as string
  const [hotelData, setHotelData] = useState<any>(null)
  const [maxTables, setMaxTables] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [downloading, setDownloading] = useState<number | null>(null)
  const qrRef = useRef<HTMLDivElement>(null)

  // Fetch hotel data once
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await fetch(`/api/hotels/${hotelId}`)
        if (!res.ok) throw new Error('Failed to fetch hotel data')
        const data = await res.json()
        setHotelData(data)
        setMaxTables(data.maxTables || 0)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [hotelId])

  // Generate QR code service URL
  const getQrCodeUrl = (tableNumber: number) => {
    const menuUrl = `${window.location.origin}/hotels/${hotelId}?table=${tableNumber}`
    return `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(menuUrl)}&color=1F2937&bgcolor=FFFFFF`
  }

  // Download QR as png
  const downloadQRCode = async (tableNumber: number) => {
    setDownloading(tableNumber)
    try {
      // Fetch QR code image as blob to avoid CORS issues
      const qrUrl = getQrCodeUrl(tableNumber)
      const response = await fetch(qrUrl)
      const blob = await response.blob()
      const img = new Image()
      img.src = URL.createObjectURL(blob)

      // Wait for image to load
      await new Promise((resolve, reject) => {
        img.onload = resolve
        img.onerror = reject
      })

      // Create canvas to convert to PNG
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')
      canvas.width = 300
      canvas.height = 350

      if (ctx) {
        // Fill background
        ctx.fillStyle = '#FFFFFF'
        ctx.fillRect(0, 0, 300, 350)

        // Add title
        ctx.fillStyle = '#1F2937'
        ctx.font = 'bold 18px Arial'
        ctx.textAlign = 'center'
        ctx.fillText(`Table ${tableNumber}`, 150, 30)

        // Add subtitle
        ctx.font = '14px Arial'
        ctx.fillStyle = '#6B7280'
        ctx.fillText('Scan to Order', 150, 55)

        // Draw QR code
        ctx.drawImage(img, 25, 70, 250, 250)

        // Add footer
        ctx.font = '12px Arial'
        ctx.fillStyle = '#9CA3AF'
        ctx.fillText('Powered by FoodsLinkX', 150, 340)

        // Download
        const link = document.createElement('a')
        link.href = canvas.toDataURL('image/png')
        link.download = `table-${tableNumber}-qr.png`
        link.click()

        // Clean up object URL
        URL.revokeObjectURL(img.src)
      }
    } catch (error) {
      console.error('Download failed:', error)
    } finally {
      setDownloading(null)
    }
  }

  const regenerateQRCode = (tableNumber: number) => {
    // In a real app, this would regenerate the QR code with new data
    alert(`QR Code for Table ${tableNumber} has been refreshed!`)
  }

  const downloadAllQRCodes = () => {
    // Download all QR codes as a batch
    Array.from({ length: maxTables }, (_, i) => i + 1).forEach((tableNumber, index) => {
      setTimeout(() => downloadQRCode(tableNumber), index * 500)
    })
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Loading QR Codes...</h3>
            <p className="text-gray-600">Generating table QR codes for your restaurant</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <QrCode className="text-red-500" size={40} />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading QR Codes</h3>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
                QR Table Codes
              </h1>
              <p className="text-gray-600 text-lg">Generate and manage QR codes for seamless ordering</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total Tables</p>
                <p className="text-2xl font-bold text-gray-800">{maxTables}</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <QrCode className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Active Tables</p>
                <p className="text-3xl font-bold text-gray-900">{maxTables}</p>
                <p className="text-sm text-green-600 mt-1">All tables configured</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center">
                <Table className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">QR Downloads</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
                <p className="text-sm text-blue-600 mt-1">This month</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Download className="text-white" size={24} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500 mb-1">Mobile Access</p>
                <p className="text-3xl font-bold text-gray-900">100%</p>
                <p className="text-sm text-purple-600 mt-1">Ready for customers</p>
              </div>
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                <Smartphone className="text-white" size={24} />
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-100">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">Bulk Actions</h3>
              <p className="text-sm text-gray-600">Download all QR codes at once or print them</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={downloadAllQRCodes}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                <Download size={18} />
                Download All
              </button>
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-xl hover:from-gray-600 hover:to-gray-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
              >
                <Printer size={18} />
                Print All
              </button>
            </div>
          </div>
        </div>

        {/* QR Codes Grid */}
        <section ref={qrRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {Array.from({ length: maxTables }, (_, i) => i + 1).map((tableNumber) => (
            <div
              key={tableNumber}
              className="bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden"
            >
              <div className="p-6 flex flex-col items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mb-4">
                  <Table className="text-white" size={20} />
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Table {tableNumber}
                </h3>

                <div className="bg-gray-50 rounded-xl p-4 mb-4">
                  <img
                    id={`qr-img-${tableNumber}`}
                    src={getQrCodeUrl(tableNumber)}
                    alt={`Table ${tableNumber} QR`}
                    className="w-32 h-32 mx-auto rounded-lg shadow-sm"
                  />
                </div>

                <div className="flex flex-col gap-3 w-full">
                  <button
                    onClick={() => downloadQRCode(tableNumber)}
                    disabled={downloading === tableNumber}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {downloading === tableNumber ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Download size={16} />
                    )}
                    {downloading === tableNumber ? 'Downloading...' : 'Download'}
                  </button>

                  <button
                    onClick={() => regenerateQRCode(tableNumber)}
                    className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl font-semibold"
                  >
                    <RotateCcw size={16} />
                    Refresh
                  </button>
                </div>
              </div>
            </div>
          ))}
        </section>

        {/* Instructions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use QR Codes</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Print & Place</h4>
              <p className="text-sm text-gray-600">Download and print QR codes, then place them on each table</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Scan to Order</h4>
              <p className="text-sm text-gray-600">Customers scan the code to access your digital menu</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Receive Orders</h4>
              <p className="text-sm text-gray-600">Orders appear instantly in your dashboard</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
