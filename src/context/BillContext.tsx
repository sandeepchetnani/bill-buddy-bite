import React, { createContext, useContext, useState } from 'react';
import { BillItem, Bill, createBill } from '../utils/billUtils';
import { Transaction } from '../data/mockData';

interface BillContextType {
  currentItems: BillItem[];
  addItem: (item: BillItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearItems: () => void;
  finalizeBill: () => Bill;
  transactions: Transaction[];
  addTransaction: (transaction: Transaction) => void;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentItems, setCurrentItems] = useState<BillItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const addItem = (item: BillItem) => {
    setCurrentItems(prevItems => {
      const existingItem = prevItems.find(i => i.itemId === item.itemId);
      if (existingItem) {
        return prevItems.map(i => 
          i.itemId === item.itemId 
            ? { ...i, quantity: i.quantity + item.quantity } 
            : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (itemId: string) => {
    setCurrentItems(prevItems => prevItems.filter(item => item.itemId !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }
    
    setCurrentItems(prevItems => 
      prevItems.map(item => 
        item.itemId === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearItems = () => {
    setCurrentItems([]);
  };

  const finalizeBill = () => {
    const newBill = createBill(currentItems);
    
    const newTransaction: Transaction = {
      id: `t${Date.now()}`, // Use timestamp for unique ID
      billNumber: newBill.billNumber,
      date: newBill.date.toISOString(),
      total: newBill.total,
      items: currentItems
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
    clearItems();
    
    return newBill;
  };

  const addTransaction = (transaction: Transaction) => {
    setTransactions(prev => [transaction, ...prev]);
  };

  return (
    <BillContext.Provider value={{
      currentItems,
      addItem,
      removeItem,
      updateQuantity,
      clearItems,
      finalizeBill,
      transactions,
      addTransaction
    }}>
      {children}
    </BillContext.Provider>
  );
};

export const useBill = () => {
  const context = useContext(BillContext);
  if (context === undefined) {
    throw new Error('useBill must be used within a BillProvider');
  }
  return context;
};
