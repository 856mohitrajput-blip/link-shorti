import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.zoho.in",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

// Test the connection
export async function testEmailConnection() {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return { success: true };
  } catch (error) {
    console.error('SMTP connection failed:', error);
    return { success: false, error: error.message };
  }
}

export async function sendEmail({ to, subject, html }) {
  try {
    const info = await transporter.sendMail({
      from: `"Link Shorti" <${process.env.MAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully:', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Email sending failed:', error);
    return { success: false, error: error.message };
  }
}
