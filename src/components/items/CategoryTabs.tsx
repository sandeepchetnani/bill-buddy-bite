
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';

interface CategoryTabsProps {
  categories: string[];
  selectedTab: string | null;
  onTabChange: (value: string) => void;
}

const CategoryTabs: React.FC<CategoryTabsProps> = ({ 
  categories, 
  selectedTab, 
  onTabChange 
}) => {
  return (
    <div className="relative w-full">
      <ScrollArea className="w-full">
        <TabsList className="h-auto p-1 flex-wrap whitespace-nowrap">
          <TabsTrigger 
            value="all" 
            className="text-sm py-1 px-3 text-foreground"
          >
            All Categories
          </TabsTrigger>
          {categories.map(category => (
            <TabsTrigger 
              key={category} 
              value={category}
              className="text-sm py-1 px-3 text-foreground"
            >
              {category}
            </TabsTrigger>
          ))}
        </TabsList>
      </ScrollArea>
    </div>
  );
};

export default CategoryTabs;
