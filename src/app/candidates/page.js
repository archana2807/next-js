// src/app/candidates/page.js
import { cookies } from 'next/headers';
import CandidatesClient from './CandidatesClient';

export default async function CandidatesPage({ searchParams }) {
  const token = cookies().get('token')?.value;

  const query = new URLSearchParams({
    search: searchParams.search || '',
    page: searchParams.page || '1',
    skills: searchParams.skills || '',
    batch: searchParams.batch || '',
    branch: searchParams.branch || '',
    college: searchParams.college || '',
    jobId: searchParams.jobId || '',
    recruiterId: 1,
  }).toString();

  const res = await fetch(`http://localhost/candidate_portal_api/candidates?${query}`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: 'no-store',
  });

  if (!res.ok) {
    
    throw new Error(`Failed to fetch candidates: ${res.status}`);
  }

  const { data = [], total = 0 } = await res.json();

  return (
    <CandidatesClient
      candidates={data}
      total={total}
      currentPage={parseInt(searchParams.page || '1', 10)}
      searchParams={searchParams}
    />
  );
}
