import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import User from '@/models/Users';

/**
 * Admin Users API
 * Get all users (admin only)
 * Note: Authentication is handled client-side via sessionStorage
 */
export async function GET() {
  try {
    await connectDB();

    // Fetch all users with selected fields
    const users = await User.find({})
      .select('fullName email isEmailVerified isBlocked isAdmin googleId createdAt blockedAt blockedReason')
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { success: true, users },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin users fetch error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
