
import React, { useState, useEffect } from 'react';
import { formatDate, formatCurrency } from '../utils/billUtils';
import { useBill } from '../context/BillContext';
import { Transaction } from '../data/mockData';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Calendar, ChevronLeft, Database } from 'lucide-react';

interface DailyTotal {
  date: string;
  totalAmount: number;
  transactions: Transaction[];
  formattedDate: string;
}

const TransactionHistory: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { transactions } = useBill();
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);
  const [overallTotal, setOverallTotal] = useState<number>(0);

  useEffect(() => {
    // Group transactions by date and calculate daily totals
    const groupedByDate = transactions.reduce((acc: Record<string, DailyTotal>, transaction) => {
      // Extract the date part only for grouping (without time)
      const transactionDate = new Date(transaction.date);
      // Format as YYYY-MM-DD for consistent grouping
      const dateKey = transactionDate.toISOString().split('T')[0];
      
      if (!acc[dateKey]) {
        acc[dateKey] = {
          date: dateKey,
          totalAmount: 0,
          transactions: [],
          formattedDate: formatDate(transactionDate)
        };
      }
      
      acc[dateKey].totalAmount += Number(transaction.total);
      acc[dateKey].transactions.push({
        ...transaction,
        // Ensure the date is properly parsed as a Date object
        date: new Date(transaction.date).toISOString()
      });
      
      return acc;
    }, {});
    
    // Convert the object to an array and sort by date (newest first)
    const sortedDailyTotals = Object.values(groupedByDate).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setDailyTotals(sortedDailyTotals);
    
    // Calculate overall total
    const total = transactions.reduce((sum, transaction) => sum + Number(transaction.total), 0);
    setOverallTotal(total);
  }, [transactions]);

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 sm:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button 
            variant="ghost" 
            onClick={onBack} 
            className="mr-2"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-restaurant-primary">
            Transaction History
          </h1>
        </div>
        <Calendar className="text-restaurant-primary h-6 w-6" />
      </div>

      {/* Overall total display */}
      <Card className="mb-6 border-2 border-restaurant-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center">
            <Database className="h-5 w-5 mr-2 text-restaurant-primary" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-restaurant-primary">
            {formatCurrency(overallTotal)}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Based on {transactions.length} transactions
          </p>
        </CardContent>
      </Card>

      {dailyTotals.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No transaction history available</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-320px)]">
          <Accordion type="single" collapsible className="w-full">
            {dailyTotals.map((dailyTotal, index) => (
              <AccordionItem key={dailyTotal.date} value={dailyTotal.date}>
                <AccordionTrigger className="hover:bg-muted/50 px-4">
                  <div className="flex justify-between w-full">
                    <span className="font-medium">{dailyTotal.formattedDate}</span>
                    <span className="font-bold text-restaurant-primary">
                      {formatCurrency(dailyTotal.totalAmount)}
                    </span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="px-4 pt-2">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bill Number</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {dailyTotal.transactions.map(transaction => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.billNumber}</TableCell>
                          <TableCell>
                            {new Date(transaction.date).toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </TableCell>
                          <TableCell className="text-right">{formatCurrency(transaction.total)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </ScrollArea>
      )}
    </div>
  );
};

export default TransactionHistory;
