'use client';
import { useEffect, useState } from 'react';
import LoadingMessage from './LoadingMessage';

export default function ResumeModal({ isOpen, onClose, resumeUrl }) {
    const [loading, setLoading] = useState(true);

    // ESC key to close
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('keydown', handleEsc);
        return () => document.removeEventListener('keydown', handleEsc);
    }, [onClose]);

    // Reset loading state when resume changes
    useEffect(() => {
        setLoading(true);
    }, [resumeUrl]);

    // ✅ Now safely return null after hooks are declared
    if (!isOpen || !resumeUrl) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="relative w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-gray-600 hover:text-red-600 text-2xl font-bold focus:outline-none"
                    aria-label="Close"
                >
                    ×
                </button>

                {/* Modal Header */}
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Resume Preview</h2>
                </div>

                {/* Modal Body */}
                <div className="relative w-full  h-[70vh] bg-white rounded-lg shadow-lg overflow-hidden">
                    {loading && (
                        <div className="absolute inset-0 z-10 bg-white bg-opacity-70 flex items-center justify-center">
                            <LoadingMessage text="Loading resume..." />
                        </div>
                    )}
                    <iframe
                        src={resumeUrl}
                        title="Resume"
                        className="w-full h-full border rounded-md shadow-inner relative z-0"
                        onLoad={() => setLoading(false)}
                    />
                </div>


                {/* Modal Footer */}
                <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
                    <a
                        href={resumeUrl}
                        download
                        className="bg-blue-600 text-white text-sm px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        Download Resume
                    </a>
                    <button
                        onClick={onClose}
                        className="bg-gray-200 text-gray-800 text-sm px-4 py-2 rounded hover:bg-gray-300 transition"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
}
