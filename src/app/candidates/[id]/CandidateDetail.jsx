'use client';

import React, { useState } from 'react';

import ResumeModal from '../../components/ResumeModal';
import { FaGithub } from 'react-icons/fa';
import { FaLinkedin } from 'react-icons/fa';
import { FaFileAlt } from 'react-icons/fa';
import { FaRegCopy } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa';

const CandidateDetail = ({ candidate }) => {
    const {
        name,
        email,
        phone,
        image,
        location,
        batch,
        branch,
        college,
        gpa,
        education,
        expected_salary,
        experience_years,
        description,
        skills,
        projects,
        experience,
        resume,
    } = candidate;

    const [isModalOpen, setIsModalOpen] = useState(false);
    const resumeUrl = `http://localhost/candidate_portal_api/${resume}`;
    const [copied, setCopied] = useState('');
    const handleCopy = async (text, type) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(type);
            setTimeout(() => setCopied(''), 2000);
        } catch (err) {
            console.error('Failed to copy!', err);
        }
    };
    return (
        <div className=" mx-auto p-6 bg-white shadow-md rounded-xl space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                {image ? (
                    <img src={`http://localhost/candidate_portal_api/${image}`} alt={name} className="w-20 h-20 rounded-full object-cover border" />
                ) : (
                    <div className="w-20 h-20 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full border shadow text-3xl font-bold uppercase">
                        {name?.charAt(0) || '?'}
                    </div>
                )}
                <div className="space-y-2">
                    <h1 className="text-2xl font-bold text-gray-800">{name}</h1>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {email}
                        <button onClick={() => handleCopy(email, 'email')} className="text-blue-500 hover:text-blue-700">
                            {copied === 'email' ? <FaCheck /> : <FaRegCopy />}
                        </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        {phone}
                        <button onClick={() => handleCopy(phone, 'phone')} className="text-blue-500 hover:text-blue-700">
                            {copied === 'phone' ? <FaCheck /> : <FaRegCopy />}
                        </button>
                    </div>

                    <p className="text-sm text-gray-600">{location}</p>
                </div>
            </div>

            {/* Summary */}
            <div className="space-y-2 text-sm text-gray-700">
                <p><strong>Education:</strong> {education}</p>
                <p><strong>College:</strong> {college} ({branch}, {batch})</p>
                <p><strong>GPA:</strong> {gpa}</p>
                <p><strong>Experience:</strong> {experience_years} year(s)</p>
                <p><strong>Expected Salary:</strong> ₹{expected_salary}</p>
                {description && <p><strong>About:</strong> {description}</p>}
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span
                                key={skill}
                                className="bg-blue-100 text-blue-800 text-xs px-3 py-1 rounded-full"
                            >
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Experience</h2>
                    <div className="space-y-3 text-sm">
                        {experience.map((exp, idx) => (
                            <div key={idx}>
                                <p className="font-semibold text-gray-800">{exp.role} @ {exp.company}</p>
                                <p className="text-gray-500 italic">{exp.duration}</p>
                                <p className="text-gray-700">{exp.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-2">Projects</h2>
                    <div className="space-y-3 text-sm">
                        {projects.map((project, idx) => (
                            <div key={idx}>
                                <p className="font-semibold">{project.name}</p>
                                <p className="text-gray-700">{project.description}</p>
                                {project.link && (
                                    <a
                                        href={project.link}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center text-blue-600 hover:underline text-sm mt-1"
                                    >
                                        <FaGithub className="mr-1" /> View Project
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Actions */}
            <div className="flex flex-wrap gap-4 pt-4 border-t mt-6">
                <a
                    href={`https://linkedin.com/in/${name?.split(' ')[0]?.toLowerCase()}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-700 hover:underline flex items-center gap-2 text-sm"
                >
                    <FaLinkedin /> LinkedIn
                </a>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded flex items-center gap-2"
                >
                    <FaFileAlt /> View Resume
                </button>
            </div>

            {/* Resume Modal */}
            <ResumeModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                resumeUrl={resumeUrl}
            />
        </div>
    );
};

export default CandidateDetail;
