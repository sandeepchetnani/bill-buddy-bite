import React, { createContext, useContext, useState } from 'react';
import { Table, TableBlock, TableNumber } from '../types/waiter';
import { BillItem } from '../utils/billUtils';
import { toast } from '@/components/ui/sonner';
import { MenuItem } from '../data/mockData';
import { supabase } from '../integrations/supabase/client';

interface TablesContextType {
  tables: Table[];
  currentTable: Table | null;
  tableItems: Record<string, BillItem[]>;
  selectTable: (table: Table) => void;
  clearCurrentTable: () => void;
  addItemToTable: (item: MenuItem) => void;
  removeItemFromTable: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  completeOrder: () => Promise<void>;
  getTableItems: (tableId: string) => BillItem[];
}

const generateTables = (): Table[] => {
  const blocks: TableBlock[] = ['A', 'B', 'C', 'D', 'E'];
  const numbers: TableNumber[] = ['1', '2', '3', '4', '5'];
  
  return blocks.flatMap(block => 
    numbers.map(number => ({
      block,
      number,
      id: `${block}${number}`,
      occupied: false,
      orderInProgress: false
    }))
  );
};

const TablesContext = createContext<TablesContextType | undefined>(undefined);

export const useTables = () => {
  const context = useContext(TablesContext);
  if (!context) {
    throw new Error('useTables must be used within a TablesProvider');
  }
  return context;
};

export const TablesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tables, setTables] = useState<Table[]>(generateTables());
  const [currentTable, setCurrentTable] = useState<Table | null>(null);
  const [tableItems, setTableItems] = useState<Record<string, BillItem[]>>({});
  
  const selectTable = (table: Table) => {
    setCurrentTable(table);
    
    // Initialize table items if not already
    if (!tableItems[table.id]) {
      setTableItems(prev => ({
        ...prev,
        [table.id]: []
      }));
    }
    
    // Mark table as having an order in progress
    setTables(prev => 
      prev.map(t => 
        t.id === table.id 
          ? { ...t, orderInProgress: true, occupied: true } 
          : t
      )
    );
  };
  
  const clearCurrentTable = () => {
    setCurrentTable(null);
  };
  
  const addItemToTable = (item: MenuItem) => {
    if (!currentTable) return;
    
    setTableItems(prev => {
      const tableId = currentTable.id;
      const items = prev[tableId] || [];
      
      const existingItem = items.find(i => i.itemId === item.id);
      if (existingItem) {
        return {
          ...prev,
          [tableId]: items.map(i => 
            i.itemId === item.id 
              ? { ...i, quantity: i.quantity + 1 } 
              : i
          )
        };
      }
      
      const newItem: BillItem = {
        itemId: item.id,
        name: item.name,
        price: item.price,
        quantity: 1
      };
      
      return {
        ...prev,
        [tableId]: [...items, newItem]
      };
    });
  };
  
  const removeItemFromTable = (itemId: string) => {
    if (!currentTable) return;
    
    setTableItems(prev => {
      const tableId = currentTable.id;
      const items = prev[tableId] || [];
      
      const updatedItems = items.filter(item => item.itemId !== itemId);
      
      // Check if this was the last item and update table status if needed
      if (updatedItems.length === 0) {
        setTables(prevTables => 
          prevTables.map(t => 
            t.id === tableId 
              ? { ...t, orderInProgress: false, occupied: false } 
              : t
          )
        );
      }
      
      return {
        ...prev,
        [tableId]: updatedItems
      };
    });
  };
  
  const updateItemQuantity = (itemId: string, quantity: number) => {
    if (!currentTable) return;
    
    if (quantity <= 0) {
      removeItemFromTable(itemId);
      return;
    }
    
    setTableItems(prev => {
      const tableId = currentTable.id;
      const items = prev[tableId] || [];
      
      return {
        ...prev,
        [tableId]: items.map(item => 
          item.itemId === itemId 
            ? { ...item, quantity } 
            : item
        )
      };
    });
  };
  
  const completeOrder = async () => {
    if (!currentTable) return;
    
    try {
      const items = tableItems[currentTable.id] || [];
      
      // Don't proceed if there are no items
      if (items.length === 0) {
        toast.error('Cannot complete empty order');
        return;
      }
      
      // Calculate total
      const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
      
      // Generate order number (timestamp-based)
      const orderNumber = `ORD-${Date.now().toString().slice(-6)}`;
      
      // Save order to database
      const { error } = await supabase.from('orders').insert({
        table_id: currentTable.id,
        table_block: currentTable.block,
        table_number: currentTable.number,
        items: items,
        total: total,
        order_number: orderNumber
      });
      
      if (error) {
        console.error('Failed to save order:', error);
        toast.error('Failed to save order to database');
        return;
      }
      
      // Clear the table items
      setTableItems(prev => ({
        ...prev,
        [currentTable.id]: []
      }));
      
      // Update table status
      setTables(prev => 
        prev.map(t => 
          t.id === currentTable.id 
            ? { ...t, orderInProgress: false, occupied: false } 
            : t
        )
      );
      
      toast.success(`Order #${orderNumber} for Table ${currentTable.block}${currentTable.number} has been completed`);
      clearCurrentTable();
    } catch (error) {
      toast.error('Failed to complete order');
      console.error('Failed to complete order:', error);
    }
  };
  
  const getTableItems = (tableId: string): BillItem[] => {
    return tableItems[tableId] || [];
  };
  
  return (
    <TablesContext.Provider 
      value={{ 
        tables, 
        currentTable, 
        tableItems,
        selectTable, 
        clearCurrentTable, 
        addItemToTable,
        removeItemFromTable,
        updateItemQuantity,
        completeOrder,
        getTableItems
      }}
    >
      {children}
    </TablesContext.Provider>
  );
};
