import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";

export async function middleware(request) {
  console.log("Middleware token",request);
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  const { pathname } = request.nextUrl;

  const isAuthPage = pathname === "/auth/login";

  const isProtectedRoute = [
    "/dashboard",
    "/candidates",
    "/saved-candidates",
    "/jobs/postjob",
  ].some((route) => pathname.startsWith(route));

  if (!token && isProtectedRoute) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/candidates/:path*",
    "/saved-candidates/:path*",
    "/jobs/postjob/:path*",
    "/auth/login",
  ],
};
