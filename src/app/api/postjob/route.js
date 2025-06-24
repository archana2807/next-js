import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    // Read the request body as FormData
    const formData = await req.formData();

    // Convert to a plain object for logging and transmission
    const body = {};
    for (const [key, value] of formData.entries()) {
      body[key] = value;
    }

    console.log('Received FormData as object:', body);

    // Forward to CodeIgniter backend
    const response = await fetch('http://localhost/candidate_portal_api/postjob', {
      method: 'POST',
      body: formData, // Send raw FormData directly
    });

    const text = await response.text();
    console.log('Backend response text:', text);

    let data;
    try {
      data = JSON.parse(text);
    } catch (err) {
      return NextResponse.json({ error: 'Invalid backend JSON', raw: text }, { status: 502 });
    }

    return NextResponse.json(data, { status: response.status });
  } catch (err) {
    console.error('API /postjob error:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
