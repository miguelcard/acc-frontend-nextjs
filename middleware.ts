import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function middleware(req: NextRequest) {
  // Check for a token in cookies
  const token = req.cookies.get('auth_token')?.value;

  if (!token) {
    // User is not authenticated, redirect to home
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // User is authenticated, let the request continue
  return NextResponse.next();
}

// Apply this middleware to specific routes
export const config = {
    matcher: ['/spaces/:path*'], // pattern of routes you want to protect, keep adding matchers this way: ['/spaces/:path*', '/profile/:path*'],
  };