import React from 'react';
import { AlertCircle } from 'lucide-react';

export const ErrorState: React.FC<{ message: string; onRetry?: () => void }> = ({
  message,
  onRetry,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-6 text-center bg-red-50 border border-red-200 rounded-2xl text-agri-danger">
      <AlertCircle className="w-8 h-8 mb-2" />
      <h4 className="font-semibold text-base">Error Loading Data</h4>
      <p className="text-sm mt-1 max-w-md">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-4 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-white bg-red-600 hover:bg-red-700 rounded-lg transition"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
