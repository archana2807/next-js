// app/saved-candidates/page.jsx
import SavedCandidatesClient from './SavedCandidatesClient';
import fetchWithAuth from '../utils/fetchWithAuth'; // ✅ Import the wrapper

export default async function SavedCandidatesPage({ searchParams }) {
    const recruiterId = 1;
    const page = parseInt(searchParams.page || 1);
    const perPage = parseInt(searchParams.perPage || 10);
    const search = searchParams.search || '';

    const url = `http://localhost/candidate_portal_api/getsavedcandidatesbyrecruiter`;

    // const res = await fetchWithAuth(url, {
    //     method: 'POST',
    //     cache: 'no-store',
    //     body: JSON.stringify({ page, perPage, search }),
    // });

    const res = await fetchWithAuth(url, {
        method: 'POST',
        // cache: 'no-store',

        body: JSON.stringify({
            recruiter_id: recruiterId,
            page: page,
            per_page: perPage,
            search: search,
        }),
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const { data, total } = await res.json(); // ✅ Parse JSON here

    return (
        <SavedCandidatesClient
            candidates={data}
            total={total}
            page={page}
            perPage={perPage}
            search={search}
        />
    );
}
