
import { useState, useEffect } from "react";
import { MenuItem } from "../data/mockData";
import { supabase } from "../integrations/supabase/client";
import { toast } from "@/components/ui/sonner";

export const useMenuItems = () => {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique categories for filtering
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          price: parseFloat(item.price),
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
    handleDeleteItem,
    addItem,
    updateItem,
    fetchMenuItems
  };
};
