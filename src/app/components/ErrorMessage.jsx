'use client';

import { AlertTriangle } from 'lucide-react';

export default function ErrorMessage({ message, onRetry }) {
    return (
        <div className="flex flex-col items-center justify-center mt-16 px-6 py-6 bg-red-50 border border-red-300 text-red-700 rounded-xl max-w-xl mx-auto shadow-md">
            <div className="flex items-center space-x-3">
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <h2 className="text-lg font-semibold">Oops! Something went wrong</h2>
            </div>

            <p className="mt-4 text-center text-sm">
                {message || 'An unexpected error occurred.'}
            </p>

            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-6 px-6 py-2 text-sm font-medium bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                    Retry
                </button>
            )}
        </div>
    );
}
