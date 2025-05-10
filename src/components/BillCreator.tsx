
import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import ItemsList from './ItemsList';
import { useBill } from '../context/BillContext';
import { MenuItem } from '../data/mockData';
import { formatCurrency } from '../utils/billUtils';
import BillPreview from './BillPreview';
import { toast } from "../components/ui/sonner";
import { Loader2, X } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

interface BillCreatorProps {
  onBack: () => void;
  isEditing?: boolean;
  editingId?: string | null;
}

const BillCreator: React.FC<BillCreatorProps> = ({ onBack, isEditing = false, editingId = null }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [allMenuItems, setAllMenuItems] = useState<MenuItem[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [currentBill, setCurrentBill] = useState<any>(null);
  const [customBillNumber, setCustomBillNumber] = useState("");
  const [isCreatingBill, setIsCreatingBill] = useState(false);
  const [isLoadingItems, setIsLoadingItems] = useState(true);
  
  const { currentItems, finalizeBill, nextBillNumber, removeItem } = useBill();
  
  // Set the default bill number when component mounts or nextBillNumber changes
  useEffect(() => {
    if (!isEditing && nextBillNumber) {
      setCustomBillNumber(nextBillNumber);
    }
  }, [isEditing, nextBillNumber]);

  // Fetch all menu items from database
  useEffect(() => {
    async function fetchMenuItems() {
      setIsLoadingItems(true);
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*');

        if (error) {
          toast.error("Failed to fetch menu items");
          console.error("Error fetching menu items:", error);
        } else {
          // Transform the data to match our MenuItem interface
          const transformedItems: MenuItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            category: item.category
          }));
          setAllMenuItems(transformedItems);
        }
      } catch (error) {
        console.error("Error in fetchMenuItems:", error);
        toast.error("An unexpected error occurred loading menu items");
      } finally {
        setIsLoadingItems(false);
      }
    }

    fetchMenuItems();
  }, []);
  
  const handleCreateBill = async () => {
    if (currentItems.length === 0) {
      toast.error("Please add items to the bill first");
      return;
    }
    
    setIsCreatingBill(true);
    
    try {
      const bill = await finalizeBill(customBillNumber.trim() || undefined);
      setCurrentBill(bill);
      setShowPreview(true);
      toast.success(`Bill #${bill.billNumber} ${isEditing ? 'updated' : 'created'} successfully`);
    } catch (error) {
      console.error('Error creating bill:', error);
      toast.error(`Failed to ${isEditing ? 'update' : 'create'} bill. Please try again.`);
    } finally {
      setIsCreatingBill(false);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeItem(itemId);
    toast.success("Item removed from bill");
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
        
        <h1 className="text-3xl font-bold text-restaurant-primary">
          {isEditing ? 'Edit Bill' : 'Create New Bill'}
        </h1>
        
        <div className="w-[100px]"></div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {isLoadingItems ? (
              <div className="flex justify-center items-center p-12">
                <Loader2 className="h-8 w-8 animate-spin text-restaurant-primary" />
                <span className="ml-2 text-lg">Loading menu items...</span>
              </div>
            ) : (
              <ItemsList 
                items={allMenuItems} 
                showSearchBar={true}
              />
            )}
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold mb-4 text-restaurant-tertiary">
              {isEditing ? 'Edit Bill' : 'Current Bill'}
            </h2>
            
            {currentItems.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <p>No items added yet.</p>
                <p className="text-sm mt-2">Search and add items to create a bill.</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="billNumber" className="text-sm font-medium">
                    Bill Number {isEditing ? '(updating)' : ''}
                  </label>
                  <Input
                    id="billNumber"
                    placeholder="Enter bill number"
                    value={customBillNumber}
                    onChange={(e) => setCustomBillNumber(e.target.value)}
                    className="w-full"
                  />
                  {!isEditing && (
                    <p className="text-xs text-muted-foreground">
                      Using automatic numbering: {nextBillNumber}
                    </p>
                  )}
                </div>
                
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
                      <div className="flex items-center gap-2">
                        <div className="font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-6 w-6 rounded-full hover:bg-gray-100"
                          onClick={() => handleRemoveItem(item.itemId)}
                          title="Remove item"
                        >
                          <X className="h-4 w-4 text-gray-500" />
                        </Button>
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
                  disabled={currentItems.length === 0 || isCreatingBill}
                >
                  {isCreatingBill ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    isEditing ? 'Update Bill' : 'Generate Bill'
                  )}
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
