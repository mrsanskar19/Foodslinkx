import { connectDB } from "@/lib/db"
import Hotel from "@/lib/models/Hotel"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Handles GET requests to fetch all verified hotels from the database.
 * - Connects to the database and retrieves a list of hotels where the `verified` flag is `true`.
 * - Returns the list of hotels as a JSON response.
 *
 * @returns {Promise<NextResponse>} A promise that resolves to the Next.js response.
 */
export async function GET() {
  try {
    await connectDB()
    const hotels = await Hotel.find({ verified: true })
    return NextResponse.json(hotels)
  } catch (error) {
    console.error("Error fetching hotels:", error)
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 })
  }
}

/**
 * Handles POST requests to create a new hotel in the database.
 * - Connects to the database and creates a new `Hotel` instance with the provided data.
 * - Saves the new hotel and returns it as a JSON response with a `201` status code.
 *
 * @param {NextRequest} request - The incoming Next.js request object.
 * @returns {Promise<NextResponse>} A promise that resolves to the Next.js response.
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB()
    const data = await request.json()

    const hotel = new Hotel({
      name: data.name,
      address: data.address,
      upiId: data.upiId,
      menu: data.menu || [],
    })

    await hotel.save()
    return NextResponse.json(hotel, { status: 201 })
  } catch (error) {
    console.error("Error creating hotel:", error)
    return NextResponse.json({ error: "Failed to create hotel" }, { status: 500 })
  }
}
