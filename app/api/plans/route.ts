import { connectDB } from "@/lib/db"
import Plan from "@/lib/models/Plan"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    await connectDB()
    const plans = await Plan.find()
    return NextResponse.json(plans)
  } catch (error) {
    console.error("Error fetching plans:", error)
    return NextResponse.json({ error: "Failed to fetch plans" }, { status: 500 })
  }
}
