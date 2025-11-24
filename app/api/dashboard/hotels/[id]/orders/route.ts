import { connectDB } from "@/lib/db"
import Order from "@/lib/models/Order"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const orders = await Order.find({ hotelId: id }).sort({ createdAt: -1 })
    return NextResponse.json(orders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()
    const { id } = await params
    const body = await request.json()
    const { items, table = "Counter" } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "Items are required" }, { status: 400 })
    }

    const total = items.reduce((sum: number, item: { price: number; quantity: number }) => sum + (item.price * item.quantity), 0)

    const newOrder = new Order({
      hotelId: id,
      table,
      deviceId: "dashboard", // or generate a unique one
      items,
      total,
      status: "pending"
    })

    await newOrder.save()
    return NextResponse.json(newOrder, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 })
  }
}
