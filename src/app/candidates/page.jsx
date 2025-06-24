

// app/candidates/page.js
import CandidatesClient from './CandidatesClient';

async function fetchCandidatesServer(searchParams) {
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
        method: 'GET',
        cache: 'no-store', // ensures fresh data on reload
    });

    if (!res.ok) throw new Error('Failed to fetch candidates');
    return res.json(); // expected: { data, total, page, perPage }
}

export default async function CandidatesPage({ searchParams }) {
    const { data = [], total = 0, page = 1 } = await fetchCandidatesServer(searchParams);

    return (
        <CandidatesClient
            candidates={data}
            total={total}
            currentPage={parseInt(searchParams.page || '1', 10)}
            searchParams={searchParams}

            recruiterId={1}
        // initiallySaved={[1, 2]}
        />
    );
}

