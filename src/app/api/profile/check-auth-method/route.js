import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/utils/dbConfig';
import User from '@/models/Users';

/**
 * Check Auth Method API
 * Checks if user signed up with Google or email/password
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
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

    // User is Google-only if they have no password
    const isGoogleUser = !user.password;

    return NextResponse.json(
      { success: true, isGoogleUser },
      { status: 200 }
    );
  } catch (error) {
    console.error('Check auth method error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
