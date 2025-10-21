import { NextResponse } from 'next/server';
import connectDB from '@/utils/dbConfig';
import { signIn } from '@/auth';
import { sendEmail } from '@/utils/mailer';
import User from '@/models/Users';
import Statistics from '@/models/Statistics';
import Withdrawal from '@/models/Withdrawal';
import bcrypt from 'bcryptjs';

export async function POST(request) {
  try {
    const { action, name, email, password, otp } = await request.json();

    await connectDB();

    // Handle signup with OTP sending
    if (action === 'signup') {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return NextResponse.json(
          { success: false, message: "Email already exists" },
          { status: 400 }
        );
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Generate OTP
      const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

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
      const newStatistics = new Statistics({
        userEmail: email,
      });
      await newStatistics.save();

      const newWithdrawal = new Withdrawal({
        userEmail: email,
      });
      await newWithdrawal.save();

      // Send OTP email
      const html = `
        <div style="max-width: 700px; margin: auto; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1>LinkShorti</h1>
          </div>

          <p style="font-size: 16px; color: #374151;">Hi <strong>${name}</strong>,</p>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Welcome to LinkShorti! To complete your account setup, please verify your email address using the code below.
          </p>

          <div style="margin: 20px 0; text-align: center;">
            <div style="display: inline-block; padding: 20px 30px; background-color: #f3f4f6; border: 2px dashed #2563eb; border-radius: 12px; font-family: 'Courier New', monospace;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${otpCode}</p>
            </div>
          </div>

          <p style="font-size: 15px; color: #6b7280; line-height: 1.5;">
            This verification code will expire in <strong>10 minutes</strong>. If you didn't create this account, you can safely ignore this email.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />

          <p style="font-size: 13px; text-align: center;">
            Need help? Contact us at <a href="mailto:support@linkshorti.com" style="color: #2563eb; text-decoration: none;">support@linkshorti.com</a>
          </p>

          <p style="font-size: 13px; text-align: center; margin-top: 3px;">
            &copy; ${new Date().getFullYear()} Link Shorti. All rights reserved.
          </p>
        </div>
      `;

      const emailResult = await sendEmail({ 
        to: email, 
        subject: "Verify Your Email - LinkShorti", 
        html 
      });

      if (!emailResult.success) {
        // If email fails, delete the user to prevent orphaned accounts
        await User.findOneAndDelete({ email });
        await Statistics.findOneAndDelete({ userEmail: email });
        await Withdrawal.findOneAndDelete({ userEmail: email });
        
        return NextResponse.json(
          { success: false, message: "Failed to send verification email. Please try again." },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "Account created! Please check your email for verification code." },
        { status: 201 }
      );
    }

    // Handle OTP verification
    if (action === 'verify') {
      const user = await User.findOne({
        email: email,
        emailVerificationOTP: otp,
        emailOTPExpires: { $gt: new Date() },
      });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid or expired verification code" },
          { status: 400 }
        );
      }

      user.isEmailVerified = true;
      user.emailVerificationOTP = undefined;
      user.emailOTPExpires = undefined;
      await user.save();

      return NextResponse.json(
        { success: true, message: "Email verified successfully!" },
        { status: 200 }
      );
    }

    // Handle OTP resend
    if (action === 'resend') {
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
      const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

      user.emailVerificationOTP = otpCode;
      user.emailOTPExpires = new Date(otpExpires);
      await user.save();

      // Send new OTP email
      const html = `
        <div style="max-width: 700px; margin: auto; font-family: 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 30px; border-radius: 10px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1>LinkShorti</h1>
          </div>

          <p style="font-size: 16px; color: #374151;">Hi <strong>${user.fullName}</strong>,</p>

          <p style="font-size: 16px; color: #374151; line-height: 1.6;">
            Here's your new verification code to complete your account setup.
          </p>

          <div style="margin: 20px 0; text-align: center;">
            <div style="display: inline-block; padding: 20px 30px; background-color: #f3f4f6; border: 2px dashed #2563eb; border-radius: 12px; font-family: 'Courier New', monospace;">
              <p style="margin: 0; font-size: 14px; color: #6b7280; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
              <p style="margin: 10px 0 0 0; font-size: 32px; font-weight: bold; color: #2563eb; letter-spacing: 4px;">${otpCode}</p>
            </div>
          </div>

          <p style="font-size: 15px; color: #6b7280; line-height: 1.5;">
            This verification code will expire in <strong>10 minutes</strong>.
          </p>
        </div>
      `;

      const emailResult = await sendEmail({ 
        to: email, 
        subject: "New Verification Code - LinkShorti", 
        html 
      });

      if (!emailResult.success) {
        return NextResponse.json(
          { success: false, message: "Failed to send verification email" },
          { status: 500 }
        );
      }

      return NextResponse.json(
        { success: true, message: "New verification code sent!" },
        { status: 200 }
      );
    }

    // Handle login
    if (action === 'login') {
      const user = await User.findOne({ email });

      if (!user) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);
      if (!isPasswordMatched) {
        return NextResponse.json(
          { success: false, message: "Invalid email or password" },
          { status: 401 }
        );
      }

      if (!user.isEmailVerified) {
        return NextResponse.json(
          { success: false, message: "Please verify your email before logging in" },
          { status: 403 }
        );
      }

      await signIn("credentials", {
        user: JSON.stringify(user),
        redirect: false,
      });

      return NextResponse.json(
        { success: true, message: "Login successful" },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Invalid action" },
      { status: 400 }
    );

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}