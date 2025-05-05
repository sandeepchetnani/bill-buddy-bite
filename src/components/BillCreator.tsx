
import React, { useState } from 'react';
import { Button } from '../components/ui/button';
import ItemSearch from './ItemSearch';
import ItemsList from './ItemsList';
import { useBill } from '../context/BillContext';
import { MenuItem, menuItems } from '../data/mockData';
import { formatCurrency } from '../utils/billUtils';
import BillPreview from './BillPreview';
import { toast } from "../components/ui/sonner";

interface BillCreatorProps {
  onBack: () => void;
}

const BillCreator: React.FC<BillCreatorProps> = ({ onBack }) => {
  const [filteredItems, setFilteredItems] = useState<MenuItem[]>(menuItems);
  const [showPreview, setShowPreview] = useState(false);
  const [currentBill, setCurrentBill] = useState<any>(null);
  
  const { currentItems, finalizeBill } = useBill();
  
  const handleSearch = (items: MenuItem[]) => {
    setFilteredItems(items);
  };

  const handleCreateBill = () => {
    if (currentItems.length === 0) {
      toast.error("Please add items to the bill first");
      return;
    }
    
    const bill = finalizeBill();
    setCurrentBill(bill);
    setShowPreview(true);
    toast.success(`Bill #${bill.billNumber} created successfully`);
  };
  
  const total = currentItems.reduce(
    (sum, item) => sum + item.price * item.quantity, 
    0
  );
  
  const itemCount = currentItems.reduce(
    (count, item) => count + item.quantity, 
    0
  );

  const handleBillClose = () => {
    setShowPreview(false);
    onBack(); // Return to main page after bill generation
  };

  return (
    <div className="container max-w-5xl mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={onBack}
          className="hover:bg-restaurant-light/20"
        >
          ← Back to Transactions
        </Button>
        
        <h1 className="text-3xl font-bold text-restaurant-primary">Create New Bill</h1>
        
        <div className="w-[100px]"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <ItemSearch items={menuItems} onSearch={handleSearch} />
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <ItemsList items={filteredItems} />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-restaurant-tertiary">Current Bill</h2>
            
            {currentItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items added yet.</p>
                <p className="text-sm mt-2">Search and add items to create a bill.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-3 max-h-[400px] overflow-y-auto">
                  {currentItems.map(item => (
                    <div 
                      key={item.itemId} 
                      className="flex justify-between items-center border-b pb-2"
                    >
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatCurrency(item.price)} × {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold">
                        {formatCurrency(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total ({itemCount} items)</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-restaurant-primary hover:bg-restaurant-secondary"
                  size="lg"
                  onClick={handleCreateBill}
                  disabled={currentItems.length === 0}
                >
                  Generate Bill
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {showPreview && currentBill && (
        <BillPreview 
          bill={currentBill} 
          onClose={handleBillClose} 
        />
      )}
    </div>
  );
};

export default BillCreator;
