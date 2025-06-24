import JobsClient from './JobsClient';

export default async function JobsPage({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const perPage = parseInt(searchParams.perPage) || 10;
    const search = searchParams.search || '';

    const query = new URLSearchParams({ page, perPage, search }).toString();

    const res = await fetch(`http://localhost/candidate_portal_api/getjobs?${query}`);
    
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
