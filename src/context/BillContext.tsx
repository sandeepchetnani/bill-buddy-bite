
import React, { createContext, useContext, useState, useEffect } from 'react';
import { BillItem, Bill, createBill } from '../utils/billUtils';
import { Transaction } from '../data/mockData';
import { supabase } from '../integrations/supabase/client';
import { toast } from "../components/ui/sonner";
import { Json } from '../integrations/supabase/types';

interface BillContextType {
  currentItems: BillItem[];
  addItem: (item: BillItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearItems: () => void;
  finalizeBill: (customBillNumber?: string) => Promise<Bill>;
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  deleteTransaction: (id: string) => Promise<void>;
  editTransaction: (id: string) => void;
  isEditing: boolean;
  currentEditingId: string | null;
  cancelEditing: () => void;
  nextBillNumber: string;
}

const BillContext = createContext<BillContextType | undefined>(undefined);

export const BillProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentItems, setCurrentItems] = useState<BillItem[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditingId, setCurrentEditingId] = useState<string | null>(null);
  const [nextBillNumber, setNextBillNumber] = useState<string>('bill-1');

  // Fetch transactions from Supabase when component mounts
  useEffect(() => {
    fetchTransactions();
  }, []);

  // Determine next bill number based on existing transactions
  useEffect(() => {
    if (transactions.length > 0) {
      // Find bills with the format "bill-X"
      const billNumberPattern = /^bill-(\d+)$/;
      const billNumbers = transactions
        .map(t => t.billNumber)
        .filter(bn => billNumberPattern.test(bn))
        .map(bn => {
          const match = bn.match(billNumberPattern);
          return match ? parseInt(match[1], 10) : 0;
        });
      
      // Find the highest bill number
      const highestBillNumber = billNumbers.length > 0 ? Math.max(...billNumbers) : 0;
      
      // Set the next bill number
      setNextBillNumber(`bill-${highestBillNumber + 1}`);
    } else {
      setNextBillNumber('bill-1');
    }
  }, [transactions]);

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });
      
      if (fetchError) {
        throw fetchError;
      }
      
      // Transform the data to match our Transaction type
      const formattedTransactions = data.map((transaction): Transaction => ({
        id: transaction.id,
        billNumber: transaction.bill_number,
        date: transaction.date,
        total: Number(transaction.total),
        items: transaction.items as unknown as BillItem[]
      }));
      
      setTransactions(formattedTransactions);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setError('Failed to load transactions');
      toast.error('Failed to load transactions');
    } finally {
      setIsLoading(false);
    }
  };

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

  const finalizeBill = async (customBillNumber?: string): Promise<Bill> => {
    // Use the automatic bill number if none is provided
    const billNumberToUse = customBillNumber?.trim() || nextBillNumber;
    
    const newBill = createBill(currentItems, billNumberToUse);
    
    // Create a new transaction record to save in Supabase
    const transactionData = {
      bill_number: newBill.billNumber,
      date: newBill.date.toISOString(),
      total: newBill.total,
      items: currentItems as unknown as Json
    };
    
    try {
      let data;
      let error;
      
      // If we're editing, update the existing transaction
      if (isEditing && currentEditingId) {
        const response = await supabase
          .from('transactions')
          .update(transactionData)
          .eq('id', currentEditingId)
          .select()
          .single();
          
        data = response.data;
        error = response.error;
      } else {
        // Otherwise insert a new transaction
        const response = await supabase
          .from('transactions')
          .insert(transactionData)
          .select()
          .single();
          
        data = response.data;
        error = response.error;
      }
      
      if (error) throw error;
      
      // Create a transaction to add to or update in our local state
      const newTransaction: Transaction = {
        id: data.id,
        billNumber: data.bill_number,
        date: data.date,
        total: Number(data.total),
        items: data.items as unknown as BillItem[]
      };
      
      // Update the local state with the new or updated transaction
      if (isEditing && currentEditingId) {
        // Replace the edited transaction in the array
        setTransactions(prev => 
          prev.map(t => t.id === currentEditingId ? newTransaction : t)
        );
      } else {
        // Add the new transaction to the beginning of the array
        setTransactions(prev => [newTransaction, ...prev]);
        
        // After successful save, update the next bill number
        setNextBillNumber(`bill-${parseInt(billNumberToUse.split('-')[1], 10) + 1}`);
      }
      
      // Clear current items if not in editing mode
      if (!isEditing) {
        clearItems();
      }
      
      // Reset editing state if we were editing
      if (isEditing) {
        setIsEditing(false);
        setCurrentEditingId(null);
      }
      
      return newBill;
    } catch (err) {
      console.error('Error saving transaction:', err);
      toast.error('Error saving bill to database');
      throw err;
    }
  };

  // Function to delete a transaction
  const deleteTransaction = async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('transactions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      // Update the local state by removing the deleted transaction
      setTransactions(prevTransactions => 
        prevTransactions.filter(transaction => transaction.id !== id)
      );
      toast.success("Transaction deleted successfully");
    } catch (err) {
      console.error('Error deleting transaction:', err);
      toast.error('Error deleting transaction');
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start editing a transaction
  const editTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id);
    if (transaction) {
      setCurrentItems(transaction.items);
      setIsEditing(true);
      setCurrentEditingId(id);
      toast.info("Now editing bill: " + transaction.billNumber);
    }
  };

  // Function to cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setCurrentEditingId(null);
    clearItems();
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
      isLoading,
      error,
      deleteTransaction,
      editTransaction,
      isEditing,
      currentEditingId,
      cancelEditing,
      nextBillNumber
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
