import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware — currently a passthrough.
 * Firebase anonymous auth handles authentication on the client side.
 * All routes are accessible; auth state is managed by <AuthProvider>.
 * 
 * This file is kept as a placeholder for future route guards
 * (e.g. restricting certain routes to linked/non-anonymous accounts).
 */
export async function middleware(req: NextRequest) {
  return NextResponse.next();
}

// Apply this middleware to specific routes
export const config = {
  matcher: [
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};
//   matcher: ['/spaces/:path*', '/profile/:path*', '/all-habits/:paht*', '/login', '/signup'], // pattern of routes you want to protect, keep adding matchers this way: ['/spaces/:path*', '/profile/:path*'],
// };