
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types/waiter';

interface AuthContextType {
  isLoggedIn: boolean;
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: () => boolean;
  isWaiter: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Static credentials for demo
const ADMIN_CREDENTIALS = { username: "thebasefour", password: "thebasefour98", role: "admin" as const };
const WAITER_CREDENTIALS = { username: "waiter", password: "waiter123", role: "waiter" as const };

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  
  useEffect(() => {
    // Check if user is logged in on mount
    const loggedInStatus = localStorage.getItem('isLoggedIn') === 'true';
    const savedUser = localStorage.getItem('user');
    
    if (loggedInStatus && savedUser) {
      setIsLoggedIn(true);
      setUser(JSON.parse(savedUser));
    }
  }, []);
  
  const login = async (username: string, password: string): Promise<boolean> => {
    // Check admin credentials
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      const adminUser: User = {
        id: '1',
        name: 'Admin',
        role: ADMIN_CREDENTIALS.role
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(adminUser));
      setIsLoggedIn(true);
      setUser(adminUser);
      return true;
    }
    
    // Check waiter credentials
    if (username === WAITER_CREDENTIALS.username && password === WAITER_CREDENTIALS.password) {
      const waiterUser: User = {
        id: '2',
        name: 'Waiter',
        role: WAITER_CREDENTIALS.role
      };
      
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('user', JSON.stringify(waiterUser));
      setIsLoggedIn(true);
      setUser(waiterUser);
      return true;
    }
    
    return false;
  };
  
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
  };
  
  const isAdmin = () => {
    return user?.role === 'admin';
  };
  
  const isWaiter = () => {
    return user?.role === 'waiter';
  };
  
  return (
    <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isAdmin, isWaiter }}>
      {children}
    </AuthContext.Provider>
  );
};
