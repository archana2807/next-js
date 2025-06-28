


// app/api/postjob/route.js
import { NextResponse } from 'next/server';
import fetchWithAuth from '../../utils/fetchWithAuth'; // adjust path as needed

export async function POST(req) {
  try {
    const formData = await req.formData();

    // Optional: convert FormData to object for logging
    const bodyObj = {};
    for (const [key, value] of formData.entries()) {
      bodyObj[key] = value;
    }
    console.log('Received FormData as object:', bodyObj);

    // Use fetchWithAuth
    const response = await fetchWithAuth('http://localhost/candidate_portal_api/postjob', {
      method: 'POST',
      body: formData,
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
