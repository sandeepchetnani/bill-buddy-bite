
import React, { useState } from 'react';
import { BillProvider } from '../context/BillContext';
import TransactionsList from '../components/TransactionsList';
import BillCreator from '../components/BillCreator';
import { Button } from '../components/ui/button';
import { useBill } from '../context/BillContext';
import { restaurantInfo } from '../data/mockData';

const IndexContent = () => {
  const [showBillCreator, setShowBillCreator] = useState(false);
  const { transactions, isLoading, error } = useBill();
  
  return (
    <div className="min-h-screen bg-gray-50">
      {!showBillCreator ? (
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
            <Button
              onClick={() => setShowBillCreator(true)}
              className="bg-restaurant-primary hover:bg-restaurant-secondary"
              size="lg"
            >
              Create New Bill
            </Button>
          </div>

          <TransactionsList 
            transactions={transactions} 
            isLoading={isLoading}
            error={error}
          />
        </div>
      ) : (
        <BillCreator onBack={() => setShowBillCreator(false)} />
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
