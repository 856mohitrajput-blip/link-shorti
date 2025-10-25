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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - LinkShorti</title>
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
                Welcome to LinkShorti! To complete your account setup, please verify your email address using the verification code below.
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

          <!-- Mobile Responsive -->
          <style>
            @media only screen and (max-width: 600px) {
              .email-container {
                margin: 10px !important;
              }
              .email-content {
                padding: 20px 15px !important;
              }
              .verification-code {
                font-size: 20px !important;
                letter-spacing: 2px !important;
              }
            }
          </style>
        </body>
        </html>
      `;

      const emailResult = await sendEmail({ 
        to: email, 
        subject: "Verify Your Email - LinkShorti", 
        html 
      });

      if (!emailResult.success) {
        console.error('Email sending failed during signup:', emailResult.error);
        // If email fails, delete the user to prevent orphaned accounts
        await User.findOneAndDelete({ email });
        await Statistics.findOneAndDelete({ userEmail: email });
        await Withdrawal.findOneAndDelete({ userEmail: email });
        
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
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Verification Code - LinkShorti</title>
        </head>
        <body style="margin: 0; padding: 0; background-color: #f5f5f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
          <div style="max-width: 600px; margin: 20px auto; background: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <div style="background-color: #ffffff; padding: 30px 20px; text-align: center; border-bottom: 1px solid #e5e5e5;">
              <h1 style="color: #333333; font-size: 24px; font-weight: 600; margin: 0;">LinkShorti</h1>
            </div>

            <!-- Content -->
            <div style="padding: 30px 20px;">
              <h2 style="color: #333333; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">Hi ${user.fullName},</h2>
              
              <p style="color: #666666; font-size: 14px; line-height: 1.6; margin: 0 0 25px 0;">
                Here's your new verification code to complete your account setup.
              </p>

              <div style="background-color: #f8f9fa; border: 1px solid #e9ecef; border-radius: 6px; padding: 20px; text-align: center; margin: 25px 0;">
                <p style="color: #6c757d; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 10px 0;">New Verification Code</p>
                <div style="font-family: 'Courier New', monospace; font-size: 24px; font-weight: bold; color: #333333; letter-spacing: 4px;">${otpCode}</div>
              </div>

              <p style="color: #666666; font-size: 13px; line-height: 1.5; margin: 25px 0;">
                This verification code will expire in <strong>10 minutes</strong>.
              </p>

              <div style="background-color: #f8f9fa; border-left: 3px solid #28a745; padding: 15px; margin: 25px 0;">
                <p style="color: #495057; font-size: 13px; margin: 0; line-height: 1.4;">
                  <strong>Fresh code generated!</strong> Use this new code to verify your email address.
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

          <!-- Mobile Responsive -->
          <style>
            @media only screen and (max-width: 600px) {
              .email-container {
                margin: 10px !important;
              }
              .email-content {
                padding: 20px 15px !important;
              }
              .verification-code {
                font-size: 20px !important;
                letter-spacing: 2px !important;
              }
            }
          </style>
        </body>
        </html>
      `;

      const emailResult = await sendEmail({ 
        to: email, 
        subject: "New Verification Code - LinkShorti", 
        html 
      });

      if (!emailResult.success) {
        console.error('Email sending failed during resend:', emailResult.error);
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