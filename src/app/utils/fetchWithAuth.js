

// utils/fetchWithAuth.js
import { cookies } from 'next/headers';

export default async function fetchWithAuth(url, options = {}) {
 // Await the cookies to access the token
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

  const headers = {
    ...(options.headers || {}),
    Authorization: token ? `Bearer ${token}` : '',
  };

  if (
    !(options.body instanceof FormData) &&
    !headers['Content-Type']
  ) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(url, {
    ...options,
    headers,
  });

  return res; // return raw response
}
