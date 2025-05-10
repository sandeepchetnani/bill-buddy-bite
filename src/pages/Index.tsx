
import React, { useState, useEffect } from 'react';
import { BillProvider } from '../context/BillContext';
import TransactionsList from '../components/TransactionsList';
import BillCreator from '../components/BillCreator';
import TransactionHistory from '../components/TransactionHistory';
import MenuTable from '../components/MenuTable';
import { Button } from '../components/ui/button';
import { useBill } from '../context/BillContext';
import { restaurantInfo } from '../data/mockData';
import { toast } from "../components/ui/sonner";
import { History, LogOut, Menu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const IndexContent = () => {
  const [showBillCreator, setShowBillCreator] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [showMenuTable, setShowMenuTable] = useState(false);
  const { transactions, isLoading, error, isEditing, cancelEditing, currentEditingId } = useBill();
  const navigate = useNavigate();
  
  // Show bill creator when in editing mode
  useEffect(() => {
    if (isEditing) {
      setShowBillCreator(true);
      setShowTransactionHistory(false);
      setShowMenuTable(false);
    }
  }, [isEditing]);

  // Handler to go back, checking if in edit mode
  const handleBack = () => {
    if (isEditing) {
      cancelEditing();
    }
    setShowBillCreator(false);
  };

  const handleHistoryBack = () => {
    setShowTransactionHistory(false);
  };

  const handleMenuBack = () => {
    setShowMenuTable(false);
  };
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  // Toggle transaction history view
  const toggleTransactionHistory = () => {
    setShowTransactionHistory(prev => !prev);
    setShowBillCreator(false);
    setShowMenuTable(false);
    if (isEditing) {
      cancelEditing();
    }
  };
  
  // Toggle menu table view
  const toggleMenuTable = () => {
    setShowMenuTable(prev => !prev);
    setShowBillCreator(false);
    setShowTransactionHistory(false);
    if (isEditing) {
      cancelEditing();
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      {showTransactionHistory ? (
        <TransactionHistory onBack={handleHistoryBack} />
      ) : showMenuTable ? (
        <div>
          <div className="container max-w-7xl mx-auto pt-4">
            <Button onClick={handleMenuBack} variant="outline" className="mb-2">
              Back
            </Button>
          </div>
          <MenuTable />
        </div>
      ) : !showBillCreator ? (
        <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div>
              <h1 className="text-4xl font-bold text-restaurant-primary">
                {restaurantInfo.name}
              </h1>
              <p className="text-muted-foreground mt-1">
                Indian Restaurant Billing System
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                onClick={toggleMenuTable}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Menu className="h-4 w-4" />
                Menu Management
              </Button>
              <Button
                onClick={toggleTransactionHistory}
                variant="outline"
                className="flex items-center gap-1"
              >
                <History className="h-4 w-4" />
                Transaction History
              </Button>
              <Button
                onClick={() => setShowBillCreator(true)}
                className="bg-restaurant-primary hover:bg-restaurant-secondary"
                size="lg"
              >
                Create New Bill
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

          <TransactionsList 
            transactions={transactions} 
            isLoading={isLoading}
            error={error}
          />
        </div>
      ) : (
        <BillCreator 
          onBack={handleBack} 
          isEditing={isEditing}
          editingId={currentEditingId}
        />
      )}
    </div>
  );
};

const Index = () => {
  return (
    <BillProvider>
      <IndexContent />
    </BillProvider>
  );
};

export default Index;
