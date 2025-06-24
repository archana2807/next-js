// app/candidates/[id]/page.js

import CandidateDetail from './CandidateDetail';

async function getCandidate(id) {
    const res = await fetch(`http://localhost/candidate_portal_api/candidates/${id}`, { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch candidate');
    const data = await res.json();
    return data;
}

export default async function Page({ params }) {
    const candidate = await getCandidate(params.id);

    return <CandidateDetail candidate={candidate} />;
}
