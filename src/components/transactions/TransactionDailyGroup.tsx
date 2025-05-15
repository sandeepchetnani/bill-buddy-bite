
import React from 'react';
import { formatCurrency } from '../../utils/billUtils';
import { Transaction } from '../../data/mockData';
import {
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '../ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '../ui/table';

interface DailyTotal {
  date: string;
  totalAmount: number;
  transactions: Transaction[];
  formattedDate: string;
}

interface TransactionDailyGroupProps {
  dailyTotal: DailyTotal;
}

const TransactionDailyGroup: React.FC<TransactionDailyGroupProps> = ({ dailyTotal }) => {
  return (
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
  );
};

export default TransactionDailyGroup;
