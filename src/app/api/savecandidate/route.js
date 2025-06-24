// app/api/savecandidate/route.js
import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    const res = await fetch('http://localhost/candidate_portal_api/savecandidate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data);
}

export async function DELETE(request) {
    const body = await request.json();
    const res = await fetch('http://localhost/candidate_portal_api/savecandidate', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    return NextResponse.json(data);
}
