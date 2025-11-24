import { connectDB } from "@/lib/db"
import Feedback from "@/lib/models/Feedback"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    const feedback = new Feedback({
      hotelId: data.hotelId,
      table: data.table,
      rating: data.rating,
      message: data.message,
    })

    await feedback.save()
    return NextResponse.json(feedback, { status: 201 })
  } catch (error) {
    console.error("Error creating feedback:", error)
    return NextResponse.json({ error: "Failed to create feedback" }, { status: 500 })
  }
}
