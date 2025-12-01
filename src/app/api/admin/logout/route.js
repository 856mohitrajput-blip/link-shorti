import { NextResponse } from 'next/server';

/**
 * Admin Logout API
 * Clears admin authentication cookie
 */
export async function POST() {
  const response = NextResponse.json(
    { success: true, message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.delete('admin-token');

  return response;
}
