// app/saved-candidates/page.jsx
import SavedCandidatesClient from './SavedCandidatesClient';

export default async function SavedCandidatesPage({ searchParams }) {
    const recruiterId = 1;
    const page = parseInt(searchParams.page || 1);
    const perPage = parseInt(searchParams.perPage || 10);
    const search = searchParams.search || '';

    const res = await fetch(`http://localhost/candidate_portal_api/getsavedcandidatesbyrecruiter/${recruiterId}`, {
        method: 'POST',
        cache: 'no-store',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page, perPage, search })
    });

    if (!res.ok) {
        throw new Error('Failed to fetch saved candidates');
    }

    const { data, total } = await res.json();

    return <SavedCandidatesClient candidates={data} total={total} page={page} perPage={perPage} search={search} />;
}
