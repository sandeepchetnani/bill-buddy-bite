
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';

interface ItemSearchProps {
  items: MenuItem[];
  onSearch: (filteredItems: MenuItem[]) => void;
}

const ItemSearch: React.FC<ItemSearchProps> = ({ items, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery === '') {
        onSearch(items);
      } else {
        const query = searchQuery.toLowerCase();
        const filtered = items.filter(item => 
          item.name.toLowerCase().includes(query) || 
          item.category.toLowerCase().includes(query)
        );
        onSearch(filtered);
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, items, onSearch]);
  
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-muted-foreground" />
      </div>
      <Input
        type="text"
        placeholder="Search menu items by name or category..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-10 w-full"
      />
    </div>
  );
};

export default ItemSearch;
