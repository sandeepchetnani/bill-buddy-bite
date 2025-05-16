
import React, { useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from '@/components/ui/sonner';

interface ProtectedKitchenRouteProps {
  children: React.ReactNode;
}

const ProtectedKitchenRoute: React.FC<ProtectedKitchenRouteProps> = ({ children }) => {
  const { isLoggedIn, isKitchen } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    if (isLoggedIn && !isKitchen()) {
      toast.error('Access denied. Kitchen staff only.');
    }
  }, [isLoggedIn, isKitchen]);
  
  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }
  
  if (!isKitchen()) {
    return <Navigate to="/" replace />;
  }
  
  return <>{children}</>;
};

export default ProtectedKitchenRoute;
