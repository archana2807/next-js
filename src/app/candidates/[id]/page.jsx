import CandidateDetail from './CandidateDetail';
import fetchWithAuth from '../../utils/fetchWithAuth'; // ✅ Import the wrapper

async function getCandidate(id) {

    const res = await fetchWithAuth(`http://localhost/candidate_portal_api/candidates/${id}`, {
        cache: 'no-store',
    });

    if (!res.ok) {

        throw new Error(`Failed to fetch candidates: ${res.status}`);
    }
    const data = await res.json(); // ✅ Parse JSON here
    return data;

}

export default async function Page({ params }) {
    const candidate = await getCandidate(params.id);

    if (!candidate) {
        return <div>Candidate not found.</div>;
    }

    return <CandidateDetail candidate={candidate} />;
}
