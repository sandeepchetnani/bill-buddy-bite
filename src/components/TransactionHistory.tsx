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
import { Calendar as CalendarIcon, ChevronLeft, Download, Calendar } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "./ui/popover";
import { Calendar as CalendarComponent } from "./ui/calendar";
import { toast } from "./ui/use-toast";
import { format, isWithinInterval, startOfDay, endOfDay } from 'date-fns';

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
  const [filteredDailyTotals, setFilteredDailyTotals] = useState<DailyTotal[]>([]);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

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
    setFilteredDailyTotals(sortedDailyTotals);
  }, [transactions]);

  // Apply date filters
  useEffect(() => {
    if (!startDate && !endDate) {
      setFilteredDailyTotals(dailyTotals);
      return;
    }

    const filtered = dailyTotals.filter(dailyTotal => {
      const totalDate = new Date(dailyTotal.date);
      
      if (startDate && endDate) {
        return isWithinInterval(totalDate, { start: startOfDay(startDate), end: endOfDay(endDate) });
      } else if (startDate) {
        return totalDate >= startOfDay(startDate);
      } else if (endDate) {
        return totalDate <= endOfDay(endDate);
      }
      
      return true;
    });

    setFilteredDailyTotals(filtered);
  }, [startDate, endDate, dailyTotals]);

  const handleClearFilters = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    toast({
      title: "Filters cleared",
      description: "Showing all transactions"
    });
  };

  const downloadCSV = () => {
    // Get the filtered transactions or all if no filter
    const transactionsToExport = filteredDailyTotals.flatMap(dailyTotal => 
      dailyTotal.transactions.map(transaction => ({
        ...transaction,
        businessDay: dailyTotal.date
      }))
    );
    
    if (transactionsToExport.length === 0) {
      toast({
        title: "No transactions to export",
        description: "There are no transactions matching your filters",
        variant: "destructive"
      });
      return;
    }

    // Sort transactions by date and time in ascending order
    transactionsToExport.sort((a, b) => {
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      return dateA.getTime() - dateB.getTime(); // Ascending order
    });

    // Calculate total amount
    const totalAmount = transactionsToExport.reduce((sum, transaction) => sum + Number(transaction.total), 0);
    
    // CSV header
    let csvContent = "Bill Number,Date,Time,Amount,Items\n";
    
    // Add transaction rows
    transactionsToExport.forEach(transaction => {
      const date = new Date(transaction.date);
      const dateStr = date.toLocaleDateString('en-IN', { 
        year: 'numeric', 
        month: '2-digit', 
        day: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      const timeStr = date.toLocaleTimeString('en-IN', { 
        hour: '2-digit', 
        minute: '2-digit',
        timeZone: 'Asia/Kolkata'
      });
      
      // Create item details
      const itemsStr = transaction.items
        .map(item => `${item.name} (${item.quantity}x₹${item.price})`)
        .join('; ');
      
      csvContent += `${transaction.billNumber},${dateStr},${timeStr},${transaction.total},"${itemsStr}"\n`;
    });
    
    // Add total row
    csvContent += `\nTotal,,,${totalAmount},\n`;
    
    // Create and download the CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    // Create filename with date range if filters are applied
    let filename = 'transactions';
    if (startDate && endDate) {
      filename += `_${format(startDate, 'yyyy-MM-dd')}_to_${format(endDate, 'yyyy-MM-dd')}`;
    } else if (startDate) {
      filename += `_from_${format(startDate, 'yyyy-MM-dd')}`;
    } else if (endDate) {
      filename += `_until_${format(endDate, 'yyyy-MM-dd')}`;
    }
    filename += '.csv';
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast({
      title: "CSV Downloaded",
      description: `${transactionsToExport.length} transactions exported successfully`
    });
  };

  const totalFilteredAmount = filteredDailyTotals.reduce(
    (sum, dailyTotal) => sum + dailyTotal.totalAmount,
    0
  );

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
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={downloadCSV}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Calendar className="text-restaurant-primary h-6 w-6" />
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <div className="flex flex-wrap gap-4 items-end">
          <div className="space-y-2">
            <p className="text-sm font-medium">Start Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[180px] justify-start text-left ${!startDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <p className="text-sm font-medium">End Date</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-[180px] justify-start text-left ${!endDate && "text-muted-foreground"}`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <Button variant="secondary" onClick={handleClearFilters}>
            Clear Filters
          </Button>

          <div className="ml-auto text-right">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-xl font-bold text-restaurant-primary">{formatCurrency(totalFilteredAmount)}</p>
          </div>
        </div>
      </div>

      {filteredDailyTotals.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">No transaction history available</p>
          </CardContent>
        </Card>
      ) : (
        <ScrollArea className="h-[calc(100vh-300px)]">
          <Accordion type="single" collapsible className="w-full">
            {filteredDailyTotals.map((dailyTotal) => (
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
