

'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import BreadComp from '../components/BreadComp';
import NoDataFound from '../components/NoDataFound';
import { FaFilter } from 'react-icons/fa';
import { useSearchParams } from 'next/navigation';
import SaveButton from './SaveButton';

const SKILLS = ['JavaScript', 'Python', 'Java', 'C++', 'React', 'Node.js', 'TypeScript', 'SQL'];
const BATCHES = ['2021', '2022', '2023', '2024'];
const BRANCHES = ['Computer Science', 'Electrical', 'Mechanical', 'Civil'];
const COLLEGES = ['MIT', 'Stanford', 'Harvard', 'Caltech', 'Oxford', 'IIT'];

const CandidatesClient = ({ candidates, total, currentPage, recruiterId }) => {
    const searchParams = useSearchParams(); // ✅ makes it reactive
    const router = useRouter();
    const [showFilters, setShowFilters] = useState(false);

    const skills = useMemo(() => (searchParams.get('skills') || '').split(',').filter(Boolean), [searchParams]);
    const batch = useMemo(() => (searchParams.get('batch') || '').split(',').filter(Boolean), [searchParams]);
    const branch = useMemo(() => (searchParams.get('branch') || '').split(',').filter(Boolean), [searchParams]);
    const college = useMemo(() => (searchParams.get('college') || '').split(',').filter(Boolean), [searchParams]);


    const [skillSearch, setSkillSearch] = useState('');
    const [batchSearch, setBatchSearch] = useState('');
    const [branchSearch, setBranchSearch] = useState('');
    const [collegeSearch, setCollegeSearch] = useState('');

    const updateQuery = (key, values) => {
        const params = new URLSearchParams(searchParams.toString());
        const csv = Array.isArray(values) ? values.join(',') : values;

        if (csv) {
            params.set(key, csv);
        } else {
            params.delete(key);
        }

        // Always reset page to 1 when filters change
        params.set('page', '1');

        const jobId = searchParams.get('jobId');
        if (jobId) {
            params.set('jobId', jobId);
        }

        router.push(`/candidates?${params.toString()}`);
    };

    const toggleFilterValue = (key, value) => {
        const current = { skills, batch, branch, college }[key];
        const newArray = current.includes(value)
            ? current.filter(v => v !== value)
            : [...current, value];
        updateQuery(key, newArray);
    };

    const handleSearchChange = (e) => {
        const val = e.target.value;
        const params = new URLSearchParams(searchParams);
        params.set('search', val);
        params.set('page', '1');
        router.push(`/candidates?${params.toString()}`);
    };

    const handlePageChange = (page) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', page.toString());
        router.push(`/candidates?${params.toString()}`);
    };

    const filteredSkills = SKILLS.filter(skill =>
        skill.toLowerCase().includes(skillSearch.toLowerCase())
    );
    const filteredBatches = BATCHES.filter(b => b.toLowerCase().includes(batchSearch.toLowerCase()));
    const filteredBranches = BRANCHES.filter(b => b.toLowerCase().includes(branchSearch.toLowerCase()));
    const filteredColleges = COLLEGES.filter(c => c.toLowerCase().includes(collegeSearch.toLowerCase()));

    const renderPagination = () => {
        const totalPages = Math.ceil(total / 10);
        if (totalPages <= 1) return null;
        return (
            <div className="flex justify-center mt-6 space-x-2">
                <button disabled={currentPage === 1} onClick={() => handlePageChange(currentPage - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => handlePageChange(p)} className={`px-3 py-1 border rounded ${currentPage === p ? 'bg-blue-500 text-white' : ''}`}>{p}</button>
                ))}
                <button disabled={currentPage === totalPages} onClick={() => handlePageChange(currentPage + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
            </div>
        );
    };

    return (
        <div>
            <BreadComp title="Candidates" items={[{ label: 'Home', href: '/' }, { label: 'Candidates', href: '/candidates' }]} />

            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    defaultValue={searchParams.get('search') || ''}
                    onChange={handleSearchChange}
                    placeholder="Search candidates..."
                    className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button className="md:hidden bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center gap-2" onClick={() => setShowFilters(!showFilters)}>
                    <FaFilter /> Filters
                </button>
            </div>

            <div className="flex min-h-screen">
                <div className={`fixed inset-y-0 left-0 w-64 bg-white p-6 shadow-lg transition-transform duration-300 transform ${showFilters ? 'translate-x-0' : '-translate-x-full'} z-10 md:relative md:translate-x-0 overflow-y-auto`}>
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-lg font-semibold text-gray-800">Filters</h2>
                        <button
                            onClick={() => {
                                const params = new URLSearchParams();
                                params.set('page', '1');
                                router.push(`/candidates?${params.toString()}`);
                            }}
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-1 px-2 rounded-md text-sm"
                        >
                            Clear All
                        </button>
                    </div>

                    {[
                        { label: 'Skills', items: filteredSkills, state: skillSearch, setState: setSkillSearch, key: 'skills' },
                        { label: 'Batch', items: filteredBatches, state: batchSearch, setState: setBatchSearch, key: 'batch' },
                        { label: 'Branch', items: filteredBranches, state: branchSearch, setState: setBranchSearch, key: 'branch' },
                        { label: 'College', items: filteredColleges, state: collegeSearch, setState: setCollegeSearch, key: 'college' },
                    ].map(filter => (
                        <div className="mb-6" key={filter.key}>
                            <label className="block text-sm font-medium text-gray-700 mb-1">{filter.label}</label>
                            <input
                                type="text"
                                value={filter.state}
                                onChange={(e) => filter.setState(e.target.value)}
                                placeholder={`Search ${filter.label.toLowerCase()}...`}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                            />
                            <div className="max-h-40 overflow-y-auto space-y-2">
                                {filter.items.map(item => (
                                    <div key={item} className="flex items-center">
                                        <input
                                            type="checkbox"
                                            checked={({ skills, batch, branch, college }[filter.key] || []).includes(item)}
                                            onChange={() => toggleFilterValue(filter.key, item)}
                                            className="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded"
                                        />
                                        <label className="text-sm text-gray-700">{item}</label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="flex-1 p-6">
                    {candidates.length === 0 ? (
                        <NoDataFound message="No candidates found." />
                    ) : (
                        <>
                            <div className="grid gap-6">
                                {candidates.map(candidate => (

                                    <div key={candidate.id} className="border rounded-lg p-4 shadow-sm bg-white">
                                        <div className="cursor-pointer flex flex-col sm:flex-row justify-between gap-4">
                                            <div className="flex-1 pr-6 space-y-2" onClick={() => router.push(`/candidates/${candidate.id}`)}>
                                                <h2 className="text-lg font-semibold text-gray-800">{candidate.name}</h2>
                                                <div className="text-gray-600 text-sm flex flex-wrap gap-4">
                                                    {candidate.experienceYears && <span><strong>Exp:</strong> {candidate.experienceYears}</span>}
                                                    {candidate.expectedSalary && <span><strong>Salary:</strong> {candidate.expectedSalary}</span>}
                                                    {candidate.location && <span><strong>Location:</strong> {candidate.location}</span>}
                                                </div>
                                                {candidate.description && <p className="text-gray-700 text-sm">{candidate.description}</p>}
                                                {(candidate.education || candidate.college || candidate.batch) && (
                                                    <div className="text-sm text-gray-700">
                                                        <strong>Education:</strong> {[candidate.education, candidate.college, candidate.batch].filter(Boolean).join(', ')}
                                                    </div>
                                                )}
                                                {candidate.skills?.length > 0 && (
                                                    <div className="text-sm">
                                                        <strong className="text-gray-700">Skills:</strong>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            {candidate.skills.map(skill => (
                                                                <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">{skill}</span>
                                                            ))}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex flex-col items-center gap-2">
                                                {candidate.image ? (
                                                    <img src={candidate.image} alt={candidate.name} className="w-20 h-20 object-cover rounded border" />
                                                ) : (
                                                    <div className="w-20 h-20 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full border font-semibold text-xl uppercase">
                                                        {candidate.name?.charAt(0) || '?'}
                                                    </div>
                                                )}
                                                <SaveButton defaultSaved={candidate.is_saved} candidateId={candidate.id} recruiterId={recruiterId} />
                                            </div>
                                        </div>
                                    </div>


                                ))}
                            </div>

                            {renderPagination()}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CandidatesClient;


