import { connectDB } from "@/lib/db"
import Order from "@/lib/models/Order"
import { type NextRequest, NextResponse } from "next/server"

export async function PATCH(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB()
    const order = await Order.findByIdAndUpdate(params.id, { status: "paid" }, { new: true })

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 })
    }

    return NextResponse.json(order)
  } catch (error) {
    console.error("Error marking order as paid:", error)
    return NextResponse.json({ error: "Failed to mark order as paid" }, { status: 500 })
  }
}
