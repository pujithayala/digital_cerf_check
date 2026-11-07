import React, { createContext, useContext, useState } from 'react';
import { api } from '../services/api';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('certiverify_token') || '';
    } catch {
      return '';
    }
  });

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('certiverify_user') || 'null');
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const data = await api.login(username, password);
      const authToken = data.token;
      const authUser = {
        adminId: data.adminId,
        username: data.username,
        email: data.email,
        role: data.role,
      };
      setToken(authToken);
      setUser(authUser);
      try {
        localStorage.setItem('certiverify_token', authToken);
        localStorage.setItem('certiverify_user', JSON.stringify(authUser));
      } catch {}
      return { success: true };
    } catch (err) {
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken('');
    setUser(null);
    try {
      localStorage.removeItem('certiverify_token');
      localStorage.removeItem('certiverify_user');
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated: !!token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
