import { useState, createContext, useEffect } from 'react';

export const AuthContext = createContext();

const USER_KEY = 'user';
const TOKEN_KEY = 'token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let storedToken = null;

    try {
      const storedUser = localStorage.getItem(USER_KEY);
      storedToken = localStorage.getItem(TOKEN_KEY);

      if (storedUser && storedToken) {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else {
        // Incomplete/stale data: make sure we are really logged out.
        localStorage.removeItem(USER_KEY);
        localStorage.removeItem(TOKEN_KEY);
        storedToken = null;
      }
    } catch {
      // Corrupted JSON in localStorage
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      storedToken = null;
    } finally {
      setLoading(false);
    }

    // The token in localStorage may be expired/revoked (or belong to another
    // backend). Validate it against the API and log out if it is rejected.
    // Network errors (e.g. a sleeping server) keep the session as is.
    if (storedToken) {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';
      fetch(`${API_URL}/user`, {
        headers: { Authorization: `Bearer ${storedToken}`, Accept: 'application/json' },
      })
        .then((res) => {
          if (cancelled) return;
          if (res.status === 401 || res.status === 403) {
            setUser(null);
            setToken(null);
            localStorage.removeItem(USER_KEY);
            localStorage.removeItem(TOKEN_KEY);
          }
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
    };
  }, []);

  const login = (userData, userToken) => {
    setUser(userData);
    setToken(userToken);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    localStorage.setItem(TOKEN_KEY, userToken);
  };

  const updateUser = (partialUser) => {
    setUser((prev) => {
      const next = { ...prev, ...partialUser };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{ user, token, login, logout, updateUser, loading, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};