
import { Transaction } from '../data/mockData';

export interface DailyTotal {
  date: string;
  totalAmount: number;
  transactions: Transaction[];
  formattedDate: string;
}
