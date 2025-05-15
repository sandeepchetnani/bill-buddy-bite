
import React from 'react';
import { Button } from '../ui/button';
import { Calendar as CalendarIcon } from 'lucide-react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "../ui/popover";
import { Calendar as CalendarComponent } from "../ui/calendar";
import { format } from 'date-fns';
import { formatCurrency } from '../../utils/billUtils';
import { toast } from "../ui/use-toast";

interface TransactionFiltersProps {
  startDate: Date | undefined;
  setStartDate: (date: Date | undefined) => void;
  endDate: Date | undefined;
  setEndDate: (date: Date | undefined) => void;
  totalFilteredAmount: number;
  transactionCount: number;
  onClearFilters: () => void;
}

const TransactionFilters: React.FC<TransactionFiltersProps> = ({
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  totalFilteredAmount,
  transactionCount,
  onClearFilters
}) => {
  return (
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
        
        <Button variant="secondary" onClick={onClearFilters}>
          Clear Filters
        </Button>

        <div className="ml-auto text-right">
          <div className="flex flex-col">
            <div className="mb-2">
              <p className="text-sm text-muted-foreground">Total Revenue</p>
              <p className="text-xl font-bold text-restaurant-primary">{formatCurrency(totalFilteredAmount)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Transactions</p>
              <p className="text-lg font-medium">{transactionCount}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionFilters;
