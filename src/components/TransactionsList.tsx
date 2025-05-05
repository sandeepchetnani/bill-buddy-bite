
import React from 'react';
import { Transaction } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatDate, printBill } from '../utils/billUtils';
import { FileText, Printer } from 'lucide-react';
import { Button } from './ui/button';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
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
                
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handlePrint(transaction)}
                  className="w-full mt-4 flex items-center justify-center"
                >
                  <Printer className="mr-2 h-4 w-4" /> Print Bill
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
