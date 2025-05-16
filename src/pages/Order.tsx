
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ShoppingBag, Save } from 'lucide-react';
import { useTables, TablesProvider } from '../context/TablesContext';
import OrderItems from '../components/order/OrderItems';
import MenuItemSelection from '../components/order/MenuItemSelection';
import { toast } from '@/components/ui/sonner';
import { formatCurrency } from '../utils/billUtils';

// Create a separate component for the Order content to use the useTables hook
const OrderContent = () => {
  const { currentTable, tableItems, clearCurrentTable, completeOrder } = useTables();
  const navigate = useNavigate();
  const [totalAmount, setTotalAmount] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // Redirect if no table is selected
    if (!currentTable) {
      navigate('/tables');
    }
  }, [currentTable, navigate]);
  
  useEffect(() => {
    if (currentTable) {
      const items = tableItems[currentTable.id] || [];
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      setTotalAmount(total);
    }
  }, [currentTable, tableItems]);
  
  const handleBack = () => {
    clearCurrentTable();
    navigate('/tables');
  };
  
  const handleCompleteOrder = async () => {
    if (!currentTable) return;
    
    if (tableItems[currentTable.id]?.length === 0) {
      toast.error('Cannot complete empty order');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await completeOrder();
      navigate('/tables');
    } catch (error) {
      console.error('Error completing order:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  if (!currentTable) {
    return null;
  }
  
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-7xl mx-auto py-4 px-4">
        <Button onClick={handleBack} variant="outline" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Tables
        </Button>
        
        <div className="flex flex-col md:flex-row gap-6">
          {/* Left side: Menu */}
          <div className="w-full md:w-7/12 lg:w-8/12">
            <div className="bg-white rounded-lg shadow p-4 mb-4">
              <h2 className="text-xl font-bold mb-2">
                Table {currentTable.block}{currentTable.number} - Order
              </h2>
              <p className="text-sm text-muted-foreground">
                Select items from the menu below to add to this order
              </p>
            </div>
            
            <MenuItemSelection />
          </div>
          
          {/* Right side: Current Order */}
          <div className="w-full md:w-5/12 lg:w-4/12">
            <div className="bg-white rounded-lg shadow p-4 sticky top-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold">Current Order</h2>
                <span className="text-sm text-muted-foreground">
                  Table {currentTable.block}{currentTable.number}
                </span>
              </div>
              
              <OrderItems />
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(totalAmount)}</span>
                </div>
                
                <Button 
                  className="w-full mt-4 bg-restaurant-primary hover:bg-restaurant-secondary"
                  onClick={handleCompleteOrder}
                  disabled={isSubmitting || tableItems[currentTable.id]?.length === 0}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  {isSubmitting ? 'Saving...' : 'Complete Order'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Order component that wraps OrderContent with TablesProvider
const Order = () => {
  return (
    <TablesProvider>
      <OrderContent />
    </TablesProvider>
  );
};

export default Order;
