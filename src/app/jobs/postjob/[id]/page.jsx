


import EditJobClient from './EditJobClient';
import fetchWithAuth from '../../../utils/fetchWithAuth';

const getJobDetails = async (id) => {
    try {
        const res = await fetchWithAuth(`http://localhost/candidate_portal_api/getjobbyid/${id}`, {
            cache: 'no-store',
        });

        const result = await res.json();
        return result?.data || null;
    } catch (err) {
        console.error('Failed to fetch job:', err.message);
        return null;
    }
};

export default async function EditPage({ params }) {
    const job = await getJobDetails(params.id);

    if (!job) {
        return <div className="p-6 text-red-500">Job not found.</div>;
    }

    return <EditJobClient jobData={job} />;
}
