
import React, { useState } from "react";
import { 
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell 
} from "../ui/table";
import { Button } from "../ui/button";
import { MenuItem } from "../../data/mockData";
import { Pencil, Trash, Loader2, ChevronUp, ChevronDown } from "lucide-react";
import { Badge } from "../ui/badge";

interface MenuItemsTableProps {
  items: MenuItem[];
  isLoading: boolean;
  filteredItems: MenuItem[];
  onEditItem: (item: MenuItem) => void;
  onDeleteItem: (id: string) => void;
}

type SortField = 'name' | 'category' | 'price';
type SortDirection = 'asc' | 'desc';

const MenuItemsTable: React.FC<MenuItemsTableProps> = ({
  items,
  isLoading,
  filteredItems,
  onEditItem,
  onDeleteItem,
}) => {
  const [sortField, setSortField] = useState<SortField>('category');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedItems = () => {
    return [...filteredItems].sort((a, b) => {
      let comparison = 0;

      if (sortField === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortField === 'category') {
        comparison = a.category.localeCompare(b.category);
      } else if (sortField === 'price') {
        comparison = a.price - b.price;
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const sortedItems = getSortedItems();

  const renderSortIcon = (field: SortField) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUp className="ml-1 h-4 w-4 inline" /> : 
      <ChevronDown className="ml-1 h-4 w-4 inline" />;
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('name')}
            >
              Name {renderSortIcon('name')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('category')}
            >
              Category {renderSortIcon('category')}
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('price')}
            >
              Price (₹) {renderSortIcon('price')}
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-8">
                <div className="flex justify-center items-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  <span>Loading menu items...</span>
                </div>
              </TableCell>
            </TableRow>
          ) : sortedItems.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center py-6">
                No items found
              </TableCell>
            </TableRow>
          ) : (
            sortedItems.map((item) => (
              <TableRow key={item.id}>
                <TableCell className="font-medium">{item.name}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {item.category}
                  </Badge>
                </TableCell>
                <TableCell>₹{item.price}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditItem(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => onDeleteItem(item.id)}
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
  );
};

export default MenuItemsTable;
