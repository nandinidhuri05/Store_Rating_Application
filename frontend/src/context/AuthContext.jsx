import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/login', { email, password });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const register = async (name, email, password, address) => {
    const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password, address });
    localStorage.setItem('user', JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('user');
    sessionStorage.removeItem('adminBackup');
    setUser(null);
  };

  const loginAs = (targetUser) => {
    // Backup current admin if not already backup
    if (user && user.role === 'admin' && !sessionStorage.getItem('adminBackup')) {
      sessionStorage.setItem('adminBackup', JSON.stringify(user));
    }
    localStorage.setItem('user', JSON.stringify(targetUser));
    setUser(targetUser);
  };

  const returnToAdmin = () => {
    const backup = sessionStorage.getItem('adminBackup');
    if (backup) {
      const admin = JSON.parse(backup);
      localStorage.setItem('user', backup);
      setUser(admin);
      sessionStorage.removeItem('adminBackup');
    }
  };

  const updatePassword = async (password) => {
    const config = {
      headers: { Authorization: `Bearer ${user.token}` }
    };
    await axios.put('http://localhost:5000/api/auth/update-password', { password }, config);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updatePassword, loginAs, returnToAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};
