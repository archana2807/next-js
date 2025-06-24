import Navbar from './components/Navbar';
import Link from 'next/link';

export default function Home() {
  return (
    <>
     
      <main className="text-center py-12">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">
          Welcome to Candidate Discovery Portal
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover, evaluate, and connect with top talent for your organization.
        </p>
        <div className="flex justify-center gap-4">
          <Link
            href="/candidates"
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg text-lg transition"
          >
            Browse Candidates
          </Link>
          <Link
            href="/jobs"
            className="bg-white hover:bg-gray-100 text-gray-800 px-6 py-3 rounded-lg text-lg border border-gray-300 transition"
          >
            Post a Job
          </Link>
        </div>
      </main>
    </>
  );
}




