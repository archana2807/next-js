import { NextResponse } from 'next/server';

export async function POST(request) {
  const { email, password } = await request.json();

  const res = await fetch('http://localhost/candidate_portal_api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await res.json();

  if (!res.ok) {
    return NextResponse.json({ message: data.message || 'Invalid login' }, { status: 401 });
  }

  const response = NextResponse.json({ token: data.token, user: data.user });

  // Set cookies (secure + HttpOnly)
  response.cookies.set('token', data.token, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    
  });

  response.cookies.set('user', JSON.stringify(data.user), {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
  });

  return response;
}
