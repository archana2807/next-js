'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BreadComp from '../components/BreadComp';
import DataTable from '../components/DataTable';
import NoDataFound from '../components/NoDataFound';

export default function SavedCandidatesClient({ candidates, total, page, perPage, search }) {
    const router = useRouter();
    const [searchText, setSearchText] = useState(search);

    const handleSearch = () => {
        router.push(`/saved-candidates?page=1&perPage=${perPage}&search=${searchText}`);
    };

    const handlePageChange = (newPage) => {
        router.push(`/saved-candidates?page=${newPage}&perPage=${perPage}&search=${searchText}`);
    };

    const handlePerPageChange = (newPerPage) => {
        router.push(`/saved-candidates?page=1&perPage=${newPerPage}&search=${searchText}`);
    };

    const columns = [
        { accessorKey: 'name', header: 'Candidate Name', cell: info => info.getValue() },
        { accessorKey: 'location', header: 'Location', cell: info => info.getValue() || 'Not Specified' },
        { accessorKey: 'expected_salary', header: 'Expected Salary', cell: info => info.getValue() || 'Not Provided' },
        { accessorKey: 'experience_years', header: 'Experience', cell: info => info.getValue() || 'Fresher' },
        { accessorKey: 'education', header: 'Education', cell: info => info.getValue() || 'Not Provided' },
    ];

    return (
        <div className="p-6">
            <BreadComp title="Saved Candidates" items={[{ label: 'Home', href: '/' }, { label: 'Saved Candidates' }]} />

            
            {candidates.length === 0 ? (
                <NoDataFound message="No saved candidates found." />
            ) : (
                <DataTable
                    data={candidates}
                    columns={columns}
                    total={total}
                    page={page}
                    perPage={perPage}
                    onPageChange={handlePageChange}
                    onPerPageChange={handlePerPageChange}
                />
            )}
        </div>
    );
}
