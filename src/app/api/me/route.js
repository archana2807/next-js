// app/api/me/route.js
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { parse } from 'cookie';

export async function GET() {
  const cookieHeader = headers().get('cookie') || '';
  const cookies = parse(cookieHeader);

  const token = cookies.token;
  const userCookie = cookies.user;

  console.log("token >>", token);
  console.log("userCookie >>", userCookie);

  if (!userCookie) {
    return NextResponse.json({ token: null, user: null }, { status: 401 });
  }

  let user = null;
  try {
    user = JSON.parse(userCookie); // ✅ properly parse string to object
  } catch (e) {
    console.error('Error parsing user cookie:', e);
    return NextResponse.json({ token: null, user: null }, { status: 400 });
  }

  return NextResponse.json({
    token: token || null,
    user, 
  });
}
