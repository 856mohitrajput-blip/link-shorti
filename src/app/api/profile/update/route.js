import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/utils/dbConfig';
import User from '@/models/Users';

/**
 * Update Profile API
 * Updates user's profile information (name)
 */
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const { fullName } = await request.json();

    if (!fullName || fullName.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Full name is required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.fullName = fullName.trim();
    await user.save();

    return NextResponse.json(
      { 
        success: true, 
        message: "Profile updated successfully",
        user: {
          fullName: user.fullName,
          email: user.email
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
