import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


export async function middleware(req: NextRequest) {
  // Check for a token in cookies
  const token = req.cookies.get('auth_token')?.value;
  const { pathname } = req.nextUrl;
  const authPaths: string[] = ["/login", "/signup"];
  
  // User has no cookie and the path is other than /login and /signup
  if (!token && !authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  // The user has a cookie and the path is /login or /signup 
  else if (token && authPaths.includes(pathname)) {
    return NextResponse.redirect(new URL("/spaces", req.url));
  } 

  // User is authenticated, let the request continue
  return NextResponse.next();
}

// Apply this middleware to specific routes
export const config = {
    matcher: ['/spaces/:path*', '/login', '/signup'], // pattern of routes you want to protect, keep adding matchers this way: ['/spaces/:path*', '/profile/:path*'],
  };