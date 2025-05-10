
import React, { useState, useEffect } from 'react';
import { MenuItem } from '../data/mockData';
import { useBill } from '../context/BillContext';
import { supabase } from '../integrations/supabase/client';
import { toast } from '../components/ui/sonner';
import { Tabs, TabsContent } from './ui/tabs';

// Imported smaller components
import SearchBar from './items/SearchBar';
import CategoryTabs from './items/CategoryTabs';
import ItemsByCategory from './items/ItemsByCategory';
import ItemsByCategoryContent from './items/ItemsByCategoryContent';
import LoadingState from './items/LoadingState';
import ErrorState from './items/ErrorState';
import EmptyState from './items/EmptyState';

interface ItemsListProps {
  items?: MenuItem[];
  showSearchBar?: boolean;
}

const ItemsList: React.FC<ItemsListProps> = ({ items: propItems, showSearchBar = false }) => {
  const { currentItems, addItem, updateQuantity } = useBill();
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTab, setSelectedTab] = useState<string | null>(null);

  // Fetch menu items from Supabase if not provided as props
  useEffect(() => {
    if (propItems && propItems.length > 0) {
      console.log("Using provided items:", propItems);
      setItems(propItems);
      setIsLoading(false);
      return;
    }

    async function fetchMenuItems() {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log("Fetching menu items in ItemsList component...");
        const { data, error } = await supabase
          .from('menu_items')
          .select('*');

        if (error) {
          setError("Failed to fetch menu items");
          toast.error("Failed to fetch menu items");
          console.error("Error fetching menu items:", error);
        } else if (!data || data.length === 0) {
          console.log("No menu items found in database");
          setItems([]);
        } else {
          console.log("Menu items fetched successfully:", data);
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

  console.log("ItemsList rendering state:", {
    isLoading,
    itemsCount: items.length,
    error,
    categories
  });

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return <ErrorState error={error} />;
  }

  if (items.length === 0) {
    return <EmptyState />;
  }
  
  return (
    <div className="space-y-6">
      {/* Search bar - only shown when showSearchBar is true */}
      {showSearchBar && (
        <SearchBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          onClearSearch={handleClearSearch} 
        />
      )}
      
      {/* Category tabs */}
      <div>
        <Tabs 
          defaultValue="all" 
          value={selectedTab === null ? 'all' : selectedTab} 
          onValueChange={handleTabChange}
        >
          <CategoryTabs 
            categories={categories} 
            selectedTab={selectedTab} 
            onTabChange={handleTabChange} 
          />
          
          {/* Items display */}
          <TabsContent value="all" className="mt-4">
            <ItemsByCategory
              groupedItems={groupedItems}
              filteredCategories={filteredCategories}
              getQuantity={getQuantity}
              handleAddItem={handleAddItem}
              handleIncrement={handleIncrement}
              handleDecrement={handleDecrement}
              searchQuery={searchQuery}
            />
          </TabsContent>
          
          {categories.map(category => (
            <TabsContent key={category} value={category} className="mt-4">
              <ItemsByCategoryContent
                items={groupedItems[category] || []}
                getQuantity={getQuantity}
                handleAddItem={handleAddItem}
                handleIncrement={handleIncrement}
                handleDecrement={handleDecrement}
              />
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  );
};

export default ItemsList;
