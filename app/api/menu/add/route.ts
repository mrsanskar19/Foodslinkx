import { connectDB } from "@/lib/db";
import Menu from "@/lib/models/menu";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const formData = await request.formData();

    const hotelId = formData.get('hotelId') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = parseFloat(formData.get('price') as string);
    const category = formData.get('category') as string;
    const available = formData.get('available') === 'true';
    const imageUrl = formData.get('imageUrl') as string;
    const linkTarget = formData.get('linkTarget') as string;
    const imageFile = formData.get('imageFile') as File;

    // Validate required fields
    if (!hotelId || !name || !price || !category) {
      return NextResponse.json(
        { success: false, error: "ITEM_NOT_FOUND", message: "Missing required fields" },
        { status: 400 }
      );
    }

    let imageFileUrl = '';

    // Handle file upload
    if (imageFile) {
      // Validate file type
      if (!imageFile.type.startsWith('image/')) {
        return NextResponse.json(
          { success: false, error: "INVALID_FILE", message: "File must be an image" },
          { status: 400 }
        );
      }

      // Validate file size (5MB)
      if (imageFile.size > 5 * 1024 * 1024) {
        return NextResponse.json(
          { success: false, error: "FILE_TOO_LARGE", message: "Image must be less than 5MB" },
          { status: 400 }
        );
      }

      // In a real app, you'd upload to cloud storage like AWS S3
      // For now, we'll simulate by creating a data URL
      const buffer = await imageFile.arrayBuffer();
      const base64 = Buffer.from(buffer).toString('base64');
      imageFileUrl = `data:${imageFile.type};base64,${base64}`;
    }

    const newMenuItem = new Menu({
      name,
      description,
      price,
      category,
      available,
      imageUrl: imageUrl || '',
      imageFileUrl,
      linkTarget: linkTarget || '',
      hotelId,
    });

    await newMenuItem.save();
    return NextResponse.json(
      { success: true, menuItem: newMenuItem },
      { status: 201 }
    );
  } catch (error: any) {
    const errorId = `MENU_ADD_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    console.error(`[${errorId}] Error adding menu item:`, {
      error: error.message,
      stack: error.stack,
      hotelId,
      name,
      price
    });
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, error: "DB_CONSTRAINT", message: "Duplicate menu item", errorId },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { success: false, error: "DB_CONSTRAINT", message: "Failed to add menu item", errorId },
      { status: 500 }
    );
  }
}