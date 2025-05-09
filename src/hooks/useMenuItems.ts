
import { useState, useEffect, useMemo } from "react";
import { MenuItem } from "../data/mockData";
import { supabase } from "../integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const useMenuItems = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Get unique categories for filtering
  const categories = useMemo(() => 
    Array.from(new Set(items.map(item => item.category))),
    [items]
  );

  // Filter items based on search term and selected category
  const filteredItems = useMemo(() => {
    let result = items;
    
    // Apply category filter if selected
    if (selectedCategory) {
      result = result.filter(item => item.category === selectedCategory);
    }
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        item.name.toLowerCase().includes(term) ||
        item.category.toLowerCase().includes(term)
      );
    }
    
    return result;
  }, [items, searchTerm, selectedCategory]);

  // Fetch menu items from Supabase
  const fetchMenuItems = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*');

      if (error) {
        toast.error("Failed to fetch menu items");
        console.error("Error fetching menu items:", error);
      } else {
        // Transform the data to match our MenuItem interface
        const transformedItems: MenuItem[] = data.map((item: any) => ({
          id: item.id,
          name: item.name,
          price: Number(item.price), // Ensure price is a number
          category: item.category
        }));
        setItems(transformedItems);
      }
    } catch (error) {
      console.error("Error in fetchMenuItems:", error);
      toast.error("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMenuItems();
  }, []);

  const handleDeleteItem = async (id: string) => {
    try {
      const { error } = await supabase
        .from('menu_items')
        .delete()
        .eq('id', id);

      if (error) {
        toast.error("Failed to delete item");
        console.error("Error deleting item:", error);
        return;
      }

      setItems(prev => prev.filter(item => item.id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error in handleDeleteItem:", error);
      toast.error("An unexpected error occurred");
    }
  };

  const addItem = (newItem: MenuItem) => {
    setItems(prev => [...prev, newItem]);
  };

  const updateItem = (id: string, updatedItem: Partial<MenuItem>) => {
    setItems(prev => 
      prev.map(item => 
        item.id === id 
          ? { ...item, ...updatedItem } 
          : item
      )
    );
  };

  return {
    items,
    isLoading,
    filteredItems,
    categories,
    searchTerm,
    setSearchTerm,
    selectedCategory,
    setSelectedCategory,
    handleDeleteItem,
    addItem,
    updateItem,
    fetchMenuItems
  };
};
