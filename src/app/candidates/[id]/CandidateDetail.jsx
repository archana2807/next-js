'use client';

import React from 'react';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';
import ResumeModal from '../../components/ResumeModal';
import { useState } from 'react';

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
    } = candidate;
    const [isModalOpen, setIsModalOpen] = useState(false);
    return (
        <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md space-y-6">
            {/* Header */}
            <div className="flex items-start gap-6">
                {image ? (
                    <img src={image} alt={name} className="w-24 h-24 object-cover rounded-full border" />
                ) : (
                    <div className="w-24 h-24 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full border font-bold text-3xl uppercase">
                        {name?.charAt(0) || '?'}
                    </div>
                )}
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">{name}</h1>
                    <p className="text-gray-600">{email}</p>
                    <p className="text-gray-600">{phone}</p>
                    <p className="text-gray-600">{location}</p>
                </div>
            </div>

            {/* Summary */}
            <div className="space-y-1">
                <p><strong>Education:</strong> {education}</p>
                <p><strong>College:</strong> {college} ({branch}, {batch})</p>
                <p><strong>GPA:</strong> {gpa}</p>
                <p><strong>Experience:</strong> {experience_years}</p>
                <p><strong>Expected Salary:</strong> {expected_salary}</p>
                {description && <p className="text-gray-700"><strong>About:</strong> {description}</p>}
            </div>

            {/* Skills */}
            {skills?.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Skills</h2>
                    <div className="flex flex-wrap gap-2">
                        {skills.map(skill => (
                            <span key={skill} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                {skill}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Experience */}
            {experience?.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Experience</h2>
                    {experience.map((exp, idx) => (
                        <div key={idx} className="mb-3">
                            <p className="font-semibold text-gray-800">{exp.role} @ {exp.company}</p>
                            <p className="text-sm text-gray-600 italic">{exp.duration}</p>
                            <p className="text-sm text-gray-700 mt-1">{exp.description}</p>
                        </div>
                    ))}
                </div>
            )}

            {/* Projects */}
            {projects?.length > 0 && (
                <div>
                    <h2 className="text-lg font-semibold mb-2">Projects</h2>
                    {projects.map((project, idx) => (
                        <div key={idx} className="mb-3">
                            <p className="font-semibold text-gray-800">{project.name}</p>
                            <p className="text-sm text-gray-700">{project.description}</p>
                            <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-600 hover:underline text-sm mt-1">
                                <FaGithub className="mr-1" /> View Project
                            </a>
                        </div>
                    ))}
                </div>
            )}

            {/* Optional Links */}
            <div className="flex gap-4 pt-4 border-t mt-6">
                <a href={`https://linkedin.com/in/${name?.split(' ')[0]?.toLowerCase()}`} target="_blank" rel="noreferrer" className="text-blue-700 hover:underline flex items-center gap-1 text-sm">
                    <FaLinkedin /> LinkedIn
                </a>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    View Resume
                </button>

                <ResumeModal
                    isOpen={isModalOpen}
                    onClose={() => setIsModalOpen(false)}
                    resumeUrl="/archana_resume.pdf" // ✅ Use public path
                />
            </div>
        </div>
    );
};

export default CandidateDetail;
