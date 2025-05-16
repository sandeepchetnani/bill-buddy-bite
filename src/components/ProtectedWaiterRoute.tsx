
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedWaiterRouteProps {
  children: React.ReactNode;
}

const ProtectedWaiterRoute: React.FC<ProtectedWaiterRouteProps> = ({ children }) => {
  const { isLoggedIn, isWaiter, isAdmin } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  // Allow both admin and waiter roles to access
  if (!isWaiter() && !isAdmin()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedWaiterRoute;
