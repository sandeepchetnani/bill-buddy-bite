
import React from 'react';
import { MenuItem } from '../data/mockData';
import { useBill } from '../context/BillContext';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../utils/billUtils';
import { Plus, Minus } from 'lucide-react';

interface ItemsListProps {
  items: MenuItem[];
}

const ItemsList: React.FC<ItemsListProps> = ({ items }) => {
  const { currentItems, addItem, updateQuantity } = useBill();

  const handleAddItem = (item: MenuItem) => {
    addItem({
      itemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1
    });
  };

  const getQuantity = (itemId: string): number => {
    const item = currentItems.find(item => item.itemId === itemId);
    return item ? item.quantity : 0;
  };

  const handleIncrement = (item: MenuItem) => {
    const currentQuantity = getQuantity(item.id);
    updateQuantity(item.id, currentQuantity + 1);
  };

  const handleDecrement = (item: MenuItem) => {
    const currentQuantity = getQuantity(item.id);
    if (currentQuantity > 0) {
      updateQuantity(item.id, currentQuantity - 1);
    }
  };

  // Group items by category
  const groupedItems: Record<string, MenuItem[]> = {};
  items.forEach(item => {
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });

  return (
    <div className="space-y-6">
      {Object.entries(groupedItems).map(([category, categoryItems]) => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-medium text-restaurant-tertiary">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {categoryItems.map(item => {
              const quantity = getQuantity(item.id);
              return (
                <div 
                  key={item.id} 
                  className="border rounded-md p-3 flex justify-between items-center hover:shadow-md transition-shadow"
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-muted-foreground">{formatCurrency(item.price)}</p>
                  </div>
                  
                  {quantity > 0 ? (
                    <div className="flex items-center space-x-2">
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleDecrement(item)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-6 text-center font-medium">{quantity}</span>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => handleIncrement(item)}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => handleAddItem(item)}
                    >
                      Add
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ItemsList;
