"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import HotelNavbar from "@/components/hotel/HotelNavbar"
import BottomNav from "@/components/hotel/BottomNav"
import { Star } from "lucide-react"
import { getWithExpiry } from "@/lib/utils/localStorageWithExpiry"

export default function FeedbackPage() {
  const params = useParams()
  const router = useRouter()
  const hotelId = params.id as string

  const [rating, setRating] = useState(0)
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (rating === 0) {
      alert("Please select a rating")
      return
    }

    setSubmitting(true)
    try {
      const table = getWithExpiry("tableId") || "Unknown"
      const response = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hotelId,
          table,
          rating,
          message,
        }),
      })

      if (response.ok) {
        setSubmitted(true)
        setTimeout(() => {
          router.push(`/hotels/${hotelId}`)
        }, 2000)
      }
    } catch (error) {
      console.error("Error submitting feedback:", error)
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col min-h-screen bg-background pb-20">
        <HotelNavbar hotelName="Feedback" onSearch={() => {}} />
        <main className="flex-1 flex items-center justify-center px-4">
          <div className="text-center">
            <p className="text-lg text-foreground mb-2">Thank you for your feedback!</p>
            <p className="text-muted-foreground">Redirecting...</p>
          </div>
        </main>
        <BottomNav hotelId={hotelId} />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-background pb-20">
      <HotelNavbar hotelName="Feedback" onSearch={() => {}} />

      <main className="flex-1 px-4 py-6">
        <h2 className="text-2xl font-bold text-foreground mb-6">Share Your Feedback</h2>

        {/* Rating */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-3">How was your experience?</label>
          <div className="flex gap-3 justify-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button key={star} onClick={() => setRating(star)} className="transition-transform hover:scale-110">
                <Star
                  size={40}
                  className={star <= rating ? "fill-yellow-400 text-yellow-400" : "text-muted-foreground"}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Message */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-foreground mb-2">Additional Comments (Optional)</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Tell us what you think..."
            className="w-full px-3 py-2 rounded-lg border-2 border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:border-primary resize-none"
            rows={4}
          />
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Feedback"}
        </button>
      </main>

      <BottomNav hotelId={hotelId} />
    </div>
  )
}
