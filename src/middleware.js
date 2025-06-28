import { NextResponse } from 'next/server';

import jwt from 'jsonwebtoken';

export function middleware(request) {
  const token = request.cookies.get('token')?.value;

  const protectedPaths = [ '/jobs/postjob', '/candidates', '/saved-candidates','/jobs/postjob/[id]'];

  const isProtected = protectedPaths.some((path) =>
    request.nextUrl.pathname.startsWith(path)
  );

  if (isProtected && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Optional: Verify token is valid
  // try {
  //   jwt.verify(token, process.env.JWT_SECRET);
  // } catch {
  //   return NextResponse.redirect(new URL('/auth/login', request.url));
  // }

  return NextResponse.next();
}

// Match config
export const config = {
  matcher: [ '/jobs/:path*', '/candidates', '/saved-candidates'],
};
