'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import { showToast } from '../../../utils/toastUtils';
import BreadComp from '../../../components/BreadComp';

const Select = dynamic(() => import('react-select'), { ssr: false });

const options = {
    companies: [
        { label: 'ABC Pvt Ltd', value: '1' },
        { label: 'XYZ Corp', value: '2' },
        { label: 'OpenAI', value: '3' },
    ],
    skills: [
        { label: 'React', value: '1' },
        { label: 'Node.js', value: '2' },
        { label: 'JavaScript', value: '3' },
        { label: 'Python', value: '4' },
    ],
    locations: [
        { label: 'Bangalore', value: '1' },
        { label: 'Mumbai', value: '2' },
        { label: 'Remote', value: '3' },
    ],
    experience: [
        { label: 'Fresher', value: '0' },
        { label: '1-2 Years', value: '1' },
        { label: '3-5 Years', value: '2' },
        { label: '5+ Years', value: '3' },
    ],
    jobTypes: [
        { label: 'Full-Time', value: '1' },
        { label: 'Part-Time', value: '2' },
        { label: 'Internship', value: '3' },
        { label: 'Contract', value: '4' },
    ],
};

export default function EditJobClient({ jobData: initialJob }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const [jobData, setJobData] = useState({
        title: initialJob.title || '',
        salary: initialJob.salary || '',
        description: initialJob.description || '',
        postedBy: initialJob.postedBy || '',
        expirationDate: initialJob.expirationDate || '',
        company: options.companies.find((o) => o.value === String(initialJob.company)) || null,
        location: (initialJob.location || '').split(',').map(val => options.locations.find(o => o.value === val)).filter(Boolean),
        experience: (initialJob.experience || '').split(',').map(val => options.experience.find(o => o.value === val)).filter(Boolean),
        skills: (initialJob.skills || '').split(',').map(val => options.skills.find(o => o.value === val)).filter(Boolean),
        type: (initialJob.type || '').split(',').map(val => options.jobTypes.find(o => o.value === val)).filter(Boolean),
    });

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
        formData.append('id', initialJob.id);
        formData.append('recruiterId', 1);
        formData.append('title', jobData.title);
        formData.append('salary', jobData.salary);
        formData.append('description', jobData.description);
        formData.append('postedBy', jobData.postedBy);
        formData.append('expirationDate', jobData.expirationDate);
        formData.append('postedDate', new Date().toISOString().split('T')[0]);
        formData.append('company', jobData.company?.value || '');
        formData.append('location', jobData.location.map((o) => o.value).join(','));
        formData.append('experience', jobData.experience.map((o) => o.value).join(','));
        formData.append('skills', jobData.skills.map((o) => o.value).join(','));
        formData.append('type', jobData.type.map((o) => o.value).join(','));

        try {
            const res = await fetch('/api/postjob', {
                method: 'POST',
                body: formData,
            });

            const result = await res.json();

            if (res.ok) {
                showToast('Job updated successfully!', 'success');
                router.push('/jobs');
            } else {
                showToast(result.error || 'Failed to update job', 'error');
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
            <BreadComp
                title="Edit Job"
                items={[
                    { label: 'Home', href: '/dashboard' },
                    { label: 'Jobs', href: '/jobs' },
                    { label: 'Edit Job' },
                ]}
            />

            <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow rounded">
                {[
                    { label: 'Title', key: 'title', type: 'text' },
                    { label: 'Salary', key: 'salary', type: 'text' },
                    { label: 'Contact Email', key: 'postedBy', type: 'email' },
                ].map(({ label, key, type }) => (
                    <div key={key}>
                        <label>{label}</label>
                        <input
                            type={type}
                            value={jobData[key]}
                            onChange={(e) => setJobData({ ...jobData, [key]: e.target.value })}
                            className="w-full p-2 border rounded"
                        />
                        {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
                    </div>
                ))}

                <div>
                    <label>Company</label>
                    <Select
                        options={options.companies}
                        value={jobData.company}
                        onChange={(value) => setJobData({ ...jobData, company: value })}
                    />
                    {errors.company && <p className="text-red-500 text-sm">{errors.company}</p>}
                </div>

                {[
                    { label: 'Location', key: 'location', options: options.locations },
                    { label: 'Experience', key: 'experience', options: options.experience },
                    { label: 'Skills', key: 'skills', options: options.skills },
                    { label: 'Job Type', key: 'type', options: options.jobTypes },
                ].map(({ label, key, options }) => (
                    <div key={key}>
                        <label>{label}</label>
                        <Select
                            options={options}
                            isMulti
                            value={jobData[key]}
                            onChange={(val) => setJobData({ ...jobData, [key]: val })}
                        />
                        {errors[key] && <p className="text-red-500 text-sm">{errors[key]}</p>}
                    </div>
                ))}

                <div>
                    <label>Description</label>
                    <textarea
                        value={jobData.description}
                        onChange={(e) => setJobData({ ...jobData, description: e.target.value })}
                        className="w-full p-2 border rounded"
                        placeholder="Job description..."
                    />
                    {errors.description && <p className="text-red-500 text-sm">{errors.description}</p>}
                </div>

                <div>
                    <label>Expiration Date</label>
                    <input
                        type="date"
                        value={jobData.expirationDate}
                        onChange={(e) => setJobData({ ...jobData, expirationDate: e.target.value })}
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
                        {loading ? 'Updating...' : 'Update Job'}
                    </button>
                </div>
            </form>
        </div>
    );
}
