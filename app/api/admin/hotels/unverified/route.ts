// app/api/admin/hotels/unverified/route.ts
import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await connectDB();
    const hotels = await Hotel.find({ verified: false });
    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching unverified hotels:", error);
    return NextResponse.json(
      { error: "Failed to fetch unverified hotels" },
      { status: 500 }
    );
  }
}
