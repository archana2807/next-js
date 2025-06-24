import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get('page') ?? 1;
  const perPage = searchParams.get('perPage') ?? 10;
  const search = searchParams.get('search') ?? '';

  try {
    const res = await fetch(
      `http://localhost/candidate_portal_api/jobs?page=${page}&perPage=${perPage}&search=${encodeURIComponent(search)}`
    );
    const text = await res.text();
    const data = JSON.parse(text);
    return NextResponse.json(data, { status: res.status });
  } catch (err) {
    console.error('Fetch jobs error:', err);
    return NextResponse.json({ error: 'Failed to load jobs' }, { status: 500 });
  }
}
