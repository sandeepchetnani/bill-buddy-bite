
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../data/mockData';
import { Input } from './ui/input';
import { Search, X } from 'lucide-react';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from './ui/command';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import { Badge } from './ui/badge';

interface ItemSearchProps {
  items: MenuItem[];
  onSearch: (filteredItems: MenuItem[]) => void;
}

const ItemSearch: React.FC<ItemSearchProps> = ({ items, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // Get unique categories
  const categories = Array.from(new Set(items.map(item => item.category))).sort();
  
  // Filter items based on search query and selected categories
  useEffect(() => {
    let filtered = items;
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(item => selectedCategories.includes(item.category));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(item => 
        item.name.toLowerCase().includes(query) || 
        item.category.toLowerCase().includes(query)
      );
    }
    
    onSearch(filtered);
  }, [searchQuery, selectedCategories, items, onSearch]);
  
  // Clear filter when items change
  useEffect(() => {
    setSelectedCategories([]);
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
  
  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category) 
        : [...prev, category]
    );
  };
  
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCategories([]);
  };
  
  return (
    <div className="relative flex flex-col gap-2">
      {/* Search input */}
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
        {(searchQuery || selectedCategories.length > 0) && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 px-3 hover:bg-transparent text-black"
            onClick={clearFilters}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      
      {/* Active filters display */}
      {selectedCategories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCategories.map(category => (
            <Badge 
              key={category} 
              variant="secondary"
              className="flex items-center gap-1 text-black"
            >
              {category}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => toggleCategory(category)} 
              />
            </Badge>
          ))}
          {selectedCategories.length > 1 && (
            <Button 
              variant="outline" 
              size="sm" 
              className="text-xs h-6 text-black"
              onClick={() => setSelectedCategories([])}
            >
              Clear ({selectedCategories.length})
            </Button>
          )}
        </div>
      )}
      
      {/* Category filter */}
      <ScrollArea className="h-auto max-h-36 w-full">
        <div className="flex flex-wrap gap-1 py-1">
          {categories.map(category => (
            <Button
              key={category}
              className={`px-3 py-1 text-xs rounded-full border transition-colors h-7 ${
                selectedCategories.includes(category)
                  ? "text-black"
                  : "bg-background hover:bg-muted text-black"
              }`}
              onClick={() => toggleCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>
      </ScrollArea>
      
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
            {categories.map(category => {
              const categoryItems = items
                .filter(item => item.category === category)
                .filter(item => 
                  !searchQuery ||
                  item.name.toLowerCase().includes(searchQuery.toLowerCase())
                );
                
              if (categoryItems.length === 0) return null;
              
              return (
                <CommandGroup key={category} heading={category}>
                  {categoryItems.map(item => (
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
              );
            })}
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
};

export default ItemSearch;
