import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const protectedPaths = [ '/jobs/postjob', '/candidates', '/saved-candidates'];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  return NextResponse.next();
}

// Match config
export const config = {
  matcher: [ '/jobs/:path*', '/candidates', '/saved-candidates'],
};
