'use client';

import { useState } from 'react';
import { showToast } from '../utils/toastUtils'; // adjust path
import { toast } from 'react-toastify';
import { useSearchParams } from 'next/navigation';
import { useRef } from 'react';

export default function RegisterCandidate() {

    const resumeRef = useRef(null);
    const [formData, setFormData] = useState({
        name: '', email: '', phone: '', batch: '', branch: '', college: '',
        gpa: '', location: '', education: '', expected_salary: '', experience_years: '', description: ''
    });
    const searchParams = useSearchParams();
    const jobId = searchParams.get('jobId');
    const [image, setImage] = useState(null);
    const [resume, setResume] = useState(null);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

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
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleFileChange = (e, type) => {
        const file = e.target.files[0];
        if (type === 'image') setImage(file);
        else if (type === 'resume') setResume(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log('Image before submission:', image);
        if (!validate()) return;

        setLoading(true);
        const body = new FormData();
        Object.entries(formData).forEach(([key, val]) => body.append(key, val));
        // if (image) body.append('image', image);
        if (resume) body.append('resume', resume);
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
        <div className="max-w-2xl mx-auto p-6 bg-white shadow rounded">
            <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">Register Candidate</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-4">

                {/* Text Inputs with placeholders */}
                {[
                    ['name', 'Full Name'], ['email', 'Email Address'], ['phone', 'Phone Number'],
                    ['batch', 'e.g. 2023'], ['branch', 'e.g. Computer Science'], ['college', 'e.g. IIT Delhi'],
                    ['gpa', 'e.g. 8.5'], ['location', 'e.g. Bangalore'], ['education', 'e.g. B.Tech'],
                    ['expected_salary', 'e.g. 600000'], ['experience_years', 'e.g. 2']
                ].map(([field, placeholder]) => (
                    <div key={field}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace('_', ' ')}</label>
                        <input
                            type="text"
                            name={field}
                            value={formData[field]}
                            placeholder={placeholder}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
                    </div>
                ))}

                {/* Description with placeholder */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea
                        name="description"
                        placeholder="Brief description or profile summary (max 500 characters)"
                        value={formData.description}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>

                {/* File Inputs */}
                {/* <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Image</label>
                    <input type="file" accept="image/*" name="image" onChange={e => handleFileChange(e, 'image')} />
                </div> */}

                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
                    <input type="file" accept=".pdf" ref={resumeRef} name="resume" onChange={e => handleFileChange(e, 'resume')} />
                </div>

                {/* Submit and Reset Buttons */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded disabled:opacity-50"
                    >
                        {loading ? 'Submitting...' : 'Register'}
                    </button>
                    <button
                        type="button"
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded"
                        onClick={() => {
                            setFormData({
                                name: '', email: '', phone: '', batch: '', branch: '', college: '',
                                gpa: '', location: '', education: '', expected_salary: '', experience_years: '', description: ''
                            });
                            setImage(null);
                            setResume(null);
                            setErrors({});
                            if (resumeRef.current) resumeRef.current.value = '';
                        }}
                    >
                        Reset
                    </button>
                </div>
            </form>
        </div>
    );
}
