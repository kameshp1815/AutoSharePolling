// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    setUser(null);
  };

  const isAuthenticated = () => !!user;

  const isDriver = () => user?.role === 'driver';

  const isCustomer = () => user?.role === 'customer';

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated, isDriver, isCustomer }}
    >
      {children}
    </AuthContext.Provider>
  );
};
