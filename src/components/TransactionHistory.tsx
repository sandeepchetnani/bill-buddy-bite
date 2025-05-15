import React, { useState, useEffect } from 'react';
import { useBill } from '../context/BillContext';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { ChevronLeft, Download, Calendar } from 'lucide-react';
import { toast } from "./ui/use-toast";
import { isWithinInterval, startOfDay, endOfDay } from 'date-fns';
import { getBusinessDay, formatBusinessDay } from '../utils/dateUtils';
import { downloadTransactionsCSV } from '../utils/csvExport';
import TransactionFilters from './transactions/TransactionFilters';
import TransactionsList from './transactions/TransactionsList';
import { DailyTotal } from '../types/transaction';

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

  const totalFilteredAmount = filteredDailyTotals.reduce(
    (sum, dailyTotal) => sum + dailyTotal.totalAmount,
    0
  );
  
  // Calculate total number of transactions
  const transactionCount = filteredDailyTotals.reduce(
    (count, dailyTotal) => count + dailyTotal.transactions.length,
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
            onClick={() => downloadTransactionsCSV(filteredDailyTotals, startDate, endDate)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Calendar className="text-restaurant-primary h-6 w-6" />
        </div>
      </div>

      <TransactionFilters 
        startDate={startDate}
        setStartDate={setStartDate}
        endDate={endDate}
        setEndDate={setEndDate}
        totalFilteredAmount={totalFilteredAmount}
        transactionCount={transactionCount}
        onClearFilters={handleClearFilters}
      />

      <TransactionsList filteredDailyTotals={filteredDailyTotals} />
    </div>
  );
};

export default TransactionHistory;
