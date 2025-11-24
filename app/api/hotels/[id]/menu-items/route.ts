import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const {
      hotelId,
      name,
      description,
      price,
      category,
      available,
      image,
    } = await request.json();

    if (!hotelId || !name || !price || !category) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const hotel = await Hotel.findById(hotelId);

    if (!hotel) {
      return NextResponse.json({ message: "Hotel not found" }, { status: 404 });
    }

    // This endpoint seems to be for embedded menu, but we should use the new /api/menu/add
    // For now, keeping it but it should be deprecated
    hotel.menu.push({
      name,
      description,
      price,
      category,
      available,
      image,
    });

    await hotel.save();
    return NextResponse.json(hotel.menu[hotel.menu.length - 1], { status: 201 });
  } catch (error) {
    console.error("Error adding menu item:", error);
    return NextResponse.json({ message: "Failed to add menu item" }, { status: 500 });
  }
}
