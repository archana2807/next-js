// src/app/api/dashboard/route.js
import { NextResponse } from 'next/server';
import { verifyToken } from '../../utils/verifyToken'; // Adjust path if needed

export async function GET(request) {
  const { error, status, decoded } = verifyToken(request); // ✅ Sync or use `await` if verifyToken is async

  if (error) {
    return NextResponse.json({ message: error }, { status });
  }

  // ✅ Authenticated, return dashboard stats
  return NextResponse.json({
    totalCandidates: 1200,
    totalBookmarks: 300,
    totalJobs: 80,
    recentCandidates: [
      { name: 'John Doe', title: 'Fullstack Developer' },
      { name: 'Jane Smith', title: 'Backend Engineer' }
    ]
  });
}
