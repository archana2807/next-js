// utils/authServer.js
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

// Optional server auth (no redirect)
export function getOptionalServerAuth() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value || null;
    const userCookie = cookieStore.get('user')?.value;
    const user = userCookie ? JSON.parse(userCookie) : null;
    return { token, user };
  } catch (err) {
    console.error('Error reading cookies:', err);
    return { token: null, user: null };
  }
}

// Required server auth (redirect if missing)
export function requireServerAuth() {
  const { token, user } = getOptionalServerAuth();
  if (!token) redirect('/auth/login');
  return { token, user };
}
