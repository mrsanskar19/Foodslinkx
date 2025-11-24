import { NextResponse } from "next/server"
import { connectDB } from '@/lib/db'
import Hotel from "@/lib/models/Hotel"

// Utility: Haversine formula to calculate distance (in meters)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371000 // Earth radius in meters
  const toRad = (deg: number) => (deg * Math.PI) / 180

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

// POST /api/verify-location
export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { latitude, longitude, tableId } = body

    if (!latitude || !longitude || !tableId) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    await connectDB();
    const hotel = await Hotel.findOne({ "tables.number": tableId });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found for the given table ID" }, { status: 404 });
    }

    const distance = calculateDistance(
      hotel.latitude,
      hotel.longitude,
      latitude,
      longitude
    )

    const isWithinRange = distance <= hotel.locationVerificationRadius;

    return NextResponse.json({
      isCorrectLocation: isWithinRange,
    })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
