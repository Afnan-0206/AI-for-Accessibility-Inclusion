import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  login as apiLogin,
  register as apiRegister,
  getMe as apiGetMe,
  getStoredToken,
  getStoredUser,
  setStoredAuth,
  clearStoredAuth,
} from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from local storage and verify
  useEffect(() => {
    async function initAuth() {
      try {
        const storedToken = getStoredToken();
        const storedUser = getStoredUser();

        if (storedToken) {
          setToken(storedToken);
          if (storedUser) {
            setUser(storedUser);
          }
          // Optionally verify with getMe()
          try {
            const me = await apiGetMe();
            if (me) {
              setUser(me);
              setStoredAuth(storedToken, me);
            }
          } catch (meErr) {
            console.warn('Could not refresh user profile, keeping stored session:', meErr);
          }
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        clearStoredAuth();
        setToken(null);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    setLoading(true);
    try {
      const res = await apiLogin({ email, password });
      setToken(res.token);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const register = useCallback(async (name, email, password) => {
    setLoading(true);
    try {
      const res = await apiRegister({ name, email, password });
      setToken(res.token);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setToken(null);
    setUser(null);
  }, []);

  const value = {
    user,
    token,
    loading,
    isAuthenticated: Boolean(token),
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
