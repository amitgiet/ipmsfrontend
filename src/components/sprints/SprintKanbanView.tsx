import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';
import { canMoveCard } from './kanban/KanbanPermissions';
import { useProjectStatus } from '@/hooks/useProjectStatus';
import { SprintStatusWarning } from './kanban/SprintStatusWarning';
import { SprintBoardContent } from './kanban/SprintBoardContent';

interface Story {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_progress' | 'qa' | 'done';
  story_points?: number;
  project_id: string;
}

interface Sprint {
  id: string;
  project_id: string;
  sprint_name: string;
  status: 'created' | 'running' | 'completed';
}

interface SprintKanbanViewProps {
  stories: Story[];
  sprintId: string;
  sprintStatus: 'created' | 'running' | 'completed';
  onStoryUpdate?: (updatedStories: Story[]) => void;
  sprint?: Sprint;
}

export const SprintKanbanView = ({ stories, sprintId, sprintStatus, onStoryUpdate, sprint }: SprintKanbanViewProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userRole } = useUserRole();
  const { projectStatus, isLoadingStatus, isProjectInProgress } = useProjectStatus(stories, sprint);

  const handleViewStory = (story: Story) => {
    navigate(`/project/${story.project_id}/story/${story.id}/details`);
  };

  const updateStoryStatus = async (storyId: string, newStatus: 'to_do' | 'in_progress' | 'qa' | 'done') => {
    try {
      console.log('🔄 Updating story status:', { storyId, newStatus });
      
      const { error } = await supabase
        .from('user_stories')
        .update({ status: newStatus })
        .eq('id', storyId);

      if (error) {
        console.error('❌ Error updating story status:', error);
        toast({
          title: "Error",
          description: "Failed to update story status",
          variant: "destructive",
        });
        return false;
      }

      console.log('✅ Story status updated successfully');
      toast({
        title: "Success",
        description: "Story status updated successfully",
      });
      
      return true;
    } catch (error) {
      console.error('❌ Error in updateStoryStatus:', error);
      toast({
        title: "Error",
        description: "Failed to update story status",
        variant: "destructive",
      });
      return false;
    }
  };

  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // If there's no destination, do nothing
    if (!destination) {
      return;
    }

    // If the story is dropped in the same position, do nothing
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }

    // Get the new status from the destination column
    const newStatus = destination.droppableId as 'to_do' | 'in_progress' | 'qa' | 'done';
    const sourceStatus = source.droppableId;
    
    // Get project ID from the story
    const story = stories.find(s => s.id === draggableId);
    const projectId = story?.project_id;
    
    // Check if the user has permission to move the card (now async)
    const permissionResult = await canMoveCard(sourceStatus, newStatus, sprintStatus, userRole, draggableId, projectId);
    
    if (!permissionResult.canMove) {
      toast({
        title: "Permission Denied",
        description: permissionResult.reason || "You don't have permission to perform this action.",
        variant: "destructive",
      });
      return;
    }
    
    // Optimistically update the local state first
    const updatedStories = stories.map(story => 
      story.id === draggableId 
        ? { ...story, status: newStatus }
        : story
    );

    // Update the parent component's state immediately for smooth UI
    if (onStoryUpdate) {
      onStoryUpdate(updatedStories);
    }

    // Then update the database in the background
    const success = await updateStoryStatus(draggableId, newStatus);
    
    // If the database update failed, revert the optimistic update
    if (!success && onStoryUpdate) {
      onStoryUpdate(stories); // Revert to original state
    }
  };

  console.log('🎯 SprintKanbanView - Total stories:', stories.length);
  console.log('🎯 SprintKanbanView - Project status:', projectStatus, 'Loading:', isLoadingStatus);

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Sprint Kanban Board</CardTitle>
        <SprintStatusWarning
          sprintStatus={sprintStatus}
          isProjectInProgress={isProjectInProgress}
          isLoadingStatus={isLoadingStatus}
          projectStatus={projectStatus}
        />
      </CardHeader>
      <CardContent>
        <SprintBoardContent
          stories={stories}
          sprintStatus={sprintStatus}
          userRole={userRole}
          onViewStory={handleViewStory}
          onDragEnd={onDragEnd}
        />
      </CardContent>
    </Card>
  );
};
