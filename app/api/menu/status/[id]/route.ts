import { connectDB } from "@/lib/db";
import Menu from "@/lib/models/menu";
import { NextResponse } from "next/server";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  try {
    await connectDB();
    const { available } = await request.json();

    if (typeof available !== 'boolean') {
      return NextResponse.json(
        { success: false, error: "INVALID_STATUS", message: "Available status must be boolean" },
        { status: 400 }
      );
    }

    // Check if menu item exists and is not soft-deleted
    const menuItem = await Menu.findOne({ _id: id, deleted_at: { $exists: false } });
    if (!menuItem) {
      return NextResponse.json(
        { success: false, error: "ITEM_NOT_FOUND", message: "Menu item not found" },
        { status: 404 }
      );
    }

    // Update availability
    const updatedMenu = await Menu.findByIdAndUpdate(
      id,
      { available },
      { new: true }
    );

    if (!updatedMenu) {
      return NextResponse.json(
        { success: false, error: "UPDATE_FAILED", message: "Failed to update menu item" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, menuItem: updatedMenu },
      { status: 200 }
    );
  } catch (error: any) {
    const errorId = `MENU_STATUS_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.error(`[${errorId}] Error updating menu item status:`, {
      error: error.message,
      stack: error.stack,
      menuId: id
    });
    return NextResponse.json(
      { success: false, error: "DB_CONSTRAINT", message: "Failed to update menu item status", errorId },
      { status: 500 }
    );
  }
}