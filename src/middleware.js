import { auth } from "@/auth"
import { NextResponse } from 'next/server'

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const pathname = nextUrl.pathname;

  // Redirect logged-in users away from join-now page
  if (isLoggedIn && pathname === '/join-now') {
    return NextResponse.redirect(new URL('/dashboard', nextUrl));
  }

  // Redirect non-logged-in users to join-now page for protected routes
  if (!isLoggedIn && (pathname === '/dashboard' || pathname === '/profile')) {
    return NextResponse.redirect(new URL('/join-now', nextUrl));
  }

  // Admin routes are handled by their own authentication system
  // No middleware protection needed for /admin routes

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/join-now',
    '/dashboard',
    '/profile',
  ],
}