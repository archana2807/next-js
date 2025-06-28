
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { showToast } from '../utils/toastUtils';

export default function Navbar() {
    const router = useRouter();
    const pathname = usePathname();
    const { data: session, status } = useSession();
    const dropdownRef = useRef(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    console.log('SESSION CLIENT:', session);
    const user = session?.user;
    const isAuthenticated = !!session;

    const guestLinks = [
        { href: '/dashboard', label: 'Home' },
        { href: '/jobs', label: 'Jobs' },
        { href: '/register-candidate', label: 'Candidate Register' },
    ];

    const authLinks = [
        ...guestLinks,
        { href: '/saved-candidates', label: 'Saved Candidates' },
        { href: '/candidates', label: 'Candidates' },
    ];

    const linksToShow = isAuthenticated ? authLinks : guestLinks;



    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setDropdownOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/auth/login", // redirects after logout
            redirect: true,
        });
    };



    if (status === 'loading') return null;

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    <Link href="/dashboard" className="text-2xl font-semibold text-indigo-600">
                        Candidate Portal
                    </Link>

                    <div className="flex items-center gap-6">
                        {linksToShow.map((link) => (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`px-3 py-2 rounded-md text-sm font-medium transition ${pathname === link.href
                                    ? 'bg-indigo-100 text-indigo-700'
                                    : 'text-gray-600 hover:text-indigo-600'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}

                        <div className="relative" ref={dropdownRef}>
                            <button
                                onClick={() => setDropdownOpen(!dropdownOpen)}
                                className="flex items-center gap-2 px-3 py-1 rounded-md border border-gray-300 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm"
                            >
                                <div className="w-8 h-8 flex items-center justify-center rounded-full bg-indigo-200 text-indigo-800 font-bold uppercase">
                                    {isAuthenticated ? user?.name?.charAt(0) : 'G'}
                                </div>
                                <span className="hidden sm:block">
                                    {isAuthenticated ? user?.name : 'Guest'}
                                </span>
                                <svg
                                    className="w-4 h-4"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {dropdownOpen && (
                                <div className="absolute right-0 mt-2 w-44 bg-white border rounded-md shadow-lg z-50">
                                    {isAuthenticated ? (
                                        <>
                                            <Link
                                                href="/profile"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Profile
                                            </Link>
                                            <Link
                                                href="/settings"
                                                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            >
                                                Settings
                                            </Link>
                                            <button
                                                onClick={handleLogout}
                                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                            >
                                                Logout
                                            </button>
                                        </>
                                    ) : (
                                        <Link
                                            href="/auth/login"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        >
                                            Login
                                        </Link>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

