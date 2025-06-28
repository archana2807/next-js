



'use client';

import { useRouter } from 'next/navigation';
import { useState, useEffect, useTransition } from 'react';
import BreadComp from '../components/BreadComp';
import DataTable from '../components/DataTable';

export default function SavedCandidatesClient({ candidates, total, page, perPage, search }) {
  const router = useRouter();
  const [searchText, setSearchText] = useState(search);
  const [isPending, startTransition] = useTransition();

  // 🔁 Trigger router.push after user stops typing (500ms delay)
    useEffect(() => {
      if (searchText === search) return; // ✅ prevent unnecessary push on initial load

    const delayDebounce = setTimeout(() => {
      startTransition(() => {
        router.push(`/saved-candidates?page=1&perPage=${perPage}&search=${encodeURIComponent(searchText)}`);
      });
    }, 500);

    return () => clearTimeout(delayDebounce); // cleanup
  }, [searchText]); // rerun when searchText or perPage changes

  const handlePageChange = (newPage) => {
    startTransition(() => {
      router.push(`/saved-candidates?page=${newPage}&perPage=${perPage}&search=${encodeURIComponent(searchText)}`);
    });
  };

  const handlePerPageChange = (newPerPage) => {
    startTransition(() => {
      router.push(`/saved-candidates?page=1&perPage=${newPerPage}&search=${encodeURIComponent(searchText)}`);
    });
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

      <DataTable
        isLoading={isPending}
        data={candidates}
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
