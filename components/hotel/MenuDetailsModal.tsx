"use client"

import { useState } from "react"
import { X, Plus, Minus } from "lucide-react"
import { useRouter } from "next/navigation"
import { getDeviceId } from "@/lib/utils/device-id"
import { useCart } from "@/lib/contexts/cart-context"

interface MenuItem {
  menuItemId?: string
  _id?:string
  name: string
  description: string
  price: number
  category: string
  available: boolean
  image?: string
}

interface MenuDetailsModalProps {
  item: MenuItem
  onClose: () => void
  hotelId: string
}

export default function MenuDetailsModal({ item, onClose, hotelId }: MenuDetailsModalProps) {
  const router = useRouter()
  const {addItem} = useCart()
  const [quantity, setQuantity] = useState(1)
  const [customization, setCustomization] = useState("")
  const [adding, setAdding] = useState(false)

  const handleAddToCart = async () => {
    setAdding(true)
    try {
      const deviceId = getDeviceId()
      const newItem = {
        ...item,
        menuItemId:item?._id || "No Item Id Found",
        deviceId,
        hotelId,
        quantity,
        customization,
      }
      addItem(newItem)
        onClose()
        router.push(`/hotels/${hotelId}/cart`)
    } catch (error) {
      console.error("Error adding to cart:", error)
    } finally {
      setAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
      <div className="w-full bg-card rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <h2 className="text-2xl font-bold text-foreground">{item.name}</h2>
          <button onClick={onClose} className="p-2 hover:bg-secondary rounded-lg transition-colors" aria-label="Close menu details">
            <X size={24} className="text-foreground" />
          </button>
        </div>

        {/* Description */}
        <p className="text-muted-foreground mb-4">{item.description}</p>

        {/* Price */}
        <div className="mb-6">
          <p className="text-3xl font-bold text-primary">₹{item.price}</p>
        </div>

        {/* Customization */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">Special Instructions (Optional)</label>
          <textarea
            value={customization}
            onChange={(e) => setCustomization(e.target.value)}
            placeholder="e.g., Extra spicy, no onions, etc."
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
            rows={3}
          />
        </div>

        {/* Quantity Selector */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-3">Quantity</label>
          <div className="flex items-center gap-4 bg-secondary rounded-lg p-2 w-fit">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="p-2 hover:bg-secondary-foreground/20 rounded transition-colors"
              aria-label="Decrease quantity"
            >
              <Minus size={20} className="text-foreground" />
            </button>
            <span className="text-lg font-semibold text-foreground w-8 text-center" aria-label={`Quantity: ${quantity}`}>{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="p-2 hover:bg-secondary-foreground/20 rounded transition-colors"
              aria-label="Increase quantity"
            >
              <Plus size={20} className="text-foreground" />
            </button>
          </div>
        </div>

        {/* Selected Modifiers Summary */}
        {customization && (
          <div className="mb-4 p-3 bg-secondary rounded-lg">
            <h4 className="font-semibold text-foreground mb-2">Special Instructions:</h4>
            <p className="text-muted-foreground text-sm">{customization}</p>
          </div>
        )}

        {/* Order Summary */}
        <div className="mb-6 p-4 bg-secondary rounded-lg">
          <div className="flex justify-between items-center mb-2">
            <span className="text-foreground font-semibold">Item:</span>
            <span className="text-foreground">₹{item.price}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-foreground font-semibold">Quantity:</span>
            <span className="text-foreground">{quantity}</span>
          </div>
          <div className="flex justify-between items-center border-t border-border pt-2">
            <span className="text-foreground font-bold text-lg">Total:</span>
            <span className="text-2xl font-bold text-primary">₹{item.price * quantity}</span>
          </div>
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          disabled={adding}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
          aria-label={`Add ${quantity} ${item.name}${quantity > 1 ? 's' : ''} to cart for ₹${item.price * quantity}`}
        >
          {adding ? "Adding..." : `Add to Cart - ₹${item.price * quantity}`}
        </button>
      </div>
    </div>
  )
}
