
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Play, Square } from 'lucide-react';
import { PermissionWrapper } from '@/components/common/PermissionWrapper';
import { SprintClosureDialog } from './SprintClosureDialog';

interface Sprint {
  id: string;
  name: string;
  status: 'created' | 'running' | 'completed';
}

interface Story {
  id: string;
  title: string;
  status: 'to_do' | 'in_progress' | 'qa' | 'done';
}

interface SprintHeaderProps {
  sprint: Sprint;
  stories: Story[];
  onGoBack: () => void;
  onStatusChange: () => void;
  onMoveStoriesToBacklog?: (storyIds: string[]) => Promise<void>;
  fetchSprintData: () => void;
}

export const SprintHeader: React.FC<SprintHeaderProps> = ({
  sprint,
  stories,
  onGoBack,
  onStatusChange,
  onMoveStoriesToBacklog,
  fetchSprintData
}) => {
  const [showClosureDialog, setShowClosureDialog] = useState(false);
  const [ isCompleteSprint, setIsCompleteSprint ] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'running':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusButtonText = () => {
    if (sprint.status === 'created') {
      return 'Start Sprint';
    } else if (sprint.status === 'running') {
      return 'Close Sprint';
    }
    return null;
  };

  const getStatusButtonIcon = () => {
    if (sprint.status === 'created') {
      return <Play className="h-4 w-4 mr-2" />;
    } else if (sprint.status === 'running') {
      return <Square className="h-4 w-4 mr-2" />;
    }
    return null;
  };

  const handleStatusChange = () => {
    if (sprint.status === 'created') {
      onStatusChange();
      return;
    }
    if (sprint.status === 'running') {
      // Show validation dialog for completing sprint
      setShowClosureDialog(true);
      setIsCompleteSprint(true);
    } else{
      setShowClosureDialog(true);
    }
  };

  const handleSprintClosure = async () => {
    const todoStories = stories.filter(story => story.status === 'to_do');
    
    if (todoStories.length > 0 && onMoveStoriesToBacklog) {
      // Move to do stories back to backlog
      await onMoveStoriesToBacklog(todoStories.map(story => story.id));
    }
    
    // Close the sprint
    onStatusChange(); 
    setTimeout(() => {
      fetchSprintData();
    }, 1000);
    setShowClosureDialog(false);
  };

  const handleSprintCompletion = () => {
    // Complete the sprint
    onStatusChange();
    setTimeout(() => {
      fetchSprintData();
    }, 1000);
    setShowClosureDialog(false);
    setIsCompleteSprint(false);
  };

  // Categorize stories for validation
  const todoStories = stories.filter(story => story.status === 'to_do');
  const inProgressStories = stories.filter(story => story.status === 'in_progress');
  const qaStories = stories.filter(story => story.status === 'qa');

  return (
    <>
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={onGoBack}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sprints
        </Button>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{sprint.name}</h1>
            <p className="text-gray-600 mt-1">Sprint Management Dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <Badge className={getStatusColor(sprint.status)}>
              {sprint.status.toUpperCase()}
            </Badge>
            <PermissionWrapper action="editProject">
              {(sprint.status === 'created' || sprint.status === 'running') && (
                <Button onClick={handleStatusChange} className="bg-blue-600 hover:bg-blue-700">
                  {getStatusButtonIcon()}
                  {getStatusButtonText()}
                </Button>
              )}
            </PermissionWrapper>
          </div>
        </div>
      </div>

      <SprintClosureDialog
        open={showClosureDialog}
        onClose={() => {
          setShowClosureDialog(false);
          setIsCompleteSprint(false);
          fetchSprintData();
        }}
        onConfirm={handleSprintClosure}
        todoStories={todoStories}
        onSubmitComplete={handleSprintCompletion}
        isCompleteSprint={isCompleteSprint}
        inProgressStories={inProgressStories}
        qaStories={qaStories}
      />
    </>
  );
};
