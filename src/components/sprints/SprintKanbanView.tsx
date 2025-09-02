import React from 'react';
import { DropResult } from 'react-beautiful-dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useNavigate, useParams } from 'react-router-dom';
import { apiCall } from '@/services/apiCall';
import { toast } from 'react-toastify';
import { useUserRole } from '@/hooks/useUserRole';
import { canMoveCard } from './kanban/KanbanPermissions';
import { useProjectStatus } from '@/hooks/useProjectStatus';
import { SprintStatusWarning } from './kanban/SprintStatusWarning';
import { SprintBoardContent } from './kanban/SprintBoardContent';
import { allRoutes } from '@/services/routes';

interface Story {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'ready' | 'in_progress' | 'qa' | 'done';
  story_points?: number;
  project_id: string;
  sequence_number: number;
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

export const SprintKanbanView = ({ stories, sprintStatus, onStoryUpdate, sprint }: SprintKanbanViewProps) => {
  const { projectId, sprintId } = useParams();
  const navigate = useNavigate();
  const { userRole } = useUserRole();
  // const { projectStatus, isLoadingStatus, isProjectInProgress } = useProjectStatus();

  const handleViewStory = (story: Story) => {
    navigate(`/project/${projectId}/story/${story.id}/details`);
  };

  const updateStoryStatus = async (data: FormData, storyId: number) => {

    const { success } = await apiCall(allRoutes.stories.drag_drop_story(storyId), 'post', data);
    if (success) {
      toast.success("Story status updated successfully");
      return true;
    }
    return false;

  };

  const getNewSequenceNumber = (destinationIndex: number, stories: any[]) => {
    // Edge case: no stories
    if (!stories || stories.length === 0) return 1;

    if (destinationIndex === 0) {
      // Dropped at first → smaller than first
      return stories[0].sequence_number / 2;
    }

    if (destinationIndex === stories.length) {
      // Dropped at last → larger than last
      const lastSeq = stories[stories.length - 1].sequence_number;
      return lastSeq + lastSeq / 2;
    }

    // Dropped in between → average of neighbors
    const prevSeq = stories[destinationIndex - 1].sequence_number;
    const nextSeq = stories[destinationIndex].sequence_number;
    return (prevSeq + nextSeq) / 2;
  };


  const onDragEnd = async (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) {
      return;
    }

    // if (destination.droppableId === source.droppableId && destination.index === source.index) {
    //   return;
    // }

    const newStatus = destination.droppableId as 'ready' | 'in_progress' | 'qa' | 'done';
    const sourceStatus = source.droppableId;


    const story = stories.find(s => s.code === draggableId);

    if (!story) {
      toast.error("Story not found");
      return;
    }

    // const permissionResult = await canMoveCard(sourceStatus, newStatus, sprintStatus, userRole, projectId);


    // if (!permissionResult.canMove) {
    //   toast.error(permissionResult.reason || "You don't have permission to perform this action.");
    //   return;
    // }

    const updatedStories = stories.map(story =>
      story.code === draggableId
        ? { ...story, status: newStatus }
        : story
    );
 
    const newSequenceNumber = getNewSequenceNumber(destination.index, stories);

    const data = new FormData();
    data.append('project_id', projectId);
    data.append('sprint_id', sprintId);
    data.append('sequence_number', newSequenceNumber);
    data.append('status', newStatus);
    if (onStoryUpdate) {
      onStoryUpdate(updatedStories);
    }

    const success = await updateStoryStatus(data, story.id);

    if (!success && onStoryUpdate) {
      onStoryUpdate(stories);
    }
  };

  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Sprint Kanban Board</CardTitle>
        <SprintStatusWarning
          sprintStatus={sprintStatus}
          isProjectInProgress={true}
          isLoadingStatus={false}
          projectStatus="in-progress"
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
