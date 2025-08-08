
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';

interface ExcelValidationErrorsProps {
  errors: string[];
}

export const ExcelValidationErrors: React.FC<ExcelValidationErrorsProps> = ({ errors }) => {
  if (errors.length === 0) return null;

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        <div className="font-medium mb-2">Validation Errors ({errors.length}):</div>
        <div className="max-h-60 overflow-y-auto">
          <ul className="list-disc list-inside space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm">{error}</li>
            ))}
          </ul>
        </div>
      </AlertDescription>
    </Alert>
  );
};
