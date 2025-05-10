
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../data/mockData';
import { useBill } from '../context/BillContext';
import { Button } from '../components/ui/button';
import { formatCurrency } from '../utils/billUtils';
import { Plus, Minus, Loader2, Search } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from '../components/ui/sonner';
import { Input } from './ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';

interface ItemsListProps {
  items?: MenuItem[];
}

const ItemsList: React.FC<ItemsListProps> = ({ items: propItems }) => {
  const { currentItems, addItem, updateQuantity } = useBill();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  // Fetch menu items from Supabase if not provided as props
  useEffect(() => {
    if (propItems && propItems.length > 0) {
      setItems(propItems);
      setIsLoading(false);
      return;
    }

    async function fetchMenuItems() {
      setIsLoading(true);
      setError(null);
      
      try {
        const { data, error } = await supabase
          .from('menu_items')
          .select('*');

        if (error) {
          setError("Failed to fetch menu items");
          toast.error("Failed to fetch menu items");
          console.error("Error fetching menu items:", error);
        } else {
          // Transform the data to match our MenuItem interface
          const transformedItems: MenuItem[] = data.map((item: any) => ({
            id: item.id,
            name: item.name,
            price: parseFloat(item.price),
            category: item.category
          }));
          setItems(transformedItems);
        }
      } catch (error) {
        console.error("Error in fetchMenuItems:", error);
        setError("An unexpected error occurred");
        toast.error("An unexpected error occurred");
      } finally {
        setIsLoading(false);
      }
    }

    fetchMenuItems();
  }, [propItems]);

  // Process categories and items
  const categories = Array.from(new Set(items.map(item => item.category))).sort();
  
  // Group items by category and filter by search
  const groupedItems: Record<string, MenuItem[]> = {};
  
  items.forEach(item => {
    // Skip if doesn't match search query
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return;
    }
    
    // Skip if tab selected and item is not in that category
    if (selectedTab && item.category !== selectedTab) {
      return;
    }
    
    if (!groupedItems[item.category]) {
      groupedItems[item.category] = [];
    }
    groupedItems[item.category].push(item);
  });
  
  // Get filtered array of categories (those that have items after filtering)
  const filteredCategories = Object.keys(groupedItems).sort();

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
  
  const handleClearSearch = () => {
    setSearchQuery('');
  };
  
  const handleTabChange = (value: string) => {
    setSelectedTab(value === 'all' ? null : value);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-12">
        <Loader2 className="h-8 w-8 animate-spin text-restaurant-primary" />
        <span className="ml-2 text-lg">Loading menu items...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">{error}</p>
        <p className="mt-2">Please try again later or contact support.</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-muted-foreground">No menu items available.</p>
        <p className="mt-2 text-sm">Please add items in the Menu Management section.</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      {/* Search bar */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-muted-foreground" />
        </div>
        <Input
          type="text"
          placeholder="Search menu items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 w-full"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            className="absolute inset-y-0 right-0 px-3 hover:bg-transparent"
            onClick={handleClearSearch}
          >
            Clear
          </Button>
        )}
      </div>
      
      {/* Category tabs */}
      <div>
        <Tabs defaultValue="all" value={selectedTab === null ? 'all' : selectedTab} onValueChange={handleTabChange}>
          <div className="relative w-full">
            <ScrollArea className="w-full">
              <TabsList className="h-auto p-1 flex-wrap whitespace-nowrap">
                <TabsTrigger value="all" className="text-sm py-1 px-3">
                  All Categories
                </TabsTrigger>
                {categories.map(category => (
                  <TabsTrigger 
                    key={category} 
                    value={category}
                    className="text-sm py-1 px-3"
                  >
                    {category}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollArea>
          </div>
          
          {/* Items display */}
          <TabsContent value="all" className="mt-4">
            {filteredCategories.length > 0 ? (
              <div className="space-y-6">
                {filteredCategories.map(category => (
                  <div key={category} className="space-y-2">
                    <h3 className="text-lg font-medium text-restaurant-tertiary">{category}</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {groupedItems[category].map(renderMenuItem)}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-muted-foreground">
                No items found matching your search.
              </p>
            )}
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-4">
              {groupedItems[category] && groupedItems[category].length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {groupedItems[category].map(renderMenuItem)}
                </div>
              ) : (
                <p className="text-center py-6 text-muted-foreground">
                  No items found matching your search.
                </p>
              )}
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
  
  function renderMenuItem(item: MenuItem) {
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
  }
};

export default ItemsList;
