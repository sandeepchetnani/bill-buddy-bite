
import React, { useState } from "react";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { MenuItem } from "../data/mockData";
import { useMenuItems } from "../hooks/useMenuItems";
import AddItemDialog from "./menu/AddItemDialog";
import EditItemDialog from "./menu/EditItemDialog";
import MenuItemsTable from "./menu/MenuItemsTable";
import ItemSearch from "./ItemSearch";
import { ScrollArea } from "./ui/scroll-area";

const MenuTable = () => {
  const {
    items,
    isLoading,
    filteredItems,
    categories,
    handleDeleteItem,
    addItem,
    updateItem
  } = useMenuItems();
  
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState<MenuItem | null>(null);
  const [searchResults, setSearchResults] = useState<MenuItem[]>(items);

  const openEditDialog = (item: MenuItem) => {
    setCurrentItem(item);
    setIsEditDialogOpen(true);
  };

  const handleSearch = (results: MenuItem[]) => {
    setSearchResults(results);
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
        <Button onClick={() => setIsAddDialogOpen(true)} className="flex items-center">
          <Plus className="mr-2 h-4 w-4" /> Add New Item
        </Button>
      </div>

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
