
import React, { useState } from 'react';
import { Table } from '../../types/waiter';
import { useTables } from '../../context/TablesContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';
import { 
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import MenuItemSelection from '@/components/order/MenuItemSelection';
import { Button } from '@/components/ui/button';
import { Check, ArrowRight } from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface TableItemProps {
  table: Table;
}

const TableItem: React.FC<TableItemProps> = ({ table }) => {
  const { selectTable, tableItems, completeOrder } = useTables();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const handleTableClick = () => {
    // First select the table in context
    selectTable(table);
    // Open the menu sheet
    setIsMenuOpen(true);
    console.log(`Selected table ${table.id} and opening menu sheet`);
  };

  const handleCompleteOrder = () => {
    // Close the sheet and navigate to the order page for more detailed ordering
    setIsMenuOpen(false);
    navigate('/order');
  };
  
  const handleSaveQuickOrder = async () => {
    if (!table) return;
    
    // Check if there are any items to save
    const items = tableItems[table.id] || [];
    if (items.length === 0) {
      toast.error('No items to save');
      return;
    }
    
    try {
      setIsSaving(true);
      await completeOrder();
      toast.success(`Order saved for Table ${table.block}${table.number}`);
      setIsMenuOpen(false);
    } catch (error) {
      console.error('Error saving order:', error);
      toast.error('Failed to save order');
    } finally {
      setIsSaving(false);
    }
  };
  
  return (
    <>
      <div
        onClick={handleTableClick}
        className={cn(
          "h-24 w-full border rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer",
          table.occupied 
            ? "bg-amber-100 border-amber-300" 
            : "bg-green-50 border-green-200 hover:bg-green-100",
          table.orderInProgress && "ring-2 ring-blue-400"
        )}
      >
        <span className="text-xl font-bold">Table {table.block}{table.number}</span>
        <span className={cn(
          "text-sm mt-1",
          table.occupied ? "text-amber-700" : "text-green-700"
        )}>
          {table.orderInProgress 
            ? "Order in progress" 
            : table.occupied 
              ? "Occupied" 
              : "Available"}
        </span>
      </div>

      {/* Menu Sheet that opens when table is clicked */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Table {table.block}{table.number} - Quick Order</SheetTitle>
            <SheetDescription>
              Add items to this table or proceed to detailed order page
            </SheetDescription>
          </SheetHeader>
          
          {/* Move the save & complete button to the top */}
          <div className="mt-4 mb-6 flex justify-between">
            <Button 
              onClick={handleSaveQuickOrder}
              variant="outline"
              disabled={isSaving}
              className="flex items-center gap-2"
            >
              <Check className="h-4 w-4" />
              Save & Complete Order
            </Button>
            <Button 
              onClick={handleCompleteOrder}
              variant="default"
              className="bg-restaurant-primary text-white hover:bg-restaurant-secondary flex items-center gap-2"
            >
              Go to Detailed Order
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="space-y-6">
            <MenuItemSelection />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TableItem;
