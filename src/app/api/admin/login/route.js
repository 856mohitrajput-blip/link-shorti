import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import Admin from '@/models/Admin';
import bcrypt from 'bcryptjs';

const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 15 * 60 * 1000; // 15 minutes

/**
 * Admin Login API
 * Authenticates admin users with phone number and password
 * Returns a session token for the current session only (no persistent cookies)
 */
export async function POST(request) {
  try {
    const { phoneNumber, password } = await request.json();

    if (!phoneNumber || !password) {
      return NextResponse.json(
        { success: false, message: "Phone number and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // Find admin by phone number
    const admin = await Admin.findOne({ phoneNumber });

    if (!admin) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Check if account is locked
    if (admin.lockedUntil && admin.lockedUntil > new Date()) {
      const remainingTime = Math.ceil((admin.lockedUntil - new Date()) / 60000);
      return NextResponse.json(
        { success: false, message: `Account locked. Try again in ${remainingTime} minutes.` },
        { status: 423 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      // Increment login attempts
      admin.loginAttempts += 1;

      // Lock account if max attempts reached
      if (admin.loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        admin.lockedUntil = new Date(Date.now() + LOCK_TIME);
        await admin.save();
        return NextResponse.json(
          { success: false, message: "Too many failed attempts. Account locked for 15 minutes." },
          { status: 423 }
        );
      }

      await admin.save();
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Reset login attempts on successful login
    admin.loginAttempts = 0;
    admin.lockedUntil = null;
    admin.lastLogin = new Date();
    await admin.save();

    // Return success with admin info (no cookies - session only)
    return NextResponse.json(
      { 
        success: true, 
        message: "Login successful",
        admin: {
          name: admin.name,
          phoneNumber: admin.phoneNumber,
        }
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Admin login error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
