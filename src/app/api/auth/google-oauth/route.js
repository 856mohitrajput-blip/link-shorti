import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import User from '@/models/Users';
import Statistics from '@/models/Statistics';
import Withdrawal from '@/models/Withdrawal';

/**
 * Google OAuth Handler
 * 
 * This endpoint is called by NextAuth during Google sign-in
 * It creates or updates user accounts and associated records
 */
export async function POST(request) {
  try {
    const { email, name, image, googleId } = await request.json();

    // Validate required fields
    if (!email || !name || !googleId) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Check if user is blocked
      if (user.isBlocked) {
        return NextResponse.json(
          { success: false, message: "Your account has been blocked. Please contact support." },
          { status: 403 }
        );
      }

      // Existing user - update Google info if needed
      if (!user.googleId) {
        user.googleId = googleId;
        user.profileImage = image;
        await user.save();
      }

      return NextResponse.json({
        success: true,
        user: {
          _id: user._id.toString(),
          fullName: user.fullName,
          email: user.email,
          isEmailVerified: user.isEmailVerified,
          profileImage: user.profileImage
        }
      });
    }

    // New user - create account
    const newUser = new User({
      fullName: name,
      email,
      googleId,
      profileImage: image,
      isEmailVerified: true, // Google accounts are pre-verified
      password: null // No password for OAuth users
    });

    await newUser.save();

    // Create associated records (Statistics and Withdrawal)
    try {
      await Promise.all([
        Statistics.findOneAndUpdate(
          { userEmail: email },
          { userEmail: email },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        ),
        Withdrawal.findOneAndUpdate(
          { userEmail: email },
          { userEmail: email },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        )
      ]);
    } catch (recordError) {
      // Rollback user creation if associated records fail
      await User.findByIdAndDelete(newUser._id);
      throw recordError;
    }

    return NextResponse.json({
      success: true,
      user: {
        _id: newUser._id.toString(),
        fullName: newUser.fullName,
        email: newUser.email,
        isEmailVerified: newUser.isEmailVerified,
        profileImage: newUser.profileImage
      }
    });

  } catch (error) {
    console.error('Google OAuth error:', error);

    // Handle duplicate key errors
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: "Account already exists" },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
