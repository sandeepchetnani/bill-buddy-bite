
import React, { useState } from 'react';
import { MenuItem } from '../../data/mockData';
import { useTables } from '../../context/TablesContext';
import { useMenuItems } from '../../hooks/useMenuItems';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Plus } from 'lucide-react';
import { formatCurrency } from '../../utils/billUtils';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import LoadingState from '../items/LoadingState';

const MenuItemSelection = () => {
  const { isLoading, items, categories } = useMenuItems();
  const { addItemToTable } = useTables();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | 'all'>('all');
  
  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  if (isLoading) {
    return <LoadingState />;
  }
  
  return (
    <div className="bg-white rounded-lg shadow">
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
        
        <Tabs defaultValue="all" onValueChange={(value) => setActiveCategory(value)}>
          <TabsList className="mb-4 w-full overflow-auto">
            <TabsTrigger value="all">All</TabsTrigger>
            {categories.map((category) => (
              <TabsTrigger key={category} value={category}>
                {category}
              </TabsTrigger>
            ))}
          </TabsList>
          
          <TabsContent value={activeCategory}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredItems.map((item) => (
                <div 
                  key={item.id} 
                  className="border rounded-md p-3 flex justify-between items-center hover:bg-gray-50"
                >
                  <div>
                    <h4 className="font-medium">{item.name}</h4>
                    <p className="text-muted-foreground">{formatCurrency(item.price)}</p>
                  </div>
                  
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => addItemToTable(item)}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Add
                  </Button>
                </div>
              ))}
              
              {filteredItems.length === 0 && (
                <div className="col-span-2 py-8 text-center text-muted-foreground">
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
