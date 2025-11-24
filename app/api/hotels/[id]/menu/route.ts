import { connectDB } from "@/lib/db";
import Menu from "@/lib/models/menu";
import Hotel from "@/lib/models/Hotel";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id: hotelId } = await params;

    // First try to fetch from the new Menu collection
    const menuItems = await Menu.find({
      hotelId,
      deleted_at: { $exists: false }
    }).populate('category').sort({ createdAt: -1 });

    // If we have items in the Menu collection, return them
    if (menuItems && menuItems.length > 0) {
      // Ensure available field is set (default to true if not set)
      const processedMenuItems = menuItems.map(item => ({
        ...item.toObject(),
        image: item.imageUrl || item.imageFileUrl, // Use imageUrl or imageFileUrl as image
        available: item.available !== false // Default to true if undefined or true
      }));
      return NextResponse.json({ menu: processedMenuItems });
    }

    // Fallback: If no items in Menu collection, try the embedded hotel menu
    const hotel = await Hotel.findById(hotelId);
    if (hotel && hotel.menu && hotel.menu.length > 0) {
      // Transform embedded menu items to match the expected format
      const transformedMenu = hotel.menu.map((item: any) => ({
        _id: item._id,
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category, // This might be a string ID
        available: item.available !== false, // Default to true if not set
        image: item.image,
        imageUrl: item.image,
        imageFileUrl: undefined,
        linkTarget: undefined,
        hotelId: hotelId,
        createdAt: item.createdAt || new Date(),
        updatedAt: item.updatedAt || new Date()
      }));

      return NextResponse.json({ menu: transformedMenu });
    }

    // If no menu items found anywhere, return empty array
    return NextResponse.json({ menu: [] });
  } catch (error: any) {
    console.error("Error fetching menu items:", error);
    return NextResponse.json(
      { error: "Failed to fetch menu items" },
      { status: 500 }
    );
  }
}