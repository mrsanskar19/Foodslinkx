"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import MainLayout from "@/components/layout/MainLayout"
import HotelNavbar from "@/components/hotel/HotelNavbar"
import { Trash2, Plus, Minus, ArrowLeft } from "lucide-react"
import { useCart } from "@/lib/contexts/cart-context"

export default function CartPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.id as string

  // ✅ useCart Hook
  const { items, updateQuantity, removeItem, clearCart, total, itemCount, placeOrder, placingOrder, placeOrderError } = useCart()

  const [hotelName, setHotelName] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const hotelResponse = await fetch(`/api/hotels/${hotelId}`)
        if (hotelResponse.ok) {
          const hotelData = await hotelResponse.json()
          setHotelName(hotelData.name)
        }
      } catch (error) {
        console.error("Error fetching hotel:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [hotelId])


  if (loading) {
    return (
      <MainLayout hotelId={hotelId}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground">Loading cart...</p>
          </div>
        </div>
      </MainLayout>
    )
  }

  if (items.length === 0) {
    return (
      <MainLayout hotelId={hotelId}>
        <HotelNavbar hotelName={hotelName} onSearch={() => {}} />
        <div className="flex items-center justify-center min-h-screen px-4">
          <div className="text-center">
            <p className="text-lg text-muted-foreground mb-4">Your cart is empty</p>
            <button
              onClick={() => router.push(`/hotels/${hotelId}`)}
              className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              <ArrowLeft size={20} />
              Back to Menu
            </button>
          </div>
        </div>
      </MainLayout>
    )
  }
  const finalTotal = total

  return (
    <MainLayout hotelId={hotelId}>
      <HotelNavbar hotelName={hotelName} onSearch={() => {}} />

      <div className="px-4 py-4 pb-32 md:pb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-foreground">Your Cart</h2>
          <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold">
            {itemCount} item{itemCount !== 1 ? 's' : ''}
          </span>
        </div>

        <div className="space-y-3 mb-6">
          {items.map((item) => (
            <div key={item._id} className="bg-card border-2 border-border rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{item.name}</h3>
                  {item.customization && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Note: {item.customization}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeItem(item.menuItemId)}
                  className="p-2 hover:bg-destructive/10 rounded transition-colors"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={18} className="text-destructive" />
                </button>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 bg-secondary rounded-lg p-1">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="p-1 hover:bg-secondary-foreground/20 rounded transition-colors"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    <Minus size={16} className="text-foreground" />
                  </button>
                  <span className="text-sm font-semibold text-foreground w-6 text-center" aria-label={`Quantity: ${item.quantity}`}>
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="p-1 hover:bg-secondary-foreground/20 rounded transition-colors"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    <Plus size={16} className="text-foreground" />
                  </button>
                </div>
                <p className="font-bold text-primary">₹{item.price * item.quantity}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={() => router.push(`/hotels/${hotelId}`)}
          className="w-full mb-4 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
        >
          Add More Items
        </button>

        <button
          onClick={() => clearCart()}
          className="w-full mb-4 bg-secondary text-secondary-foreground py-3 rounded-lg font-semibold hover:bg-secondary/80 transition-colors"
        >
          Clear Cart
        </button>

        <div className="bg-card border-2 border-border rounded-lg p-4 space-y-3">
          <div className="flex justify-between text-foreground">
            <span>Subtotal:</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-primary border-t-2 border-border pt-3">
            <span>Total:</span>
            <span>₹{finalTotal.toFixed(2)}</span>
          </div>

          <button
            onClick={async () => {
              const order = await placeOrder()
              if (order) {
                router.push(`/hotels/${hotelId}/orders`)
              }
            }}
            disabled={placingOrder || items.length === 0}
            className={`w-full bg-primary text-primary-foreground py-4 rounded-lg font-bold text-lg hover:bg-primary/90 transition-all mt-4 shadow-lg hover:shadow-xl transform hover:scale-105 ${
              placingOrder || items.length === 0 ? "opacity-70 cursor-not-allowed" : ""
            }`}
            aria-label={`Place order for ${itemCount} items totaling ₹${finalTotal.toFixed(2)}`}
          >
            {placingOrder ? "Placing Order..." : `Place Order - ₹${finalTotal.toFixed(2)}`}
          </button>
          {placeOrderError? <p>{placeOrderError}</p> : ""}
        </div>
      </div>
    </MainLayout>
  )
}
