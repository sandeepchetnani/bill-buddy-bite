
import React from 'react';
import { Button } from '../ui/button';
import { Plus, Minus } from 'lucide-react';
import { MenuItem } from '../../data/mockData';
import { formatCurrency } from '../../utils/billUtils';

interface ItemCardProps {
  item: MenuItem;
  quantity: number;
  onAddItem: (item: MenuItem) => void;
  onIncrement: (item: MenuItem) => void;
  onDecrement: (item: MenuItem) => void;
}

const ItemCard: React.FC<ItemCardProps> = ({
  item,
  quantity,
  onAddItem,
  onIncrement,
  onDecrement
}) => {
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
            onClick={() => onDecrement(item)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-6 text-center font-medium">{quantity}</span>
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8"
            onClick={() => onIncrement(item)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => onAddItem(item)}
        >
          Add
        </Button>
      )}
    </div>
  );
};

export default ItemCard;
