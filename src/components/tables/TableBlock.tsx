
import React from 'react';
import { Table, TableBlock as TableBlockType } from '../../types/waiter';
import TableItem from './TableItem';

interface TableBlockProps {
  block: TableBlockType;
  tables: Table[];
}

const TableBlock: React.FC<TableBlockProps> = ({ block, tables }) => {
  return (
    <div>
      <h2 className="text-lg sm:text-xl font-semibold mb-2 sm:mb-3">Block {block}</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {tables
          .sort((a, b) => a.number.localeCompare(b.number))
          .map(table => (
            <TableItem key={table.id} table={table} />
          ))}
      </div>
    </div>
  );
};

export default TableBlock;
