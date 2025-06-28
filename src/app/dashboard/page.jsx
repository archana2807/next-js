'use client';


import { useRouter } from 'next/navigation';
import Link from 'next/link';
import DataTable from '../components/DataTable';
import { useAuth } from '../utils/AuthContext'; // Adjust path
export default function DashboardPage() {
    const router = useRouter();

    const { user, loading, setUser } = useAuth();
    const columns = [
        { accessorKey: 'name', header: 'Name', cell: info => info.getValue() },
        { accessorKey: 'title', header: 'Title', cell: info => info.getValue() },
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin h-10 w-10 rounded-full border-4 border-blue-500 border-t-transparent"></div>
            </div>
        );
    }

    return (
        <div className="px-4 py-8">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">Welcome to HirePortal 👋</h1>
                <p className="text-lg text-gray-600 max-w-xl mx-auto">
                    Discover top talent, manage candidates, and post jobs — all in one place.
                </p>

                {!user && (
                    <div className="mt-6">
                        <button
                            onClick={() => router.push('/auth/login')}
                            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition"
                        >
                            Login / Sign Up
                        </button>
                    </div>
                )}

                {user && (
                    <p className="mt-4 text-sm text-gray-500">
                        Logged in as <strong>{user?.name || 'User'}</strong>
                    </p>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <StatCard label="Total Candidates" value="1,200+" color="text-indigo-600" />
                <StatCard label="Companies Hiring" value="300+" color="text-green-600" />
                <StatCard label="Active Jobs" value="80+" color="text-blue-600" />
            </div>

            <div className="bg-white border rounded-lg shadow p-6 max-w-5xl mx-auto">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Sample Candidates</h2>
                <DataTable
                    data={[
                        { name: 'React Developer', title: '3 Yrs, React, JavaScript' },
                        { name: 'Backend Engineer', title: '4 Yrs, Node.js, MongoDB' },
                    ]}
                    columns={columns}
                    isLoading={false}
                />

                {!user && (
                    <div className="text-center mt-6">
                        <Link href="/auth/login" className="text-indigo-600 hover:underline">
                            Log in to view full candidate profiles →
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}

function StatCard({ href, label, value, color }) {
    const content = (
        <div className="bg-white border p-6 rounded-lg shadow hover:shadow-md transition">
            <p className="text-sm text-gray-500 mb-2">{label}</p>
            <p className={`text-2xl font-semibold ${color}`}>{value}</p>
        </div>
    );
    return href ? <Link href={href}>{content}</Link> : content;
}
