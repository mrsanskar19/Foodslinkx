import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import { verifyToken, getAuthCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {

    await connectDB();
    const hotels = await Hotel.find({}).sort({ createdAt: -1 });

    return NextResponse.json({ hotels });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch hotels" }, { status: 500 });
  }
}
