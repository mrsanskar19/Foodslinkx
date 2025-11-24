import { connectDB } from "@/lib/db"
import Hotel from "@/lib/models/Hotel"
import Order from "@/lib/models/Order"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()

    const totalHotels = await Hotel.countDocuments()
    const verifiedHotels = await Hotel.countDocuments({ verified: true })
    const totalOrders = await Order.countDocuments()
    const paidOrders = await Order.find({ status: "paid" })
    const totalRevenue = paidOrders.reduce((sum, order) => sum + order.total, 0)

    return NextResponse.json({
      totalHotels,
      verifiedHotels,
      totalOrders,
      totalRevenue,
    })
  } catch (error) {
    console.error("Error fetching stats:", error)
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 })
  }
}
