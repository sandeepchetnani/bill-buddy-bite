
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Tables from "./pages/Tables";
import Order from "./pages/Order";
import OrdersAdmin from "./pages/OrdersAdmin";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedWaiterRoute from "./components/ProtectedWaiterRoute";
import { AuthProvider } from "./context/AuthContext";

const queryClient = new QueryClient();

// Get the base URL based on environment
const getBaseUrl = () => {
  if (import.meta.env.MODE === 'production') {
    return '/bill-buddy-bite/';
  }
  return '/';
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter basename={getBaseUrl()}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/" 
              element={
                <ProtectedRoute>
                  <Index />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/tables" 
              element={
                <ProtectedWaiterRoute>
                  <Tables />
                </ProtectedWaiterRoute>
              } 
            />
            <Route 
              path="/order" 
              element={
                <ProtectedWaiterRoute>
                  <Order />
                </ProtectedWaiterRoute>
              } 
            />
            <Route 
              path="/orders-admin" 
              element={
                <ProtectedWaiterRoute>
                  <OrdersAdmin />
                </ProtectedWaiterRoute>
              } 
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
