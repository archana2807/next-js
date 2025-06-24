import { useEffect, useState } from 'react';

// export function useOptionalClientAuth() {
//   const [token, setToken] = useState(null);
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     async function fetchMe() {
//       try {
//         const res = await fetch('/api/me');
//         if (res.ok) {
//           const data = await res.json();
//           setToken(data.token);
//           setUser(data.user);
//         }
//       } catch (err) {
//         console.error('Auth fetch error:', err);
//       } finally {
//         setLoading(false);
//       }
//     }
//     fetchMe();
//   }, []);

//   return { token, user, loading };
// }
