
import { connectDB } from "@/lib/db";
import Hotel from "@/lib/models/Hotel";
import Menu from "@/lib/models/menu";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string, menuId: string }> }) {
  try {
    await connectDB();
    const { id: hotelId, menuId } = await params;

    // const hotel = await Hotel.findById(hotelId);
    // if (!hotel) {
    //   return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    // }

    // if (!hotel.menu.includes(menuId)) {
    //   return NextResponse.json({ error: "Menu item not found in this hotel" }, { status: 404 });
    // }

    const menuItem = await Menu.findOne({_id: menuId, deleted_at: { $exists: false }});

    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(menuItem);
  } catch (error) {
    console.error("Error fetching menu item:", error);
    return NextResponse.json({ error: "Failed to fetch menu item" }, { status: 500 });
  }
}


export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string, menuId: string }> }) {
  try {
    await connectDB();
    const { id: hotelId, menuId } = await params;
    const data = await request.json();

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    const menuItem = await Menu.findOne({ _id: menuId, hotelId, deleted_at: { $exists: false } });
    if (!menuItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(menuId, data, { new: true });

    if (!updatedMenu) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedMenu);
  } catch (error) {
    console.error("Error updating menu item:", error);
    return NextResponse.json({ error: "Failed to update menu item" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string, menuId: string }> }) {
  try {
    await connectDB();
    const { id: hotelId, menuId } = await params;
    const { available } = await request.json();

    if (typeof available !== 'boolean') {
      return NextResponse.json({ error: "Invalid 'available' status" }, { status: 400 });
    }

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    // First try to update in Menu collection
    const menuItem = await Menu.findOne({ _id: menuId, hotelId, deleted_at: { $exists: false } });
    if (menuItem) {
      const updatedMenu = await Menu.findByIdAndUpdate(menuId, { available }, { new: true });
      if (!updatedMenu) {
        return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
      }
      return NextResponse.json(updatedMenu);
    }

    // If not in Menu collection, try to update in hotel.menu array
    const updatedHotel = await Hotel.findOneAndUpdate(
      { _id: hotelId, 'menu._id': menuId },
      { $set: { 'menu.$.available': available } },
      { new: true }
    );

    if (!updatedHotel) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    // Return the updated menu item from hotel.menu
    const updatedItem = updatedHotel.menu.find((item: any) => item._id.toString() === menuId);
    if (!updatedItem) {
      return NextResponse.json({ error: "Menu item not found" }, { status: 404 });
    }

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating menu item availability:", error);
    return NextResponse.json({ error: "Failed to update menu item availability" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string, menuId: string }> }) {
  const { id: hotelId, menuId } = await params;
  const connection = await connectDB();
  const session = await connection.startSession();
  session.startTransaction();

  try {

    const hotel = await Hotel.findById(hotelId).session(session);
    if (!hotel) {
      await session.abortTransaction();
      return NextResponse.json({ success: false, error: "ITEM_NOT_FOUND", message: "Hotel not found" }, { status: 404 });
    }

    // Check if menu item exists in Menu collection and is not soft-deleted
    const menuItem = await Menu.findOne({ _id: menuId, hotelId, deleted_at: { $exists: false } }).session(session);
    if (!menuItem) {
      await session.abortTransaction();
      return NextResponse.json({ success: false, error: "ITEM_NOT_FOUND", message: "Menu item not found" }, { status: 404 });
    }

    // Check for active orders containing this menu item
    const Order = (await import("@/lib/models/Order")).default;
    const activeOrders = await Order.find({
      "items.menuItemId": menuId,
      status: { $in: ["pending", "cooking", "served"] }
    }).session(session);

    if (activeOrders.length > 0) {
      await session.abortTransaction();
      return NextResponse.json(
        { success: false, error: "CONFLICT", message: "Cannot delete item with active orders" },
        { status: 409 }
      );
    }

    // Soft delete the menu item
    await Menu.findByIdAndUpdate(menuId, { deleted_at: new Date() }, { session });

    // Remove from hotel's menu array if it exists there
    if (hotel.menu.includes(menuId)) {
      await Hotel.findByIdAndUpdate(hotelId, { $pull: { menu: menuId } }, { session });
    }

    await session.commitTransaction();
    return NextResponse.json({ success: true, message: "Menu item deleted successfully" });
  } catch (error: any) {
    await session.abortTransaction();
    console.error("Error deleting menu item:", error);
    return NextResponse.json(
      { success: false, error: "DB_CONSTRAINT", message: "Failed to delete menu item" },
      { status: 500 }
    );
  } finally {
    session.endSession();
  }
}
