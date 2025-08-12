
import React from 'react';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import { KanbanColumn } from './KanbanColumn';

interface Story {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_progress' | 'qa' | 'done';
  story_points?: number;
  project_id: string;
}

interface SprintBoardContentProps {
  stories: Story[];
  sprintStatus: 'created' | 'running' | 'completed';
  userRole?: string;
  onViewStory: (story: Story) => void;
  onDragEnd: (result: DropResult) => Promise<void>;
}

const statusColumns = [
  { id: 'to_do', title: 'To Do', status: 'to_do' as const },
  { id: 'in_progress', title: 'In Progress', status: 'in_progress' as const },
  { id: 'qa', title: 'QA', status: 'qa' as const },
  { id: 'done', title: 'Done', status: 'done' as const },
];

export const SprintBoardContent: React.FC<SprintBoardContentProps> = ({
  stories,
  sprintStatus,
  userRole,
  onViewStory,
  onDragEnd
}) => {
  const getStoriesForStatus = (status: 'to_do' | 'in_progress' | 'qa' | 'done') => {
    return stories.filter(story => story.status === status);
  };

  if (stories.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-lg">No stories found in this sprint</p>
        <p className="text-sm">Add stories to the sprint to see them here</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {statusColumns.map(column => {
          const columnStories = getStoriesForStatus(column.status);
          
          return (
            <KanbanColumn
              key={column.id}
              columnId={column.id}
              title={column.title}
              status={column.status}
              stories={columnStories}
              sprintStatus={sprintStatus}
              userRole={userRole}
              onViewStory={onViewStory}
            />
          );
        })}
      </div>
    </DragDropContext>
  );
};
