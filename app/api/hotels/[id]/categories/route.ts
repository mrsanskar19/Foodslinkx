import { connectDB } from "@/lib/db";
import Category from "@/lib/models/Category";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    await connectDB();
    const { name, hotelId } = await request.json();

    if (!name || !hotelId) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const newCategory = new Category({
      name,
      hotelId,
    });

    await newCategory.save();
    return NextResponse.json(newCategory, { status: 201 });
  } catch (error) {
    console.error("Error creating category:", error);
    return NextResponse.json({ message: "Failed to create category" }, { status: 500 });
  }
}

export async function GET() {
  try {
    await connectDB();
    const categories = await Category.find();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ message: "Failed to fetch categories" }, { status: 500 });
  }
}
