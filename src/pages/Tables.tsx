
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut, ClipboardList } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { TablesProvider, useTables } from '../context/TablesContext';
import TableGrid from '../components/tables/TableGrid';
import { restaurantInfo } from '../data/mockData';
import { toast } from '@/components/ui/sonner';

const TablesContent = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  
  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully');
    navigate('/login');
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-5xl mx-auto py-4 px-2 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-3 sm:items-center mb-4 sm:mb-6">
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-restaurant-primary">
              {restaurantInfo.name}
            </h1>
            <p className="text-sm text-muted-foreground">Select a table to create or manage orders</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => navigate('/orders-admin')}
              variant="outline"
              className="flex items-center gap-1"
            >
              <ClipboardList className="h-4 w-4 mr-1" />
              Orders
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="flex items-center gap-1"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        
        <Card>
          <CardContent className="p-3 md:p-6">
            <TableGrid />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

const Tables = () => {
  return (
    <TablesProvider>
      <TablesContent />
    </TablesProvider>
  );
};

export default Tables;
