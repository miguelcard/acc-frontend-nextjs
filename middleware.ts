import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

 const AUTH_PATHS: string[] = ["/login", "/signup"];
 const PUBLIC_PATHS: string[] = ["/"];

export async function middleware(req: NextRequest) {

  const { pathname } = req.nextUrl;

  if (isPublic(pathname)) {
    return NextResponse.next();
  }

  // Check for a token in cookies
  const token = req.cookies.get('auth_token')?.value;

  const isAuthPath = AUTH_PATHS.includes(pathname);
  
  // User has no cookie and the path is other than /login and /signup
  if (!token && !isAuthPath) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  // The user has a cookie and the path is /login or /signup 
  else if (token && isAuthPath) {
    return NextResponse.redirect(new URL("/spaces", req.url));
  } 

  // User is authenticated, let the request continue
  return NextResponse.next();
}

export function isPublic(pathname: string) {
  // exact matches
  if (PUBLIC_PATHS.includes(pathname)) return true;

  // allow public folders if any
  if (pathname.startsWith('/public/')) return true;

  return false;
}


// Apply this middleware to specific routes
export const config = {
  matcher: [
    /*
      Run on all paths except:
      - Next internals: _next
      - API routes: /api/*
      - Static files (anything with a dot: .css, .js, .png, etc)
      - Common public files: favicon.ico, robots.txt, sitemap.xml
    */
    '/((?!_next|api|favicon.ico|robots.txt|sitemap.xml|.*\\..*).*)',
  ],
};


// Apply this middleware to specific routes , not used anymore, needed to add each path manually
// export const config = {
//   matcher: ['/spaces/:path*', '/profile/:path*', '/all-habits/:paht*', '/login', '/signup'], // pattern of routes you want to protect, keep adding matchers this way: ['/spaces/:path*', '/profile/:path*'],
// };