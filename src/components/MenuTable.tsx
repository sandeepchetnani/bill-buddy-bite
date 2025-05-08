
import React, { useState } from "react";
import { menuItems, MenuItem } from "../data/mockData";
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "./ui/table";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "./ui/dialog";
import { toast } from "./ui/sonner";
import { Plus, Pencil, Trash } from "lucide-react";

const MenuTable = () => {
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");
  const [currentItemId, setCurrentItemId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  // Get unique categories for filtering
  const categories = Array.from(new Set(items.map(item => item.category)));

  // Filter items based on search term
  const filteredItems = items.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddItem = () => {
    if (!name || !category || price <= 0) {
      toast.error("Please fill all fields correctly");
      return;
    }

    const newItem: MenuItem = {
      id: `item-${Date.now()}`,
      name,
      price,
      category
    };

    setItems(prev => [...prev, newItem]);
    resetForm();
    setIsAddDialogOpen(false);
    toast.success("Item added successfully");
  };

  const handleEditItem = () => {
    if (!name || !category || price <= 0 || !currentItemId) {
      toast.error("Please fill all fields correctly");
      return;
    }

    setItems(prev => 
      prev.map(item => 
        item.id === currentItemId 
          ? { ...item, name, price, category } 
          : item
      )
    );
    resetForm();
    setIsEditDialogOpen(false);
    toast.success("Item updated successfully");
  };

  const handleDeleteItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast.success("Item deleted successfully");
  };

  const openEditDialog = (item: MenuItem) => {
    setName(item.name);
    setPrice(item.price);
    setCategory(item.category);
    setCurrentItemId(item.id);
    setIsEditDialogOpen(true);
  };

  const resetForm = () => {
    setName("");
    setPrice(0);
    setCategory("");
    setCurrentItemId(null);
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

      <div className="flex mb-4">
        <Input
          placeholder="Search items..."
          className="max-w-sm"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price (₹)</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No items found
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>{item.price}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => openEditDialog(item)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-destructive hover:bg-destructive hover:text-destructive-foreground"
                    >
                      <Trash className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Add Item Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="name">Item Name</label>
              <Input 
                id="name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Item name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="category">Category</label>
              <Input 
                id="category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="Item category"
                list="categories"
              />
              <datalist id="categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label htmlFor="price">Price (₹)</label>
              <Input 
                id="price" 
                type="number" 
                value={price || ""} 
                onChange={(e) => setPrice(Number(e.target.value))} 
                placeholder="Item price"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddItem}>Add Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Item Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Menu Item</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit-name">Item Name</label>
              <Input 
                id="edit-name" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Item name"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-category">Category</label>
              <Input 
                id="edit-category" 
                value={category} 
                onChange={(e) => setCategory(e.target.value)} 
                placeholder="Item category"
                list="edit-categories"
              />
              <datalist id="edit-categories">
                {categories.map(cat => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-price">Price (₹)</label>
              <Input 
                id="edit-price" 
                type="number" 
                value={price || ""} 
                onChange={(e) => setPrice(Number(e.target.value))} 
                placeholder="Item price"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditItem}>Update Item</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MenuTable;
