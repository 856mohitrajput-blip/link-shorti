import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import User from '@/models/Users';
import Statistics from '@/models/Statistics';
import Withdrawal from '@/models/Withdrawal';

export async function POST(request) {
  try {
    const { email, name, image, googleId } = await request.json();

    await connectDB();

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      // User exists, update Google ID if not set
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
    } else {
      // Create new user for Google OAuth
      const newUser = new User({
        fullName: name,
        email,
        googleId,
        profileImage: image,
        isEmailVerified: true, // Google accounts are pre-verified
        password: null // No password for OAuth users
      });

      await newUser.save();

      // Create associated records
      const newStatistics = new Statistics({
        userEmail: email,
      });
      await newStatistics.save();

      const newWithdrawal = new Withdrawal({
        userEmail: email,
      });
      await newWithdrawal.save();

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
    }
  } catch (error) {
    console.error('Google OAuth API error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}