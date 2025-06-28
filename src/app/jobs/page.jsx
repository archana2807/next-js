import JobsClient from './JobsClient';
import ErrorMessage from '../components/ErrorMessage';

export default async function JobsPage({ searchParams }) {

    const page = parseInt(searchParams.page) || 1;
    const perPage = parseInt(searchParams.perPage) || 10;
    const search = searchParams.search || '';

    const query = new URLSearchParams({ page, perPage, search }).toString();

    // const res = await fetch(`http://localhost/candidate_portal_api/getjobs?${query}`);
    const res = await fetch(`http://localhost/candidate_portal_api/getjobs`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            page,
            perPage,
            search,
        }),
        //  cache: 'no-store', // optional: avoid caching
    });

    if (!res.ok) {
        throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const { data, total } = await res.json();

    return (
        <JobsClient
            jobs={data}
            total={total}
            page={page}
            perPage={perPage}
            search={search}
        />
    );

}


