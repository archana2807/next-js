import { NextResponse } from 'next/server';
import fetchWithAuth from '../../utils/fetchWithAuth'; // Adjust path if needed

export async function POST(request) {
  const body = await request.json();

  try {
    const res = await fetchWithAuth('http://localhost/candidate_portal_api/savecandidate', {
      method: 'POST',
      body: JSON.stringify(body),
    });

    const data = await res.json(); // ✅ manually parse response

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('POST savecandidate error:', error.message);
    return NextResponse.json({ message: 'Failed to save candidate.' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const body = await request.json();

  try {
    const res = await fetchWithAuth('http://localhost/candidate_portal_api/savecandidate', {
      method: 'DELETE',
      body: JSON.stringify(body),
    });

    const data = await res.json(); // ✅ manually parse response

    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('DELETE savecandidate error:', error.message);
    return NextResponse.json({ message: 'Failed to remove saved candidate.' }, { status: 500 });
  }
}
