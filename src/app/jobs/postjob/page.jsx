'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import BreadComp from '../../components/BreadComp';
import { showToast } from '../../utils/toastUtils';

const Select = dynamic(() => import('react-select'), { ssr: false });

const options = {
    companies: [
        { label: 'ABC Pvt Ltd', value: '1' },
        { label: 'XYZ Corp', value: '2' },
        { label: 'OpenAI', value: '3' }
    ],
    skills: [
        { label: 'React', value: '1' },
        { label: 'Node.js', value: '2' },
        { label: 'JavaScript', value: '3' },
        { label: 'Python', value: '4' }
    ],
    locations: [
        { label: 'Bangalore', value: '1' },
        { label: 'Mumbai', value: '2' },
        { label: 'Remote', value: '3' }
    ],
    experience: [
        { label: 'Fresher', value: '0' },
        { label: '1-2 Years', value: '1' },
        { label: '3-5 Years', value: '2' },
        { label: '5+ Years', value: '3' }
    ],
    jobTypes: [
        { label: 'Full-Time', value: '1' },
        { label: 'Part-Time', value: '2' },
        { label: 'Internship', value: '3' },
        { label: 'Contract', value: '4' }
    ]
};

const initialJobState = {
    title: '', company: null, location: [], experience: [],
    skills: [], type: [], salary: '', description: '',
    postedBy: '', expirationDate: ''
};

export default function PostJobPage() {

    const router = useRouter();
    const [jobData, setJobData] = useState(initialJobState);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    const validate = () => {
        const errs = {};
        if (!jobData.title.trim()) errs.title = 'Required';
        if (!jobData.company) errs.company = 'Required';
        if (jobData.location.length === 0) errs.location = 'Required';
        if (jobData.experience.length === 0) errs.experience = 'Required';
        if (jobData.skills.length === 0) errs.skills = 'Required';
        if (jobData.type.length === 0) errs.type = 'Required';
        if (!jobData.salary.trim()) errs.salary = 'Required';
        if (!jobData.description.trim()) errs.description = 'Required';
        if (!jobData.postedBy.match(/^\S+@\S+\.\S+$/)) errs.postedBy = 'Valid email required';
        if (!jobData.expirationDate) errs.expirationDate = 'Required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const formData = new FormData();
        formData.append('recruiterId', 1);
        formData.append('title', jobData.title);
        formData.append('salary', jobData.salary);
        formData.append('description', jobData.description);
        formData.append('postedBy', jobData.postedBy);
        formData.append('expirationDate', jobData.expirationDate);
        formData.append('postedDate', new Date().toISOString().split('T')[0]);

        formData.append('company', jobData.company?.value || '');
        formData.append('location', jobData.location.map(o => o.value).join(','));
        formData.append('experience', jobData.experience.map(o => o.value).join(','));
        formData.append('skills', jobData.skills.map(o => o.value).join(','));
        formData.append('type', jobData.type.map(o => o.value).join(','));

        try {
            const res = await fetch('/api/postjob', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                showToast('Job posted successfully!', 'success');
                router.push('/jobs');
            } else {
                showToast(result.error || 'Failed to post job', 'error');
            }
        } catch (err) {
            console.error(err);
            showToast('Server error', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <BreadComp title="Post a New Job" items={[
                { label: 'Home', href: '/dashboard' },
                { label: 'Jobs', href: '/jobs' },
                { label: 'Post Job' }
            ]} />

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
                <div>
                    <label>Title</label>
                    <input
                        name="title"
                        value={jobData.title}
                        onChange={e => setJobData({ ...jobData, title: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Job title"
                    />
                    {errors.title && <p className="text-red-500 text-sm">{errors.title}</p>}
                </div>

                <div>
                    <label>Company</label>
                    <Select
                        options={options.companies}
                        value={jobData.company}
                        onChange={value => setJobData({ ...jobData, company: value })}
                    />
                    {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                </div>

                <div>
                    <label>Location</label>
                    <Select
                        options={options.locations}
                        isMulti
                        value={jobData.location}
                        onChange={value => setJobData({ ...jobData, location: value })}
                    />
                    {errors.location && <p className="text-red-500 text-sm">{errors.location}</p>}
                </div>

                <div>
                    <label>Experience</label>
                    <Select
                        options={options.experience}
                        isMulti
                        value={jobData.experience}
                        onChange={value => setJobData({ ...jobData, experience: value })}
                    />
                    {errors.experience && <p className="text-red-500 text-sm">{errors.experience}</p>}
                </div>

                <div>
                    <label>Skills</label>
                    <Select
                        options={options.skills}
                        isMulti
                        value={jobData.skills}
                        onChange={value => setJobData({ ...jobData, skills: value })}
                    />
                    {errors.skills && <p className="text-red-500 text-sm">{errors.skills}</p>}
                </div>

                <div>
                    <label>Job Type</label>
                    <Select
                        options={options.jobTypes}
                        isMulti
                        value={jobData.type}
                        onChange={value => setJobData({ ...jobData, type: value })}
                    />
                    {errors.type && <p className="text-red-500 text-sm">{errors.type}</p>}
                </div>

                <div>
                    <label>Salary</label>
                    <input
                        name="salary"
                        value={jobData.salary}
                        onChange={e => setJobData({ ...jobData, salary: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="e.g. 50000"
                    />
                    {errors.salary && <p className="text-red-500 text-sm">{errors.salary}</p>}
                </div>

                <div>
                    <label>Description</label>
                    <textarea
                        name="description"
                        value={jobData.description}
                        onChange={e => setJobData({ ...jobData, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Job description..."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div>
                    <label>Contact Email</label>
                    <input
                        name="postedBy"
                        value={jobData.postedBy}
                        onChange={e => setJobData({ ...jobData, postedBy: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="contact@company.com"
                    />
                    {errors.postedBy && <p className="text-red-500 text-sm">{errors.postedBy}</p>}
                </div>

                <div>
                    <label>Expiration Date</label>
                    <input
                        name="expirationDate"
                        type="date"
                        value={jobData.expirationDate}
                        onChange={e => setJobData({ ...jobData, expirationDate: e.target.value })}
                        className="w-full p-2 border rounded"
                    />
                    {errors.expirationDate && <p className="text-red-500 text-sm">{errors.expirationDate}</p>}
                </div>

                <div className="flex justify-end gap-2">
                    <button
                        type="button"
                        onClick={() => router.push('/jobs')}
                        className="px-4 py-2 border rounded hover:bg-gray-100"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
                        disabled={loading}
                    >
                        {loading ? 'Posting...' : 'Post Job'}
                    </button>
                </div>
            </form>
        </div>
    );
}
