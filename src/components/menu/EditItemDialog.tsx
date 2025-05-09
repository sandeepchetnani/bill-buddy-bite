
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { supabase } from "../../integrations/supabase/client";
import { toast } from "../ui/sonner";
import { MenuItem } from "../../data/mockData";

interface EditItemDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onItemUpdated: (id: string, updatedItem: Partial<MenuItem>) => void;
  item: MenuItem | null;
  existingCategories: string[];
}

const EditItemDialog: React.FC<EditItemDialogProps> = ({
  isOpen,
  onOpenChange,
  onItemUpdated,
  item,
  existingCategories,
}) => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState<number>(0);
  const [category, setCategory] = useState("");

  // Set form values when item changes
  useEffect(() => {
    if (item) {
      setName(item.name);
      setPrice(item.price);
      setCategory(item.category);
    }
  }, [item]);

  const handleEditItem = async () => {
    if (!name || !category || price <= 0 || !item?.id) {
      toast.error("Please fill all fields correctly");
      return;
    }

    try {
      const { error } = await supabase
        .from('menu_items')
        .update({
          name,
          price, // Keep as number, no conversion needed
          category
        })
        .eq('id', item.id);

      if (error) {
        toast.error("Failed to update item");
        console.error("Error updating item:", error);
        return;
      }

      onItemUpdated(item.id, { name, price, category });
      onOpenChange(false);
      toast.success("Item updated successfully");
    } catch (error) {
      console.error("Error in handleEditItem:", error);
      toast.error("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              {existingCategories.map(cat => (
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleEditItem}>Update Item</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditItemDialog;
