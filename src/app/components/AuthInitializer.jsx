'use client';

import { useEffect, useState } from 'react';

export default function AuthInitializer() {
    const [auth, setAuth] = useState({ user: null, token: null });

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const user = JSON.parse(localStorage.getItem('user'));
            const token = localStorage.getItem('token');
            if (user && token) {
                setAuth({ user, token });
            }
        }
    }, []);

    // You can do whatever you want with auth here, or pass it via context

    return null; // Or return some UI if needed
}
