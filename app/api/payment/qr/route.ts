import { generateUPIQR } from "@/lib/utils/qr-generator"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { upiId, hotelName, amount, orderId } = await request.json()

    const qrCode = await generateUPIQR(upiId, hotelName, amount || 0, orderId)

    return NextResponse.json({ qrCode })
  } catch (error) {
    console.error("Error generating QR:", error)
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 })
  }
}
