
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
      <h2 className="text-xl font-semibold mb-3">Block {block}</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
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
