
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Hotel from '@/lib/models/Hotel';

export async function POST(request: Request) {
  await connectDB();

  try {
    const { hotelName, address, upiId, plan, username, email, phone, password } = await request.json();

    // Basic validation
    if (!hotelName || !address || !upiId || !plan || !username || !email || !phone || !password) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Check if the hotel already exists
    const existingHotel = await Hotel.findOne({ name: hotelName });
    if (existingHotel) {
      return NextResponse.json({ message: 'Hotel with this name already exists.' }, { status: 409 });
    }

    // Check if the username or email already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return NextResponse.json({ message: 'Username or email already exists.' }, { status: 409 });
    }

    // Hash the password
    const passwordHash = await bcrypt.hash(password, 10);

    // Create a new hotel
    const newHotel = new Hotel({
      name: hotelName,
      address,
      upiId,
      plan,
      verified: false, // Default to not verified
    });
    await newHotel.save();

    // Create a new user
    const newUser = new User({
      username,
      email,
      phone,
      passwordHash,
      hotelId: newHotel._id,
      role: 'hotel',
    });
    await newUser.save();

    return NextResponse.json({ message: 'User and hotel created successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user and hotel:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}
