
import React from 'react';

const EmptyState: React.FC = () => {
  return (
    <div className="p-8 text-center">
      <p className="text-muted-foreground text-lg">No menu items available.</p>
      <p className="mt-2 text-sm">Please add items in the Menu Management section.</p>
      <p className="mt-4 text-xs text-gray-400">You can add new items from the main dashboard → Menu Management</p>
    </div>
  );
};

export default EmptyState;
