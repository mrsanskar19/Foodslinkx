import { connectDB } from "@/lib/db"
import Hotel from "@/lib/models/Hotel"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const hotel = await Hotel.findById(id)

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    return NextResponse.json(hotel)
  } catch (error) {
    console.error("Error fetching hotel:", error)
    return NextResponse.json({ error: "Failed to fetch hotel" }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const data = await request.json()

    const hotel = await Hotel.findByIdAndUpdate(params.id, data, { new: true })

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 })
    }

    return NextResponse.json(hotel)
  } catch (error) {
    console.error("Error updating hotel:", error)
    return NextResponse.json({ error: "Failed to update hotel" }, { status: 500 })
  }
}
