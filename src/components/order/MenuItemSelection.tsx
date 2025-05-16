
import React, { useState } from 'react';
import { MenuItem } from '../../data/mockData';
import { useTables } from '../../context/TablesContext';
import { useMenuItems } from '../../hooks/useMenuItems';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus, Minus, X } from 'lucide-react';
import { formatCurrency } from '../../utils/billUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingState from '../items/LoadingState';
import { Separator } from '@/components/ui/separator';

const MenuItemSelection = () => {
  const { isLoading, items, categories } = useMenuItems();
  const { addItemToTable, currentTable, tableItems, updateItemQuantity, removeItemFromTable } = useTables();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Get quantities for items in the current table
  const getItemQuantity = (itemId: string): number => {
    if (!currentTable) return 0;
    
    const tableItem = tableItems[currentTable.id]?.find(item => item.itemId === itemId);
    return tableItem?.quantity || 0;
  };
  
  const currentTableItems = currentTable ? tableItems[currentTable.id] || [] : [];

  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <div className="bg-white rounded-lg">
      {/* Current Table Items Section */}
      {currentTableItems.length > 0 && (
        <div className="p-4 border-b">
          <h3 className="text-lg font-medium mb-3">Current Items</h3>
          <div className="space-y-2">
            {currentTableItems.map((item) => (
              <div 
                key={item.itemId}
                className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
              >
                <div className="flex-1">
                  <div className="font-medium">{item.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {formatCurrency(item.price)} x {item.quantity} = {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                    onClick={() => removeItemFromTable(item.itemId)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => updateItemQuantity(item.itemId, item.quantity - 1)}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-5 text-center font-medium">{item.quantity}</span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      className="h-7 w-7"
                      onClick={() => updateItemQuantity(item.itemId, item.quantity + 1)}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Menu Search and Filtering */}
      <div className="p-4">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
          <Input
            placeholder="Search menu items..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value as string)}>
          <TabsList className="mb-4 w-full overflow-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory}>
            <div className="grid grid-cols-1 gap-3">
              {filteredItems.map((item) => {
                const quantity = getItemQuantity(item.id);
                
                return (
                  <div 
                    key={item.id} 
                    className="border rounded-md p-3 flex justify-between items-center hover:bg-gray-50"
                  >
                    <div>
                      <h4 className="font-medium">{item.name}</h4>
                      <p className="text-muted-foreground">{formatCurrency(item.price)}</p>
                    </div>
                    
                    <div className="flex items-center">
                      {quantity > 0 ? (
                        <div className="flex items-center space-x-1">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateItemQuantity(item.id, quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-5 text-center font-medium">{quantity}</span>
                          <Button 
                            variant="outline" 
                            size="icon" 
                            className="h-7 w-7"
                            onClick={() => updateItemQuantity(item.id, quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      ) : (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => addItemToTable(item)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Add
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
              
              {filteredItems.length === 0 && (
                <div className="py-8 text-center text-muted-foreground">
                  No items found
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MenuItemSelection;
