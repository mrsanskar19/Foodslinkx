import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/User';
import Hotel from '@/lib/models/Hotel';

export async function POST(request: Request) {
  await connectDB(); // Connect to your database

  try {
    const { username, password, hotelId, role } = await request.json();

    // Basic validation
    if (!username || !password || !role) {
      return NextResponse.json({ message: 'Missing required fields.' }, { status: 400 });
    }

    // Validate role
    if (role !== 'hotel' && role !== 'admin') {
      return NextResponse.json({ message: 'Invalid role. Must be "hotel" or "admin".' }, { status: 400 });
    }

    // Check if the username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return NextResponse.json({ message: 'Username already exists.' }, { status: 409 });
    }

    // For hotel role, validate hotelId
    let validatedHotelId = null;
    if (role === 'hotel') {
      if (!hotelId) {
        return NextResponse.json({ message: 'hotelId is required for hotel role.' }, { status: 400 });
      }
      const hotel = await Hotel.findById(hotelId);
      if (!hotel) {
        return NextResponse.json({ message: 'Hotel not found.' }, { status: 404 });
      }
      validatedHotelId = hotelId;
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Create the new user
    const newUser = new User({
      username,
      passwordHash,
      role,
      hotelId: validatedHotelId,
    });

    await newUser.save();

    return NextResponse.json({ message: 'User created successfully.' }, { status: 201 });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

// API Route GET Users with role 'hotel'
export async function GET() {
  await connectDB();

  try {
    // Select all hotel users, exclude passwordHash field
    const users = await User.find({ role: 'hotel' }).select('-passwordHash');
    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: `Internal server error.${error}` }, { status: 500 });
  }
}

