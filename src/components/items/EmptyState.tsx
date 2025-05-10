
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground">No menu items available.</p>
      <p className="mt-2 text-sm">Please add items in the Menu Management section.</p>
    </div>
  );
};

export default EmptyState;
