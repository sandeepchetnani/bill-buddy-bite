
import React from 'react';
import { MenuItem } from '../../data/mockData';
import ItemCard from './ItemCard';

interface ItemsByCategoryContentProps {
  items: MenuItem[];
  getQuantity: (itemId: string) => number;
  handleAddItem: (item: MenuItem) => void;
  handleIncrement: (item: MenuItem) => void;
  handleDecrement: (item: MenuItem) => void;
}

const ItemsByCategoryContent: React.FC<ItemsByCategoryContentProps> = ({
  items,
  getQuantity,
  handleAddItem,
  handleIncrement,
  handleDecrement
}) => {
  if (items.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        No items found matching your search.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      {items.map(item => (
        <ItemCard
          key={item.id}
          item={item}
          quantity={getQuantity(item.id)}
          onAddItem={handleAddItem}
          onIncrement={handleIncrement}
          onDecrement={handleDecrement}
        />
      ))}
    </div>
  );
};

export default ItemsByCategoryContent;
