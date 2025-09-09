import React from 'react';
import LoadingSpinner from '@/components/common/LoadingSpinner';

interface TableLoaderProps {
  loading: boolean;
  emptyMessage?: string;
  children: React.ReactNode;
  loadingMessage?: string;
  className?: string;
}

export const TableLoader: React.FC<TableLoaderProps> = ({
  loading,
  emptyMessage = 'No data found',
  children,
  loadingMessage = 'Loading data...',
  className = ''
}) => {
  if (loading) {
    return (
      <div className={`border rounded-lg overflow-hidden ${className}`}>
        <div className="flex flex-col items-center justify-center py-12">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600">{loadingMessage}</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

interface TableEmptyStateProps {
  message?: string;
  action?: React.ReactNode;
  className?: string;
}

export const TableEmptyState: React.FC<TableEmptyStateProps> = ({
  message = 'No data found',
  action,
  className = ''
}) => {
  return (
    <div className={`border rounded-lg overflow-hidden ${className}`}>
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg mb-4">{message}</p>
        {action && <div className="mt-4">{action}</div>}
      </div>
    </div>
  );
};
