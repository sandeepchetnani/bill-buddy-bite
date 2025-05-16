
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedKitchenRouteProps {
  children: React.ReactNode;
}

const ProtectedKitchenRoute: React.FC<ProtectedKitchenRouteProps> = ({ children }) => {
  const { isLoggedIn, isKitchen } = useAuth();
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isKitchen()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedKitchenRoute;
