import React, { createContext, useContext, useState, useEffect } from 'react';
import { USERS } from '../mock/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('sipekaes_user');
    if (stored) setUser(JSON.parse(stored));
    setLoading(false);
  }, []);

  const login = (username, password) => {
    const found = USERS.find(u => u.username === username && u.password === password);
    if (found) {
      const { password: _, ...safe } = found;
      setUser(safe);
      localStorage.setItem('sipekaes_user', JSON.stringify(safe));
      return { success: true };
    }
    return { success: false, message: 'Username atau password salah' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('sipekaes_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
