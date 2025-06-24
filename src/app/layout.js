



import { AuthProvider } from './utils/AuthContext';
import '../styles/globals.css';
import { Inter } from 'next/font/google';

import Navbar from './components/Navbar';
import AuthInitializer from './components/AuthInitializer';
import { ToastContainer } from 'react-toastify';
import Footer from './components/Footer';
import 'react-toastify/dist/ReactToastify.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <Navbar />
          <main className="container py-8 max-w-7xl mx-auto px-4">
            {children}
          </main>
          <Footer />
          <ToastContainer />
        </AuthProvider>
      </body>
    </html>
  );
}

