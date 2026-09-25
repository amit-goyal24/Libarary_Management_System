import React, { createContext, useContext, useState, useEffect } from 'react';
import { getObject, getData } from '../utils/localStorage';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('currentUser');
    if (loggedInUser) {
      setUser(JSON.parse(loggedInUser));
    }
    setLoading(false);
  }, []);

  const login = (email, password) => {
    // Check Admin first
    const users = getData('users');
    const admin = users.find(u => u.email === email && u.password === password && u.role === 'admin');
    if (admin) {
      const userData = { ...admin, role: 'admin' };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true, role: 'admin' };
    }

    // Check Student
    const students = getData('students');
    const student = students.find(s => s.email === email && s.password === password);
    if (student) {
      const userData = { ...student, role: 'student' };
      setUser(userData);
      localStorage.setItem('currentUser', JSON.stringify(userData));
      return { success: true, role: 'student' };
    }

    return { success: false, message: 'Invalid email or password' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateProfile = (newData) => {
    const updatedUser = { ...user, ...newData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    login,
    logout,
    updateProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
