import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginService } from '../services/userService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email, password) => {
    const user = await loginService(email, password);
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      return user;
    }
    return null;
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
