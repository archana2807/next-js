// src/components/DataTable.jsx
'use client';
import { useState } from 'react';
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    flexRender,
} from '@tanstack/react-table';
import LoadingSpinner from '../components/LoadingSpinner';
import NoDataFound from '../components/NoDataFound';

export default function DataTable({
    data = [],
    columns,
    isLoading = false,
    loadingText = 'Loading...'
}) {
    const [globalFilter, setGlobalFilter] = useState('');
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const table = useReactTable({
        data,
        columns,
        state: {
            globalFilter,
        },
        onGlobalFilterChange: setGlobalFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: {
            pagination: {
                pageSize: rowsPerPage,
            },
        },
    });

    return (
        <div className="space-y-4">
            {/* Loading State */}
            {isLoading ? (
                <LoadingSpinner text="Fetching candidate details..." />
            ) : (
                <>
                    {/* Search and Rows Per Page Controls */}
                    {data.length > 0 && (
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                            <div className="relative flex-1">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    placeholder="Search..."
                                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                    value={globalFilter}
                                    onChange={(e) => setGlobalFilter(e.target.value)}
                                    disabled={isLoading}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Show:</span>
                                <select
                                    className="border border-gray-300 rounded-md px-3 py-1.5 text-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 disabled:opacity-50"
                                    value={rowsPerPage}
                                    onChange={(e) => {
                                        setRowsPerPage(Number(e.target.value));
                                        table.setPageSize(Number(e.target.value));
                                    }}
                                    disabled={isLoading}
                                >
                                    {[5, 10, 20, 50, 100].map((size) => (
                                        <option key={size} value={size}>{size}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    )}

                    {/* Table Content */}
                    <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                {table.getHeaderGroups().map((headerGroup) => (
                                    <tr key={headerGroup.id}>
                                        {headerGroup.headers.map((header) => (
                                            <th
                                                key={header.id}
                                                scope="col"
                                                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map((row) => (
                                        <tr key={row.id} className="hover:bg-gray-50">
                                            {row.getVisibleCells().map((cell) => (
                                                <td key={cell.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={columns.length} className="px-6 py-4 text-center text-sm text-gray-500">
                                            <NoDataFound message="No data found." />
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-gray-50 border-t border-gray-200">
                        <div className="text-sm text-gray-700 mb-4 sm:mb-0">
                            Showing{' '}
                            <span className="font-medium">
                                {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}
                            </span>{' '}
                            to{' '}
                            <span className="font-medium">
                                {Math.min(
                                    (table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize,
                                    table.getFilteredRowModel().rows.length
                                )}
                            </span>{' '}
                            of{' '}
                            <span className="font-medium">
                                {table.getFilteredRowModel().rows.length}
                            </span>{' '}
                            results
                        </div>

                        <div className="flex space-x-1">
                            <button
                                onClick={() => table.setPageIndex(0)}
                                disabled={!table.getCanPreviousPage()}
                                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                First
                            </button>
                            <button
                                onClick={() => table.previousPage()}
                                disabled={!table.getCanPreviousPage()}
                                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Previous
                            </button>
                            <button
                                onClick={() => table.nextPage()}
                                disabled={!table.getCanNextPage()}
                                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Next
                            </button>
                            <button
                                onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                                disabled={!table.getCanNextPage()}
                                className="px-3 py-1 border rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Last
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
