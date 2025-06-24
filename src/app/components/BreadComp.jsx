'use client';

import Link from 'next/link';
import { ChevronRightIcon } from '@heroicons/react/20/solid';

export default function BreadComp({ title = '', items = [] }) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            {/* Page Title */}
            {title && <h1 className="text-xl font-semibold text-gray-800 mb-2 sm:mb-0">{title}</h1>}

            {/* Breadcrumb Trail */}
            <nav className="text-sm text-gray-600" aria-label="Breadcrumb">
                <ol className="flex items-center space-x-1">
                    {items.map((item, index) => (
                        <li key={index} className="flex items-center">
                            {index !== 0 && (
                                <ChevronRightIcon className="h-4 w-4 text-gray-400 mx-1" />
                            )}
                            {item.href ? (
                                <Link href={item.href} className="hover:underline text-indigo-600">
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="text-gray-500">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
        </div>
    );
}
