'use client';

import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="bg-gray-100 text-gray-700 border-t ">
            <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-sm text-center md:text-left">
                    © {new Date().getFullYear()} Candidate Discovery Portal. All rights reserved.
                </p>

                <div className="flex gap-4 text-sm">
                    <Link href="/privacy" className="hover:text-indigo-600 transition">
                        Privacy Policy
                    </Link>
                    <Link href="/terms" className="hover:text-indigo-600 transition">
                        Terms of Service
                    </Link>
                    <Link href="/contact" className="hover:text-indigo-600 transition">
                        Contact
                    </Link>
                </div>
            </div>
        </footer>
    );
}
