import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import User from '@/models/Users';

/**
 * Admin Block/Unblock User API
 * Block or unblock a user (admin only)
 * Note: Authentication is handled client-side via sessionStorage
 */
export async function POST(request) {
  try {
    const { userId, action, reason } = await request.json();

    if (!userId || !action) {
      return NextResponse.json(
        { success: false, message: "User ID and action are required" },
        { status: 400 }
      );
    }

    if (action !== 'block' && action !== 'unblock') {
      return NextResponse.json(
        { success: false, message: "Invalid action. Must be 'block' or 'unblock'" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find the target user
    const targetUser = await User.findById(userId);
    if (!targetUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent blocking other admins
    if (targetUser.isAdmin && action === 'block') {
      return NextResponse.json(
        { success: false, message: "Cannot block admin users" },
        { status: 400 }
      );
    }

    // Update user block status
    if (action === 'block') {
      targetUser.isBlocked = true;
      targetUser.blockedAt = new Date();
      targetUser.blockedReason = reason || 'No reason provided';
    } else {
      targetUser.isBlocked = false;
      targetUser.blockedAt = null;
      targetUser.blockedReason = null;
    }

    await targetUser.save();

    return NextResponse.json(
      { 
        success: true, 
        message: `User ${action === 'block' ? 'blocked' : 'unblocked'} successfully`,
        user: {
          _id: targetUser._id,
          fullName: targetUser.fullName,
          email: targetUser.email,
          isBlocked: targetUser.isBlocked,
          blockedAt: targetUser.blockedAt,
          blockedReason: targetUser.blockedReason
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin block user error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
