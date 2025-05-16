
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LogOut } from 'lucide-react';
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
      <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-restaurant-primary">
              {restaurantInfo.name} - Table Management
            </h1>
            <p className="text-muted-foreground">Select a table to create or manage orders</p>
          </div>
          <Button
            onClick={handleLogout}
            variant="outline"
            className="flex items-center gap-1"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        
        <Card>
          <CardContent className="p-4 md:p-6">
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
