
import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

interface GroomingHeaderProps {
  onBack: () => void;
}

export const GroomingHeader = ({ onBack }: GroomingHeaderProps) => {
  return (
    <div className="mb-6">
      <Button variant="outline" onClick={onBack} className="mb-4">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>
      <h1 className="text-3xl font-bold text-gray-900">Groom User Story</h1>
    </div>
  );
};
