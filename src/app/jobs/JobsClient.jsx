


'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import BreadComp from '../components/BreadComp';
import DataTable from '../components/DataTable';
import NoDataFound from '../components/NoDataFound';
import { FaEdit, FaTrash, FaRegCopy } from 'react-icons/fa';
import { useAuth } from '../utils/AuthContext';  // Adjust path as per your project

export default function JobsClient({ jobs, total, page, perPage, search }) {

    console.log("jobs", jobs);
    const router = useRouter();
    const [searchText, setSearchText] = useState(search || '');
    const [isPending, startTransition] = useTransition();
    const { user } = useAuth(); // ✅ current user

    // Debounced search navigation
    useEffect(() => {
        if (searchText === search) return;

        const timeout = setTimeout(() => {
            startTransition(() => {
                router.push(`/jobs?page=1&perPage=${perPage}&search=${encodeURIComponent(searchText)}`);
            });
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchText]);

    const handlePageChange = (newPage) => {
        startTransition(() => {
            router.push(`/jobs?page=${newPage}&perPage=${perPage}&search=${encodeURIComponent(searchText)}`);
        });
    };

    const handlePerPageChange = (newPerPage) => {
        startTransition(() => {
            router.push(`/jobs?page=1&perPage=${newPerPage}&search=${encodeURIComponent(searchText)}`);
        });
    };

    const locationOptions = [
        { label: 'Bangalore', value: '1' },
        { label: 'Mumbai', value: '2' },
        { label: 'Remote', value: '3' },
    ];

    const columns = [
        {
            accessorKey: 'title',
            header: 'Job Title',
            cell: ({ row }) => {
                const { id, title } = row?.original || {};
                return (
                    <span
                        className="text-blue-600 hover:underline cursor-pointer"
                        onClick={() => router.push(`/jobs/${id}`)}
                    >
                        {title}
                    </span>
                );
            },
        },
        {
            accessorKey: 'location',
            header: 'Location',
            cell: info => {
                const locationId = info.getValue();
                const matched = locationOptions.find(opt => opt.value === locationId);
                return matched ? matched.label : 'Unknown';
            },
        },
        {
            accessorKey: 'candidate_count',
            header: 'Job Candidates',
            cell: ({ row }) => {

                const jobId = row?.original?.id;
                const count = row?.original?.candidate_count;;

                return (
                    <span
                        className="text-indigo-600 hover:underline cursor-pointer"
                        onClick={() => router.push(`/candidates?jobId=${jobId}`)}
                    >
                        {count}
                    </span>
                );
            },
        },
        {
            accessorKey: 'posted_date',
            header: 'Posted Date',
            cell: info => {
                const dateStr = info.getValue();
                return dateStr ? dateStr.split('T')[0] : '';
            },
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
                <span
                    className={`px-3 py-1 rounded-full text-sm font-medium ${info.getValue() === 'Closed'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                        }`}
                >
                    {info.getValue() || 'Active'}
                </span>
            ),
        },
        {
            accessorKey: 'actions',
            header: 'Actions',
            cell: ({ row }) => {
                const jobId = row?.original?.id;

                if (user) {
                    return (
                        <div className="flex gap-3 text-indigo-600">
                            <FaEdit
                                className="cursor-pointer hover:text-indigo-800"
                                onClick={() => router.push(`/jobs/postjob/${jobId}`)}
                                title="Edit Job"
                            />
                            <FaTrash
                                className="cursor-pointer hover:text-red-600"
                                onClick={() => {
                                    if (confirm('Are you sure you want to delete this job?')) {
                                        // TODO: handle delete
                                        console.log('Delete job:', jobId);
                                    }
                                }}
                                title="Delete Job"
                            />
                            <FaRegCopy
                                className="cursor-pointer hover:text-indigo-800"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/jobs/${jobId}`);
                                }}
                                title="Copy Job Link"
                            />
                        </div>
                    );
                }

                return (
                    <button
                        onClick={() => router.push(`/register-candidate?jobId=${jobId}`)}
                        className="text-indigo-600 hover:text-indigo-800 text-sm underline"
                    >
                        Apply Now
                    </button>
                );
            },
        },
    ];

    return (
        <div className="p-6">
            <BreadComp title="Job Openings" items={[{ label: 'Home', href: '/' }, { label: 'Jobs' }]} />

            {/* Post Job button */}
            {user && (
                <div className="flex justify-end mb-4">
                    <button
                        onClick={() => router.push('/jobs/postjob')}
                        className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition"
                    >
                        Post Job
                    </button>
                </div>
            )}


            <DataTable
                isLoading={isPending}
                data={jobs}
                columns={columns}
                total={total}
                page={page}
                perPage={perPage}
                searchText={searchText}
                onSearchTextChange={setSearchText}
                onPageChange={handlePageChange}
                onPerPageChange={handlePerPageChange}
            />

        </div>
    );
}
