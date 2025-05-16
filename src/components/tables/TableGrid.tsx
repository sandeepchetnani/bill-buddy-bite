
import React from 'react';
import { useTables } from '../../context/TablesContext';
import TableBlock from './TableBlock';
import { TableBlock as TableBlockType } from '../../types/waiter';

const TableGrid = () => {
  const { tables } = useTables();
  
  // Group tables by block
  const groupedTables = tables.reduce((acc, table) => {
    const block = table.block;
    if (!acc[block]) {
      acc[block] = [];
    }
    acc[block].push(table);
    return acc;
  }, {} as Record<TableBlockType, typeof tables>);
  
  // Get blocks in order
  const blocks: TableBlockType[] = ['A', 'B', 'C', 'D', 'E'];
  
  return (
    <div className="space-y-8">
      {blocks.map(block => (
        <TableBlock 
          key={block} 
          block={block} 
          tables={groupedTables[block] || []} 
        />
      ))}
    </div>
  );
};

export default TableGrid;
