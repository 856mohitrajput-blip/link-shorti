import { NextResponse } from 'next/server';

/**
 * Admin Verification API
 * Simple endpoint that returns success - actual verification is done client-side via sessionStorage
 */
export async function GET() {
  // This endpoint is kept for compatibility but verification is now client-side
  return NextResponse.json(
    { success: true, message: "Verify admin session client-side" },
    { status: 200 }
  );
}
