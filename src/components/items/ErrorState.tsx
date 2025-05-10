
import React from 'react';

interface ErrorStateProps {
  error: string;
}

const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="p-8 text-center">
      <p className="text-red-500">{error}</p>
      <p className="mt-2">Please try again later or contact support.</p>
    </div>
  );
};

export default ErrorState;
