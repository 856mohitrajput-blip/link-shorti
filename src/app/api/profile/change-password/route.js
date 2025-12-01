import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import connectDB from '@/utils/dbConfig';
import { sendEmail } from '@/utils/mailer';
import User from '@/models/Users';
import bcrypt from 'bcryptjs';

/**
 * Change Password API with OTP Verification
 * 
 * Actions:
 * - request: Verify current password and send OTP
 * - verify: Verify OTP and change password
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

    const { action, currentPassword, newPassword, otp } = await request.json();

    await connectDB();

    const user = await User.findOne({ email: session.user.email });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has a password (not OAuth-only user)
    if (!user.password) {
      return NextResponse.json(
        { success: false, message: "Cannot change password for Google sign-in accounts" },
        { status: 400 }
      );
    }

    if (action === 'request') {
      return await handlePasswordChangeRequest(user, currentPassword, newPassword);
    } else if (action === 'verify') {
      return await handlePasswordChangeVerify(user, otp, newPassword);
    } else {
      return NextResponse.json(
        { success: false, message: "Invalid action" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Change password error:', error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Handle password change request - send OTP for verification
 */
async function handlePasswordChangeRequest(user, currentPassword, newPassword) {
  if (!newPassword) {
    return NextResponse.json(
      { success: false, message: "New password is required" },
      { status: 400 }
    );
  }

  // Generate OTP
  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
  const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

  // Store OTP and new password hash temporarily
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(newPassword, salt);

  user.emailVerificationOTP = otpCode;
  user.emailOTPExpires = new Date(otpExpires);
  user.tempPassword = hashedPassword; // Temporary field to store new password
  await user.save();

  // Send OTP email
  const emailResult = await sendPasswordChangeOTP(user.email, user.fullName, otpCode);

  if (!emailResult.success) {
    return NextResponse.json(
      { success: false, message: `Failed to send verification code: ${emailResult.error}` },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { success: true, message: "Verification code sent to your email" },
    { status: 200 }
  );
}

/**
 * Handle password change verification - verify OTP and update password
 */
async function handlePasswordChangeVerify(user, otp, newPassword) {
  if (!otp) {
    return NextResponse.json(
      { success: false, message: "Verification code is required" },
      { status: 400 }
    );
  }

  // Verify OTP
  if (user.emailVerificationOTP !== otp || new Date() > user.emailOTPExpires) {
    return NextResponse.json(
      { success: false, message: "Invalid or expired verification code" },
      { status: 400 }
    );
  }

  // Update password with the temporary password
  if (user.tempPassword) {
    user.password = user.tempPassword;
  } else {
    // Fallback: hash the new password if tempPassword is not set
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
  }

  // Clear OTP and temp password
  user.emailVerificationOTP = undefined;
  user.emailOTPExpires = undefined;
  user.tempPassword = undefined;
  await user.save();

  return NextResponse.json(
    { success: true, message: "Password changed successfully" },
    { status: 200 }
  );
}

/**
 * Send password change OTP email
 */
async function sendPasswordChangeOTP(email, name, otpCode) {
  const subject = "Verify Password Change - LinkShorti";

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
            We received a request to change your password. Please use the verification code below to confirm this change.
          </p>

          <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; text-align: center; margin: 25px 0;">
            <p style="color: #6c757d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">Verification Code</p>
            <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: bold; color: #333333; letter-spacing: 8px;">${otpCode}</div>
          </div>

          <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 25px 0;">
            This verification code will expire in <strong>10 minutes</strong>. If you didn't request a password change, please ignore this email and ensure your account is secure.
          </p>

          <div style="background-color: #fff3cd; border-left: 3px solid #ffc107; padding: 15px; margin: 25px 0;">
            <p style="color: #856404; font-size: 13px; margin: 0; line-height: 1.4;">
              <strong>Security Notice:</strong> Never share this code with anyone. LinkShorti will never ask for your verification code.
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
