import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import { signIn } from '@/auth';
import { sendEmail } from '@/utils/mailer';
import User from '@/models/Users';
import Statistics from '@/models/Statistics';
import Withdrawal from '@/models/Withdrawal';
import bcrypt from 'bcryptjs';

/**
 * Authentication API Handler
 * 
 * Handles multiple authentication actions:
 * - signup: Create new account with email verification
 * - verify: Verify email with OTP
 * - resend: Resend verification OTP
 * - login: Authenticate user
 */
export async function POST(request) {
  try {
    const { action, name, email, password, otp } = await request.json();

    await connectDB();

    switch (action) {
      case 'signup':
        return await handleSignup(name, email, password);
      case 'verify':
        return await handleVerifyOTP(email, otp);
      case 'resend':
        return await handleResendOTP(email);
      case 'login':
        return await handleLogin(email, password);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Auth API error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle user signup
 */
async function handleSignup(name, email, password) {
  // Validate input
  if (!name || !email || !password) {
    return NextResponse.json(
      { success: false, message: "All fields are required" },
      { status: 400 }
    );
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { success: false, message: "Email already exists" },
      { status: 400 }
    );
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Create user
  const newUser = new User({
    fullName: name,
    email,
    password: hashedPassword,
    emailVerificationOTP: otpCode,
    emailOTPExpires: new Date(otpExpires),
    isEmailVerified: false
  });

  await newUser.save();

  // Create associated records
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
    // Rollback user creation
    await User.findOneAndDelete({ email });
    throw recordError;
  }

  // Send verification email
  const emailResult = await sendVerificationEmail(email, name, otpCode);

  if (!emailResult.success) {
    // Rollback everything if email fails
    await Promise.all([
      User.findOneAndDelete({ email }),
      Statistics.findOneAndDelete({ userEmail: email }),
      Withdrawal.findOneAndDelete({ userEmail: email })
    ]);

    return NextResponse.json(
      { success: false, message: `Failed to send verification email: ${emailResult.error}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Account created! Please check your email for verification code." },
    { status: 201 }
  );
}

/**
 * Handle OTP verification
 */
async function handleVerifyOTP(email, otp) {
  if (!email || !otp) {
    return NextResponse.json(
      { success: false, message: "Email and OTP are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({
    email,
    emailVerificationOTP: otp,
    emailOTPExpires: { $gt: new Date() }
  });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired verification code" },
      { status: 400 }
    );
  }

  // Mark email as verified
  user.isEmailVerified = true;
  user.emailVerificationOTP = undefined;
  user.emailOTPExpires = undefined;
  await user.save();

  return NextResponse.json(
    { success: true, message: "Email verified successfully!" },
    { status: 200 }
  );
}

/**
 * Handle OTP resend
 */
async function handleResendOTP(email) {
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "User not found" },
      { status: 404 }
    );
  }

  if (user.isEmailVerified) {
    return NextResponse.json(
      { success: false, message: "Email is already verified" },
      { status: 400 }
    );
  }

  // Generate new OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000;

  user.emailVerificationOTP = otpCode;
  user.emailOTPExpires = new Date(otpExpires);
  await user.save();

  // Send new OTP email
  const emailResult = await sendVerificationEmail(email, user.fullName, otpCode, true);

  if (!emailResult.success) {
    return NextResponse.json(
      { success: false, message: `Failed to send verification email: ${emailResult.error}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "New verification code sent!" },
    { status: 200 }
  );
}

/**
 * Handle user login
 */
async function handleLogin(email, password) {
  if (!email || !password) {
    return NextResponse.json(
      { success: false, message: "Email and password are required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Check password
  const isPasswordMatched = await bcrypt.compare(password, user.password);
  if (!isPasswordMatched) {
    return NextResponse.json(
      { success: false, message: "Invalid email or password" },
      { status: 401 }
    );
  }

  // Check email verification
  if (!user.isEmailVerified) {
    return NextResponse.json(
      { success: false, message: "Please verify your email before logging in" },
      { status: 403 }
    );
  }

  // Check if user is blocked
  if (user.isBlocked) {
    return NextResponse.json(
      { success: false, message: "Your account has been blocked. Please contact support." },
      { status: 403 }
    );
  }

  // Sign in with NextAuth
  await signIn("credentials", {
    user: JSON.stringify(user),
    redirect: false,
  });

  return NextResponse.json(
    { success: true, message: "Login successful" },
    { status: 200 }
  );
}

/**
 * Send verification email
 */
async function sendVerificationEmail(email, name, otpCode, isResend = false) {
  const subject = isResend ? "New Verification Code - LinkShorti" : "Verify Your Email - LinkShorti";
  const title = isResend ? "New Verification Code" : "Verify Your Email";
  const message = isResend 
    ? "Here's your new verification code to complete your account setup."
    : "Welcome to LinkShorti! To complete your account setup, please verify your email address using the verification code below.";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
      <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
          <h1 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0;">LinkShorti</h1>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <h2 style="color: #333333; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">Hi ${name},</h2>
          
          <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
            ${message}
          </p>

          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="color: #6c757d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Verification Code</p>
            <div style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #333333; letter-spacing: 4px;">${otpCode}</div>
          </div>

          <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 25px 0;">
            This verification code will expire in <strong>10 minutes</strong>. If you didn't create this account, you can safely ignore this email.
          </p>

          <div style="background-color: #f8f9fa; border-left: 3px solid #007bff; padding: 15px; margin: 25px 0;">
            <p style="color: #495057; font-size: 13px; margin: 0; line-height: 1.4;">
              <strong>Need help?</strong> If you're having trouble with verification, please contact our support team.
            </p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f8f9fa; padding: 20px; text-align: center; border-top: 1px solid #e5e5e5;">
          <p style="color: #6c757d; font-size: 12px; margin: 0 0 10px 0;">
            <a href="mailto:support@linkshorti.com" style="color: #007bff; text-decoration: none;">support@linkshorti.com</a>
          </p>
          
          <p style="color: #adb5bd; font-size: 11px; margin: 0; line-height: 1.4;">
            © ${new Date().getFullYear()} LinkShorti. All rights reserved.<br>
            This email was sent to ${email}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  return await sendEmail({ to: email, subject, html });
}
