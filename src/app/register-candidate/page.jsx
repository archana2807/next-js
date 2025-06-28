'use client';

import { useState, useRef, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { showToast } from '../utils/toastUtils';

// Dynamically import react-select to avoid SSR hydration issues
const Select = dynamic(() => import('react-select'), { ssr: false });

export default function RegisterCandidate() {
    const resumeRef = useRef(null);
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');

    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', batch: '', branch: '', college: '',
        gpa: '', location: '', education: '', expected_salary: '', experience_years: '', description: ''
    });

    const [image, setImage] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const branchOptions = [
        { value: 'Computer Science', label: 'Computer Science' },
        { value: 'Mechanical', label: 'Mechanical' },
        { value: 'Electronics', label: 'Electronics' },
        { value: 'Civil', label: 'Civil' }
    ];

    const batchOptions = Array.from({ length: 10 }, (_, i) => {
        const year = new Date().getFullYear() - i;
        return { value: `${year}`, label: `${year}` };
    });

    const educationOptions = [
        { value: 'B.Tech', label: 'B.Tech' },
        { value: 'M.Tech', label: 'M.Tech' },
        { value: 'MBA', label: 'MBA' },
        { value: 'PhD', label: 'PhD' }
    ];

    const collegeOptions = [
        { value: 'IIT Delhi', label: 'IIT Delhi' },
        { value: 'IIT Bombay', label: 'IIT Bombay' },
        { value: 'NIT Trichy', label: 'NIT Trichy' },
        { value: 'BITS Pilani', label: 'BITS Pilani' }
    ];

    const validate = () => {
        const errs = {};
        const { name, email, phone, batch, branch, college, gpa, expected_salary, experience_years, description } = formData;

        if (!name || name.length < 3 || name.length > 100) errs.name = 'Name must be 3-100 characters.';
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Invalid email address.';
        if (!phone || phone.length < 10 || phone.length > 15) errs.phone = 'Phone must be 10-15 digits.';
        if (!batch) errs.batch = 'Batch is required.';
        if (!branch) errs.branch = 'Branch is required.';
        if (!college) errs.college = 'College is required.';
        if (gpa && isNaN(gpa)) errs.gpa = 'GPA must be a number.';
        if (expected_salary && isNaN(expected_salary)) errs.expected_salary = 'Expected salary must be a number.';
        if (experience_years && !Number.isInteger(Number(experience_years))) errs.experience_years = 'Experience must be an integer.';
        if (description && description.length > 500) errs.description = 'Description max length is 500 characters.';

        setErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
        setErrors(prev => ({ ...prev, [e.target.name]: '' }));
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'image') setImage(file);
        if (type === 'resume') setResume(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        setLoading(true);
        const body = new FormData();
        Object.entries(formData).forEach(([key, val]) => body.append(key, val));
        if (resume) body.append('resume', resume);
        if (image) body.append('image', image);
        if (jobId) body.append('job_id', jobId);

        try {
            const res = await fetch('/api/registercandidate', {
                method: 'POST',
                body,
            });
            const result = await res.json();
            if (res.ok) {
                showToast('Candidate registered successfully!', 'success');
                setFormData({
                    name: '', email: '', phone: '', batch: '', branch: '', college: '',
                    gpa: '', location: '', education: '', expected_salary: '', experience_years: '', description: ''
                });
                setImage(null);
                setResume(null);
                setErrors({});
            } else {
                showToast(result?.error || 'Registration failed.', 'error');
            }
        } catch (err) {

            showToast('Something went wrong!', 'error');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg">
            <h2 className="text-3xl font-semibold text-center text-blue-600 mb-8">Register Candidate</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Text inputs */}
                    {[['name', 'Full Name'], ['email', 'Email Address'], ['phone', 'Phone Number'], ['gpa', 'e.g. 8.5'], ['location', 'e.g. Bangalore'], ['expected_salary', 'e.g. 600000'], ['experience_years', 'e.g. 2']].map(([field, placeholder]) => (
                        <div key={field}>
                            <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('_', ' ')}</label>
                            <input
                                type="text"
                                name={field}
                                value={formData[field]}
                                placeholder={placeholder}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                            />
                            {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]}</p>}
                        </div>
                    ))}

                    {/* Dropdowns */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                        <Select options={batchOptions} value={batchOptions.find(o => o.value === formData.batch)} onChange={o => setFormData(prev => ({ ...prev, batch: o?.value || '' }))} />
                        {errors.batch && <p className="text-red-500 text-xs mt-1">{errors.batch}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Branch</label>
                        <Select options={branchOptions} value={branchOptions.find(o => o.value === formData.branch)} onChange={o => setFormData(prev => ({ ...prev, branch: o?.value || '' }))} />
                        {errors.branch && <p className="text-red-500 text-xs mt-1">{errors.branch}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">College</label>
                        <Select options={collegeOptions} value={collegeOptions.find(o => o.value === formData.college)} onChange={o => setFormData(prev => ({ ...prev, college: o?.value || '' }))} />
                        {errors.college && <p className="text-red-500 text-xs mt-1">{errors.college}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                        <Select options={educationOptions} value={educationOptions.find(o => o.value === formData.education)} onChange={o => setFormData(prev => ({ ...prev, education: o?.value || '' }))} />
                    </div>
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea name="description" rows={4} placeholder="Brief description (max 500 chars)" value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500" />
                    {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
                </div>

                {/* Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image</label>
                        <div className="flex items-center gap-4">
                            <input type="file" accept="image/*" id="imageUpload" className="hidden" onChange={(e) => handleFileChange(e, 'image')} />
                            <label htmlFor="imageUpload" className="cursor-pointer px-4 py-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 text-sm">Select Image</label>
                            {image && <span className="text-sm text-gray-600 truncate max-w-[150px]">{image.name}</span>}
                        </div>
                        {image && <div className="mt-3"><img src={URL.createObjectURL(image)} alt="Profile" className="h-24 w-24 rounded object-cover border" /></div>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Resume (PDF)</label>
                        <div className="flex items-center gap-4">
                            <input type="file" accept=".pdf" name="resume" id="resumeUpload" className="hidden" ref={resumeRef} onChange={(e) => handleFileChange(e, 'resume')} />
                            <label htmlFor="resumeUpload" className="cursor-pointer px-4 py-2 bg-green-100 text-green-600 rounded hover:bg-green-200 text-sm">Upload Resume</label>
                            {resume && <span className="text-sm text-gray-600 truncate max-w-[150px]">{resume.name}</span>}
                        </div>
                    </div>
                </div>

                {/* Buttons */}
                <div className="flex items-center gap-4">
                    <button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50">
                        {loading ? 'Submitting...' : 'Register'}
                    </button>
                    <button type="button" onClick={() => {
                        setFormData({
                            name: '', email: '', phone: '', batch: '', branch: '', college: '',
                            gpa: '', location: '', education: '', expected_salary: '', experience_years: '', description: ''
                        });
                        setImage(null);
                        setResume(null);
                        setErrors({});
                        if (resumeRef.current) resumeRef.current.value = '';
                    }} className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded">Reset</button>
                </div>
            </form>
        </div>
    );
}
