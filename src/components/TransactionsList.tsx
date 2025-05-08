
import React, { useState } from 'react';
import { Transaction } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatDate, printBill } from '../utils/billUtils';
import { FileText, Printer, Loader2, Pencil, Trash2 } from 'lucide-react';
import { Button } from './ui/button';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";
import { useBill } from '../context/BillContext';

interface TransactionsListProps {
  transactions: Transaction[];
  isLoading?: boolean;
  error?: string | null;
}

const TransactionsList: React.FC<TransactionsListProps> = ({ 
  transactions, 
  isLoading = false,
  error = null 
}) => {
  const { deleteTransaction, editTransaction } = useBill();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handlePrint = (transaction: Transaction) => {
    // Convert transaction to bill format for printing
    const bill = {
      items: transaction.items,
      total: transaction.total,
      billNumber: transaction.billNumber,
      date: new Date(transaction.date)
    };
    
    printBill(bill);
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    await deleteTransaction(id);
    setDeletingId(null);
  };

  const handleEdit = (id: string) => {
    editTransaction(id);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Transactions</h2>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Loader2 className="mx-auto h-12 w-12 text-muted-foreground animate-spin" />
          <h3 className="mt-4 text-lg font-medium">Loading transactions...</h3>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Recent Transactions</h2>
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FileText className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-medium">Error loading transactions</h3>
          <p className="mt-2 text-muted-foreground">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Recent Transactions</h2>
      
      {transactions.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-medium">No transactions yet</h3>
          <p className="mt-2 text-muted-foreground">
            Create your first bill to see transactions here
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {transactions.map(transaction => (
            <Card key={transaction.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg font-semibold">
                    {transaction.billNumber}
                  </CardTitle>
                  <span className="font-bold text-restaurant-primary">
                    {formatCurrency(transaction.total)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {formatDate(transaction.date)}
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {transaction.items.length} items
                </p>
                <div className="mt-2 space-y-1">
                  {transaction.items.slice(0, 3).map(item => (
                    <div key={`${transaction.id}-${item.itemId}`} className="text-sm flex justify-between">
                      <span>{item.name} × {item.quantity}</span>
                      <span>{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  {transaction.items.length > 3 && (
                    <p className="text-sm text-muted-foreground">
                      +{transaction.items.length - 3} more items
                    </p>
                  )}
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => handlePrint(transaction)}
                    className="flex-1 flex items-center justify-center"
                  >
                    <Printer className="mr-2 h-4 w-4" /> Print
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(transaction.id)}
                    className="flex items-center justify-center"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex items-center justify-center text-red-500 hover:text-red-600 hover:border-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete Transaction</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to delete bill {transaction.billNumber}? 
                          This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={(e) => {
                            e.preventDefault();
                            handleDelete(transaction.id);
                          }}
                          className="bg-red-500 hover:bg-red-600"
                        >
                          {deletingId === transaction.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            "Delete"
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
