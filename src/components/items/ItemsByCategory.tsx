
import React from 'react';
import { MenuItem } from '../../data/mockData';
import ItemCard from './ItemCard';

interface ItemsByCategoryProps {
  groupedItems: Record<string, MenuItem[]>;
  filteredCategories: string[];
  getQuantity: (itemId: string) => number;
  handleAddItem: (item: MenuItem) => void;
  handleIncrement: (item: MenuItem) => void;
  handleDecrement: (item: MenuItem) => void;
  searchQuery: string;
}

const ItemsByCategory: React.FC<ItemsByCategoryProps> = ({
  groupedItems,
  filteredCategories,
  getQuantity,
  handleAddItem,
  handleIncrement,
  handleDecrement,
  searchQuery
}) => {
  if (filteredCategories.length === 0) {
    return (
      <p className="text-center py-6 text-muted-foreground">
        No items found matching your search.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {filteredCategories.map(category => (
        <div key={category} className="space-y-2">
          <h3 className="text-lg font-medium text-restaurant-tertiary">{category}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {groupedItems[category].map(item => (
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
        </div>
      ))}
    </div>
  );
};

export default ItemsByCategory;
