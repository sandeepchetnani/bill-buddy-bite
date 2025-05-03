
import React from 'react';
import { Transaction } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { formatCurrency, formatDate } from '../utils/billUtils';

interface TransactionsListProps {
  transactions: Transaction[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ transactions }) => {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Recent Transactions</h2>
      
      {transactions.length === 0 ? (
        <p className="text-muted-foreground">No transactions yet.</p>
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
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default TransactionsList;
