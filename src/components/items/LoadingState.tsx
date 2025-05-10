
import React from 'react';
import { Loader2 } from 'lucide-react';

const LoadingState: React.FC = () => {
  return (
    <div className="flex justify-center items-center p-12">
      <Loader2 className="h-8 w-8 animate-spin text-restaurant-primary" />
      <span className="ml-2 text-lg">Loading menu items...</span>
    </div>
  );
};

export default LoadingState;
