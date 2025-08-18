
import React from 'react';
import { Button } from '@/components/ui/button';
import { Check, Calculator } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface GroomingActionsProps {
  onMarkAsReady: () => void;
  onMarkReadyForEstimate?: () => void;
  isReady: boolean;
  hasStoryPoints: boolean;
  isReadyForEstimate?: boolean;
}

export const GroomingActions = ({ 
  onMarkAsReady, 
  onMarkReadyForEstimate,
  isReady, 
  hasStoryPoints,
  isReadyForEstimate = false
}: GroomingActionsProps) => {
  const { toast } = useToast();

  const handleMarkAsReady = () => {
    if (!hasStoryPoints) {
      toast({
        title: "Story Points Required",
        description: "Please add story points estimation before marking the story as ready.",
        variant: "destructive",
      });
      return;
    }
    onMarkAsReady();
  };

  const handleMarkReadyForEstimate = () => {
    if (onMarkReadyForEstimate) {
      onMarkReadyForEstimate();
    }
  };

  return (
    <div className="mt-6 flex flex-col items-center gap-3">
      <div className="flex gap-3">
        {!isReadyForEstimate && !isReady && onMarkReadyForEstimate && (
          <Button
            onClick={handleMarkReadyForEstimate}
            variant="outline"
            className="px-6 py-3 text-lg"
          >
            <Calculator className="h-5 w-5 mr-2" />
            Ready for Estimate
          </Button>
        )}
        
        <Button
          onClick={handleMarkAsReady}
          className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 text-lg"
          disabled={isReady}
        >
          <Check className="h-5 w-5 mr-2" />
          {isReady ? 'Already Ready' : 'Mark Ready'}
        </Button>
      </div>
      
      {!hasStoryPoints && !isReady && (
        <p className="text-sm text-red-600 text-center">
          Story points estimation is required to mark as ready
        </p>
      )}
      
      {isReadyForEstimate && !isReady && (
        <p className="text-sm text-blue-600 text-center">
          Story is marked as ready for estimate
        </p>
      )}
    </div>
  );
};
