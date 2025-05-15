
import { Transaction } from '../data/mockData';
import { toast } from "../components/ui/use-toast";
import { format } from 'date-fns';

interface DailyTotal {
  date: string;
  totalAmount: number;
  transactions: Transaction[];
  formattedDate: string;
}

export const downloadTransactionsCSV = (
  filteredDailyTotals: DailyTotal[],
  startDate?: Date,
  endDate?: Date
) => {
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

  // Sort transactions by date and time in descending order (newest first)
  transactionsToExport.sort((a, b) => {
    const dateA = new Date(a.date);
    const dateB = new Date(b.date);
    return dateB.getTime() - dateA.getTime(); // Descending order (newest first)
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
