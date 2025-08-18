import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

/**
 * Workaround to be able to delete the authentication http_only cookie FROM server components 
 * see: https://github.com/vercel/next.js/issues/51875
 * "There is no way to set a cookie during server components rendering. You need to use middleware or call the server action from a client component"
 */
export async function GET(request: Request) {
  (await cookies()).delete('auth_token');

  // redirect to login page
  const loginUrl = new URL('/login', request.url);
  return NextResponse.redirect(loginUrl);
}