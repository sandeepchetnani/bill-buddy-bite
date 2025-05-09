
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../data/mockData';
import { Input } from '../components/ui/input';
import { Search } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '../components/ui/command';

interface ItemSearchProps {
  items: MenuItem[];
  onSearch: (filteredItems: MenuItem[]) => void;
}

const ItemSearch: React.FC<ItemSearchProps> = ({ items, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category)));
  
  // Filter items based on search query and category
  useEffect(() => {
    let filtered = items;
    
    if (selectedCategory) {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );
    }
    
    onSearch(filtered);
  }, [searchQuery, selectedCategory, items, onSearch]);
  
  // Clear filter when items change
  useEffect(() => {
    setSelectedCategory(null);
  }, [items]);
  
  // Handle keyboard shortcut to open command
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen(open => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
  return (
    <div className="relative flex flex-col gap-2">
      {/* Regular search input */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search menu items or press ⌘K"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
          onClick={() => setOpen(true)}
        />
      </div>
      
      {/* Category filter pills */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
              selectedCategory === null
                ? "bg-primary text-primary-foreground"
                : "bg-background hover:bg-muted"
            }`}
            onClick={() => setSelectedCategory(null)}
          >
            All
          </button>
          {categories.map(category => (
            <button
              key={category}
              className={`px-3 py-1.5 text-xs rounded-full border transition-colors ${
                selectedCategory === category
                  ? "bg-primary text-primary-foreground"
                  : "bg-background hover:bg-muted"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}
      
      {/* Command dialog for advanced search */}
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput 
            placeholder="Search menu items..." 
            value={searchQuery}
            onValueChange={setSearchQuery}
          />
          <CommandList>
            <CommandEmpty>No items found.</CommandEmpty>
            {categories.map(category => (
              <CommandGroup key={category} heading={category}>
                {items
                  .filter(item => item.category === category)
                  .filter(item => 
                    !searchQuery ||
                    item.name.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map(item => (
                    <CommandItem 
                      key={item.id}
                      onSelect={() => {
                        setSearchQuery(item.name);
                        setOpen(false);
                      }}
                    >
                      <span>{item.name}</span>
                      <span className="ml-auto text-muted-foreground">
                        ₹{item.price}
                      </span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default ItemSearch;
