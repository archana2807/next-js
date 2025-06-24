'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../../utils/AuthContext';
import { showToast } from '../../utils/toastUtils'; // adjust path as needed

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errors, setErrors] = useState({});
    const router = useRouter();
    const { refreshAuth } = useAuth();
    const validate = () => {
        const newErrors = {};
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) newErrors.email = 'Email is required';
        else if (!emailRegex.test(email)) newErrors.email = 'Invalid email format';

        if (!password) newErrors.password = 'Password is required';
        else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                document.cookie = `token=${data.token}; path=/`;
                document.cookie = `user=${JSON.stringify(data.user)}; path=/`;
                await refreshAuth();
                showToast('Login successful!', 'success');
                router.push('/dashboard');
            } else {
                setErrors({ form: data.message || 'Login failed' });
            }
        } catch (error) {
            console.error('Login error:', error);
            setErrors({ form: 'Server error. Please try again.' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="w-full max-w-md bg-white p-6 rounded shadow">
                <h2 className="text-2xl font-bold mb-4 text-center text-gray-700">Login</h2>

                {errors.form && (
                    <p className="text-red-500 text-sm mb-4 text-center">{errors.form}</p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => {
                                setEmail(e.target.value);
                                setErrors(prev => ({ ...prev, email: '' }));
                            }}
                            placeholder="Enter your email"
                            className={`w-full p-2 border rounded ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => {
                                setPassword(e.target.value);
                                setErrors(prev => ({ ...prev, password: '' }));
                            }}
                            placeholder="Enter your password"
                            className={`w-full p-2 border rounded ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.password && (
                            <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
