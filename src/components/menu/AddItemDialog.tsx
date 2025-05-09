
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "../ui/sonner";
import { MenuItem } from "../../data/mockData";

interface AddItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onItemAdded: (item: MenuItem) => void;
  existingCategories: string[];
}

const AddItemDialog: React.FC<AddItemDialogProps> = ({
  isOpen,
  onOpenChange,
  onItemAdded,
  existingCategories,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");

  const resetForm = () => {
    setName("");
    setPrice(0);
    setCategory("");
  };

  const handleAddItem = async () => {
    if (!name || !category || price <= 0) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('menu_items')
        .insert([{
          name,
          price,
          category
        }])
        .select();

      if (error) {
        toast.error("Failed to add item");
        console.error("Error adding item:", error);
        return;
      }

      if (data && data.length > 0) {
        const newItem: MenuItem = {
          id: data[0].id,
          name: data[0].name,
          price: parseFloat(data[0].price),
          category: data[0].category
        };
        
        onItemAdded(newItem);
        resetForm();
        onOpenChange(false);
        toast.success("Item added successfully");
      }
    } catch (error) {
      console.error("Error in handleAddItem:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              {existingCategories.map(cat => (
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleAddItem}>Add Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddItemDialog;
