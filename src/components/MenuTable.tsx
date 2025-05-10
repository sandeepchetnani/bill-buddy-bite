
import React, { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { MenuItem } from "../data/mockData";
import { useMenuItems } from "../hooks/useMenuItems";
import AddItemDialog from "./menu/AddItemDialog";
import EditItemDialog from "./menu/EditItemDialog";
import MenuItemsTable from "./menu/MenuItemsTable";
import ItemSearch from "./ItemSearch";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/sonner";

const MenuTable = () => {
  const {
    items,
    isLoading,
    filteredItems,
    categories,
    handleDeleteItem,
    addItem,
    updateItem,
    fetchMenuItems,
    error
  } = useMenuItems();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [searchResults, setSearchResults] = useState<MenuItem[]>(items);

  // Refresh search results when items change
  useEffect(() => {
    setSearchResults(items);
  }, [items]);

  // Fetch menu items on mount
  useEffect(() => {
    console.log("MenuTable mounted, fetching menu items...");
    fetchMenuItems();
  }, []);

  const openEditDialog = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSearch = (results: MenuItem[]) => {
    setSearchResults(results);
  };

  const handleRefreshItems = () => {
    console.log("Manually refreshing menu items...");
    fetchMenuItems();
    toast.success("Menu items refreshed");
  };

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6 flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Menu Items</h2>
          <p className="text-muted-foreground">
            Manage your restaurant menu items and prices
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            onClick={handleRefreshItems}
          >
            Refresh
          </Button>
          <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
            <Plus className="mr-2 h-4 w-4" /> Add New Item
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-4 border border-red-300 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <div className="mb-6">
        <ItemSearch items={items} onSearch={handleSearch} />
      </div>

      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {searchResults.length} {searchResults.length === 1 ? 'item' : 'items'} found
        </div>
        
        {searchResults.length !== items.length && (
          <Button 
            variant="link" 
            className="text-sm h-auto p-0"
            onClick={() => setSearchResults(items)}
          >
            View all items
          </Button>
        )}
      </div>

      <ScrollArea className="h-[calc(100vh-230px)]">
        <MenuItemsTable
          items={items}
          isLoading={isLoading}
          filteredItems={searchResults}
          onEditItem={openEditDialog}
          onDeleteItem={handleDeleteItem}
        />
      </ScrollArea>

      {/* Add Item Dialog */}
      <AddItemDialog
        isOpen={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onItemAdded={addItem}
        existingCategories={categories}
      />

      {/* Edit Item Dialog */}
      <EditItemDialog
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onItemUpdated={updateItem}
        item={currentItem}
        existingCategories={categories}
      />
    </div>
  );
};

export default MenuTable;
