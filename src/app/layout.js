




import '../styles/globals.css';
import { Inter } from 'next/font/google';
import { SessionProvider } from 'next-auth/react';
import Navbar from './components/Navbar';

import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
import 'react-toastify/dist/ReactToastify.css';
import AuthProvider from './providers/SessionProvider';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
           
          <Navbar />
          <main className="container py-8 max-w-7xl mx-auto px-4 flex-grow">
            {children}
          </main>
          <Footer />
            <ToastContainer />
           
        </AuthProvider>
      </body>
    </html>
  );
}

