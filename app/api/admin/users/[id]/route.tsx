// app/api/admin/users/[id]/route.ts

import { NextResponse } from 'next/server';
import User from '@/lib/models/User';
import { connectDB } from '@/lib/db';

export async function GET(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = params;

    // Fetch user and populate hotel details, exclude passwordHash
    const user = await User.findById(id).select('-passwordHash').populate('hotelId', 'name');

    if (!user) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    return NextResponse.json({ message: 'User deleted successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await connectDB();

  try {
    const { id } = params;
    const updateData = await request.json();

    // If updating password, hash it first
    if (updateData.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.passwordHash = await bcrypt.hash(updateData.password, salt);
      delete updateData.password; // Remove plain password
    }

    // Optional: Validate if the new hotelId is a valid hotel
    if (updateData.hotelId) {
        const hotel = await Hotel.findById(updateData.hotelId);
        if (!hotel) {
          return NextResponse.json({ message: 'Hotel not found.' }, { status: 404 });
        }
    }

    const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedUser) {
      return NextResponse.json({ message: 'User not found.' }, { status: 404 });
    }

    // Exclude passwordHash from the response
    const userWithoutPassword = updatedUser.toObject();
    delete userWithoutPassword.passwordHash;

    return NextResponse.json({ message: 'User updated successfully.', user: userWithoutPassword }, { status: 200 });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Internal server error.' }, { status: 500 });
  }
}