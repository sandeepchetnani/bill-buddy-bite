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
import { Calendar, ChevronLeft } from 'lucide-react';

interface DailyTotal {
  date: string;
  totalAmount: number;
  transactions: Transaction[];
  formattedDate: string;
}

// Function to convert date to IST (UTC+5:30)
const convertToIST = (date: Date): Date => {
  // Create a new date with IST timezone string
  return new Date(date.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
};

// Function to determine business day (4am to next day 4am) in IST
const getBusinessDay = (date: Date): Date => {
  // Convert to IST
  const istDate = convertToIST(date);
  const hours = istDate.getHours();
  
  // If time is before 4am IST, consider it part of the previous day
  if (hours < 4) {
    const previousDay = new Date(istDate);
    previousDay.setDate(istDate.getDate() - 1);
    return previousDay;
  }
  return istDate;
};

// Format for business day display in IST
const formatBusinessDay = (date: Date): string => {
  // We'll format directly using the IST date object
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'Asia/Kolkata' // This ensures it's displayed in IST
  });
};

const TransactionHistory: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { transactions } = useBill();
  const [dailyTotals, setDailyTotals] = useState<DailyTotal[]>([]);

  useEffect(() => {
    // Create a Map to ensure unique business days
    const businessDayMap = new Map<string, DailyTotal>();
    
    // Group transactions by business day in IST and calculate daily totals
    transactions.forEach(transaction => {
      // Convert transaction date to Date object
      const transactionDate = new Date(transaction.date);
      
      // Get business day (4am to 4am) in IST
      const businessDay = getBusinessDay(transactionDate);
      
      // Format business day as YYYY-MM-DD for consistent grouping
      const dateKey = businessDay.toISOString().split('T')[0];
      
      if (!businessDayMap.has(dateKey)) {
        businessDayMap.set(dateKey, {
          date: dateKey,
          totalAmount: 0,
          transactions: [],
          formattedDate: formatBusinessDay(businessDay)
        });
      }
      
      const dailyTotal = businessDayMap.get(dateKey)!;
      dailyTotal.totalAmount += Number(transaction.total);
      dailyTotal.transactions.push({
        ...transaction,
        // Keep the original date for display within the transaction list
        date: transaction.date
      });
    });
    
    // Convert the Map to an array and sort by date (newest first)
    const sortedDailyTotals = Array.from(businessDayMap.values()).sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setDailyTotals(sortedDailyTotals);
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

      {dailyTotals.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No transaction history available</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-200px)]">
          <Accordion type="single" collapsible className="w-full">
            {dailyTotals.map((dailyTotal) => (
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
                            {new Date(transaction.date).toLocaleTimeString('en-IN', { 
                              hour: '2-digit', 
                              minute: '2-digit',
                              timeZone: 'Asia/Kolkata' // Display time in IST
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
