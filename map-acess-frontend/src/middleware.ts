import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const jwt = req.cookies.get('jwt')?.value;

  const protectedRoutes = ['/home', '/dashboard', '/answers', 'user-group'];

  if (protectedRoutes.some(route => req.nextUrl.pathname.startsWith(route))) {
    if (!jwt) {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/home/:path*', '/dashboard/:path*', '/answers/:path*', 'user-group/:path*'],
};
