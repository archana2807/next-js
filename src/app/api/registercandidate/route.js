// app/api/registercandidate/route.js
import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const formData = await req.formData();

    const res = await fetch('http://localhost/candidate_portal_api/registercandidate', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json();
    return NextResponse.json(data, { status: res.status });
  } catch (error) {
    console.error('Error in /api/registercandidate:', error); // Log the error to terminal
    return NextResponse.json(
      { message: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
