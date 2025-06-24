'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  
    async function refreshAuth() {
      try {
        const res = await fetch('/api/me', {
          method: 'GET',
          credentials: 'include', // Include cookies
        });

        const data = await res.json();
        if (res.ok) {
          setUser(data.user);
          setToken(data.token);
        } else {
          setUser(null);
        }
      } catch (err) {
        console.error('Auth fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
useEffect(() => {
    refreshAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, setUser, setToken, refreshAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
