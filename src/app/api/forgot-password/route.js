import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import { sendEmail } from '@/utils/mailer';
import User from '@/models/Users';
import bcrypt from 'bcryptjs';

/**
 * Forgot Password API Handler
 * 
 * Handles password reset flow:
 * - request: Send OTP to user's email
 * - verify: Verify OTP code
 * - reset: Reset password with new password
 */
export async function POST(request) {
  try {
    const { action, email, otp, newPassword } = await request.json();

    await connectDB();

    switch (action) {
      case 'request':
        return await handlePasswordResetRequest(email);
      case 'verify':
        return await handleVerifyResetOTP(email, otp);
      case 'reset':
        return await handlePasswordReset(email, otp, newPassword);
      default:
        return NextResponse.json(
          { success: false, message: "Invalid action" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error('Forgot password API error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle password reset request - send OTP
 */
async function handlePasswordResetRequest(email) {
  if (!email) {
    return NextResponse.json(
      { success: false, message: "Email is required" },
      { status: 400 }
    );
  }

  const user = await User.findOne({ email });

  if (!user) {
    // Don't reveal if user exists or not for security
    return NextResponse.json(
      { success: true, message: "If an account exists with this email, you will receive a password reset code." },
      { status: 200 }
    );
  }

  // Don't allow password reset for OAuth-only users
  if (!user.password) {
    return NextResponse.json(
      { success: false, message: "This account uses Google sign-in. Please sign in with Google." },
      { status: 400 }
    );
  }

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP in user document (reusing email verification fields)
  user.emailVerificationOTP = otpCode;
  user.emailOTPExpires = new Date(otpExpires);
  await user.save();

  // Send reset email
  const emailResult = await sendPasswordResetEmail(email, user.fullName, otpCode);

  if (!emailResult.success) {
    return NextResponse.json(
      { success: false, message: `Failed to send reset email: ${emailResult.error}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Password reset code sent to your email!" },
    { status: 200 }
  );
}

/**
 * Handle OTP verification for password reset
 */
async function handleVerifyResetOTP(email, otp) {
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
      { success: false, message: "Invalid or expired reset code" },
      { status: 400 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Code verified! You can now reset your password." },
    { status: 200 }
  );
}

/**
 * Handle password reset with new password
 */
async function handlePasswordReset(email, otp, newPassword) {
  if (!email || !otp || !newPassword) {
    return NextResponse.json(
      { success: false, message: "Email, OTP, and new password are required" },
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
      { success: false, message: "Invalid or expired reset code" },
      { status: 400 }
    );
  }

  // Hash new password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  // Update password and clear OTP
  user.password = hashedPassword;
  user.emailVerificationOTP = undefined;
  user.emailOTPExpires = undefined;
  await user.save();

  return NextResponse.json(
    { success: true, message: "Password reset successfully! You can now login with your new password." },
    { status: 200 }
  );
}

/**
 * Send password reset email
 */
async function sendPasswordResetEmail(email, name, otpCode) {
  const subject = "Reset Your Password - LinkShorti";

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
            We received a request to reset your password. Use the code below to reset your password.
          </p>

          <div style="background-color: #fff3cd; border: 1px solid #ffc107; border-radius: 6px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="color: #856404; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Password Reset Code</p>
            <div style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #333333; letter-spacing: 4px;">${otpCode}</div>
          </div>

          <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 25px 0;">
            This reset code will expire in <strong>10 minutes</strong>. If you didn't request a password reset, please ignore this email or contact support if you have concerns.
          </p>

          <div style="background-color: #fff3cd; border-left: 3px solid #ffc107; padding: 15px; margin: 25px 0;">
            <p style="color: #856404; font-size: 13px; margin: 0; line-height: 1.4;">
              <strong>Security tip:</strong> Never share this code with anyone. LinkShorti will never ask for your password or reset code.
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
