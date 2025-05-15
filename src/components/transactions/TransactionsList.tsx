
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { ScrollArea } from '../ui/scroll-area';
import { Accordion } from '../ui/accordion';
import TransactionDailyGroup from './TransactionDailyGroup';
import { Transaction } from '../../data/mockData';

interface DailyTotal {
  date: string;
  totalAmount: number;
  transactions: Transaction[];
  formattedDate: string;
}

interface TransactionsListProps {
  filteredDailyTotals: DailyTotal[];
}

const TransactionsList: React.FC<TransactionsListProps> = ({ filteredDailyTotals }) => {
  if (filteredDailyTotals.length === 0) {
    return (
      <Card className="text-center py-12">
        <CardContent>
          <p className="text-muted-foreground">No transaction history available</p>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <ScrollArea className="h-[calc(100vh-300px)]">
      <Accordion type="single" collapsible className="w-full">
        {filteredDailyTotals.map((dailyTotal) => (
          <TransactionDailyGroup 
            key={dailyTotal.date} 
            dailyTotal={dailyTotal} 
          />
        ))}
      </Accordion>
    </ScrollArea>
  );
};

export default TransactionsList;
