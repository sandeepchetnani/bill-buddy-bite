
import React from 'react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '../../utils/billUtils';
import { useTables } from '../../context/TablesContext';
import { Plus, Minus } from 'lucide-react';

const OrderItems = () => {
  const { currentTable, tableItems, updateItemQuantity } = useTables();
  
  if (!currentTable) {
    return null;
  }
  
  const items = tableItems[currentTable.id] || [];
  
  if (items.length === 0) {
    return (
      <div className="py-6 sm:py-8 text-center text-muted-foreground text-sm">
        No items added yet
      </div>
    );
  }
  
  return (
    <div className="space-y-2 sm:space-y-3">
      {items.map((item) => {
        const itemTotal = item.price * item.quantity;
        
        return (
          <div key={item.itemId} className="flex justify-between items-center py-2">
            <div className="flex-1 min-w-0">
              <div className="font-medium text-sm sm:text-base truncate">{item.name}</div>
              <div className="text-xs sm:text-sm text-muted-foreground">
                {formatCurrency(item.price)} x {item.quantity}
              </div>
            </div>
            
            <div className="flex items-center gap-1 sm:gap-2 ml-2">
              <span className="font-medium text-xs sm:text-sm whitespace-nowrap">{formatCurrency(itemTotal)}</span>
              
              <div className="flex items-center space-x-1">
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  onClick={() => updateItemQuantity(item.itemId, item.quantity - 1)}
                >
                  <Minus className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
                <span className="w-4 sm:w-6 text-center font-medium text-xs sm:text-sm">{item.quantity}</span>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-6 w-6 sm:h-7 sm:w-7"
                  onClick={() => updateItemQuantity(item.itemId, item.quantity + 1)}
                >
                  <Plus className="h-2 w-2 sm:h-3 sm:w-3" />
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default OrderItems;
