import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../lib/api';

const AuthContext = createContext();
export { AuthContext };

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('sipekaes_token');
    const storedUser = localStorage.getItem('sipekaes_user');
    if (token && storedUser) {
      setUser(JSON.parse(storedUser));
      // Verify token in background
      authApi.me().then(res => {
        setUser(res.data);
        localStorage.setItem('sipekaes_user', JSON.stringify(res.data));
      }).catch(() => {
        localStorage.removeItem('sipekaes_token');
        localStorage.removeItem('sipekaes_user');
        setUser(null);
      }).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (username, password) => {
    try {
      const res = await authApi.login(username, password);
      const { access_token, user: userData } = res.data;
      localStorage.setItem('sipekaes_token', access_token);
      localStorage.setItem('sipekaes_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true };
    } catch (err) {
      return { success: false, message: err.response?.data?.detail || 'Login gagal' };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sipekaes_token');
    localStorage.removeItem('sipekaes_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
