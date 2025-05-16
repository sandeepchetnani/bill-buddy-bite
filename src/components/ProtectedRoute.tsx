
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isLoggedIn, isAdmin } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isAdmin()) {
    return <Navigate to="/tables" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedRoute;
