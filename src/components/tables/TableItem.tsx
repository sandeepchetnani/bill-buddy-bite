
import React from 'react';
import { Table } from '../../types/waiter';
import { useTables } from '../../context/TablesContext';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface TableItemProps {
  table: Table;
}

const TableItem: React.FC<TableItemProps> = ({ table }) => {
  const { selectTable } = useTables();
  const navigate = useNavigate();
  
  const handleTableClick = () => {
    // First select the table in context
    selectTable(table);
    // Then navigate to the order page
    navigate('/order');
    console.log(`Selected table ${table.id} and navigating to order page`);
  };
  
  return (
    <div
      onClick={handleTableClick}
      className={cn(
        "h-24 w-full border rounded-md flex flex-col items-center justify-center transition-colors cursor-pointer",
        table.occupied 
          ? "bg-amber-100 border-amber-300" 
          : "bg-green-50 border-green-200 hover:bg-green-100",
        table.orderInProgress && "ring-2 ring-blue-400"
      )}
    >
      <span className="text-xl font-bold">Table {table.block}{table.number}</span>
      <span className={cn(
        "text-sm mt-1",
        table.occupied ? "text-amber-700" : "text-green-700"
      )}>
        {table.orderInProgress 
          ? "Order in progress" 
          : table.occupied 
            ? "Occupied" 
            : "Available"}
      </span>
    </div>
  );
};

export default TableItem;
