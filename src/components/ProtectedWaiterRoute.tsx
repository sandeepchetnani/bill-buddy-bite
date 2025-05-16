
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedWaiterRouteProps {
  children: React.ReactNode;
}

const ProtectedWaiterRoute: React.FC<ProtectedWaiterRouteProps> = ({ children }) => {
  const { isLoggedIn, isWaiter } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isWaiter()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedWaiterRoute;
