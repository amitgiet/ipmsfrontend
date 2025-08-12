
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface CreateSprintActionsProps {
  onBack: () => void;
  onCreateSprint: () => void;
  creating: boolean;
  sprintName: string;
  startDate: Date | null;
  selectedStories: string[];
}

export const CreateSprintActions = ({
  onBack,
  onCreateSprint,
  creating,
  sprintName,
  startDate,
  selectedStories
}: CreateSprintActionsProps) => {
  const isValid = sprintName.trim() && startDate && selectedStories.length > 0;

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack} disabled={creating}>
            Cancel
          </Button>
          
          <div className="flex items-center space-x-4">
            {selectedStories.length === 0 && (
              <p className="text-sm text-orange-600">
                Please select at least one user story
              </p>
            )}
            <Button 
              onClick={onCreateSprint} 
              disabled={!isValid || creating}
              className="min-w-[120px]"
            >
              {creating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Sprint'
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
