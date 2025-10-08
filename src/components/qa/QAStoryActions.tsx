
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, Bug, Plus } from 'lucide-react';
import { useUserRole } from '@/hooks/useUserRole';
import { toast } from 'react-toastify';
import { areAllTasksCompleted } from '@/utils/storyValidation';
import { BugReportDialog } from './BugReportDialog';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface QAStoryActionsProps {
  storyId: string;
  currentStatus: string;
  onStatusUpdate: () => void;
}

export const QAStoryActions = ({ storyId, currentStatus, onStatusUpdate }: QAStoryActionsProps) => {
  const { isQA } = useUserRole();
  const [showBugDialog, setShowBugDialog] = useState(false);

  // Only show for QA users when story is in qa status
  if (!isQA || currentStatus !== 'qa') {
    return null;
  }

  const handleMarkAsDone = async () => {
    try {
      // Check if all tasks are completed before marking as done
      const allTasksCompleted = await areAllTasksCompleted(storyId);
      
      if (!allTasksCompleted) {
        toast.error("All tasks must be completed before marking the story as done.");
        return;
      }


      const { error } = await apiCall(allRoutes.stories.update(storyId), 'PUT', { status: 'done' });

      if (error) {
        toast.error("Failed to update story status");
        return;
      }

      toast.success("Story marked as completed");

      onStatusUpdate();
    } catch (error) {
      toast.error("Failed to update story status");
    }
  };

  const handleBugsSubmitted = () => { 
    onStatusUpdate();
  };

  return (
    <>
      {/* <Card className="bg-orange-50 border-orange-200">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center gap-2">
              <Bug className="h-5 w-5 text-orange-600" />
              QA Review Actions
            </CardTitle>
            <Badge variant="outline" className="bg-orange-100 text-orange-800 border-orange-300">
              In QA Review
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Button
              onClick={() => setShowBugDialog(true)}
              variant="outline"
              className="flex-1 border-red-300 text-red-700 hover:bg-red-100"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Issue
            </Button>
            <Button
              onClick={handleMarkAsDone}
              className="flex-1 bg-green-600 hover:bg-green-700"
            >
              <CheckCircle2 className="h-4 w-4 mr-2" />
              Mark as Done
            </Button>
          </div>
          <p className="text-sm text-orange-700 mt-3">
            Review the story and either report issues found during testing or approve it as complete.
          </p>
        </CardContent>
      </Card> */}

      <BugReportDialog
        isOpen={showBugDialog}
        onClose={() => setShowBugDialog(false)}
        storyId={storyId}
        onBugsSubmitted={handleBugsSubmitted}
      />
    </>
  );
};
