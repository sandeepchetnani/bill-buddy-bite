
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

interface TableItemProps {
  table: Table;
}

const TableItem: React.FC<TableItemProps> = ({ table }) => {
  const { selectTable } = useTables();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  const handleTableClick = () => {
    // First select the table in context
    selectTable(table);
    // Open the menu sheet instead of navigating
    setIsMenuOpen(true);
    console.log(`Selected table ${table.id} and opening menu`);
  };

  const handleCompleteOrder = () => {
    // Close the sheet and navigate to the order page for more detailed ordering
    setIsMenuOpen(false);
    navigate('/order');
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
        <SheetContent className="w-full sm:max-w-md md:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>Table {table.block}{table.number} - Quick Order</SheetTitle>
            <SheetDescription>
              Add items to this table or proceed to detailed order page
            </SheetDescription>
          </SheetHeader>
          
          <div className="mt-6 space-y-6">
            <MenuItemSelection />
            
            <div className="pt-4 border-t flex justify-end">
              <button 
                onClick={handleCompleteOrder}
                className="px-4 py-2 bg-restaurant-primary text-white rounded-md hover:bg-restaurant-secondary"
              >
                Go to Detailed Order
              </button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default TableItem;
