'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import BreadComp from '../components/BreadComp';
import DataTable from '../components/DataTable';
import NoDataFound from '../components/NoDataFound';

export default function JobsClient({ jobs, total, page, perPage, search }) {
    const router = useRouter();
    const [searchText, setSearchText] = useState(search || '');

    const handleSearch = () => {
        router.push(`/jobs?page=1&perPage=${perPage}&search=${searchText}`);
    };

    const handlePageChange = (newPage) => {
        router.push(`/jobs?page=${newPage}&perPage=${perPage}&search=${searchText}`);
    };

    const handlePerPageChange = (newPerPage) => {
        router.push(`/jobs?page=1&perPage=${newPerPage}&search=${searchText}`);
    };
    const locationOptions = [
        { label: 'Bangalore', value: '1' },
        { label: 'Mumbai', value: '2' },
        { label: 'Remote', value: '3' }
    ];

    const columns = [
        {
            accessorKey: 'title',
            header: 'Job Title',
            cell: info => info.getValue(),
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: info => {
                const locationId = info.getValue();
                const matched = locationOptions.find(opt => opt.value === locationId);
                return matched ? matched.label : 'Unknown';
            }
        },
        {
            accessorKey: 'candidate_count',
            header: 'Job Candidates',
            cell: ({ row }) => {
                const jobId = row.original.id;
                const count = row.original.candidate_count;

                return (
                    <span
                        className="text-indigo-600 hover:underline cursor-pointer"
                        onClick={() => router.push(`/candidates?jobId=${jobId}`)}
                    >
                        {count}
                    </span>
                );
            }
        },
        {
            accessorKey: 'posted_date',
            header: 'Posted Date',
            cell: info => {
                const dateStr = info.getValue();
                return dateStr ? dateStr.split('T')[0] : '';
            }
        },
        {
            accessorKey: 'salary',
            header: 'Salary',
            cell: info => info.getValue() || 'Negotiable',
        },
        {
            accessorKey: 'status',
            header: 'Status',
            cell: info => (
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${info.getValue() === 'Closed'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-green-100 text-green-700'}`}>
                    {info.getValue() || 'Active'}
                </span>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => (
                <button
                    onClick={() => router.push(`/register-candidate?jobId=${row.original.id}`)}
                    className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                >
                    Apply Now
                </button>
            ),
        }

    ];

    return (
        <div className="p-6">
            <BreadComp title="Job Openings" items={[{ label: 'Home', href: '/' }, { label: 'Jobs' }]} />
            <div className="flex justify-between items-center mb-4" style={{ display: "flex", alignContent: "flex-end", justifyContent: "flex-end" }}>

                {/* ✅ Post Job Button */}
                <button

                    onClick={() => router.push('/jobs/postjob')}
                    className=" bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                >
                    Post Job
                </button>

            </div>
            {!Array.isArray(jobs) || jobs.length === 0 ? (

                <NoDataFound message="No jobs found." />
            ) : (
                <DataTable
                    data={jobs}
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
