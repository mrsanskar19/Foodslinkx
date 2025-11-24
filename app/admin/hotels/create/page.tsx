'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function CreateHotelPage() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [upiId, setUpiId] = useState('')
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [plan, setPlan] = useState('free')
  const [maxTables, setMaxTables] = useState(10)
  const [maxOrdersPerTable, setMaxOrdersPerTable] = useState(5)
  const [locationVerificationRadius, setLocationVerificationRadius] = useState(500)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/admin/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          address,
          upiId,
          latitude,
          longitude,
          plan,
          maxTables,
          maxOrdersPerTable,
          locationVerificationRadius,
        }),
      })

      if (response.ok) {
        alert('Hotel Created')
        router.push('/admin')
      } else {
        const errorData = await response.json()
        alert(errorData.message || 'Failed to create hotel.')
      }
    } catch (error) {
      alert('An unexpected error occurred.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Create New Hotel</h1>
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Hotel Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g., The Grand Hotel"
            required
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="e.g., 123 Main Street, City"
            required
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="upiId" className="block text-sm font-medium text-gray-700 mb-1">
            UPI ID
          </label>
          <input
            id="upiId"
            value={upiId}
            onChange={(e) => setUpiId(e.target.value)}
            placeholder="e.g., hotelname@upi"
            required
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
              Latitude
            </label>
            <input
              id="latitude"
              type="number"
              value={latitude}
              onChange={(e) => setLatitude(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
              Longitude
            </label>
            <input
              id="longitude"
              type="number"
              value={longitude}
              onChange={(e) => setLongitude(parseFloat(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-4">
          <label htmlFor="plan" className="block text-sm font-medium text-gray-700 mb-1">
            Plan
          </label>
          <select
            id="plan"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
          >
            <option value="free">Free</option>
            <option value="basic">Basic</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="maxTables" className="block text-sm font-medium text-gray-700 mb-1">
              Max Tables
            </label>
            <input
              id="maxTables"
              type="number"
              value={maxTables}
              onChange={(e) => setMaxTables(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
            />
          </div>
          <div>
            <label htmlFor="maxOrdersPerTable" className="block text-sm font-medium text-gray-700 mb-1">
              Max Orders Per Table
            </label>
            <input
              id="maxOrdersPerTable"
              type="number"
              value={maxOrdersPerTable}
              onChange={(e) => setMaxOrdersPerTable(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
            />
          </div>
        </div>
        <div className="mb-6">
          <label htmlFor="locationVerificationRadius" className="block text-sm font-medium text-gray-700 mb-1">
            Location Verification Radius (m)
          </label>
          <input
            id="locationVerificationRadius"
            type="number"
            value={locationVerificationRadius}
            onChange={(e) => setLocationVerificationRadius(parseInt(e.target.value))}
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground focus:outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Creating...' : 'Create Hotel'}
        </button>
      </form>
    </div>
  )
}
