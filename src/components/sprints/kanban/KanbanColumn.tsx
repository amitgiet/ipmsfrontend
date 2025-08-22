import React, { useEffect, useState } from 'react';
import { Droppable } from 'react-beautiful-dnd';
import { Badge } from '@/components/ui/badge';
import { StoryCard } from './StoryCard';

interface Story {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'ready' | 'in_progress' | 'qa' | 'done';
  story_points?: number;
  project_id: string;
}

interface KanbanColumnProps {
  columnId: string;
  title: string;
  status: 'ready' | 'in_progress' | 'qa' | 'done';
  stories: Story[];
  sprintStatus: 'created' | 'running' | 'completed';
  userRole?: string;
  onViewStory: (story: Story) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  columnId,
  title,
  status,
  stories,
  sprintStatus,
  userRole,
  onViewStory
}) => {
  const [random,setRandom] = useState(0);
  const totalPoints = stories.reduce((sum, story) => sum + (story.story_points || 0), 0);

  console.log(status,stories);
   useEffect(() => {
    setTimeout(() => {
      setRandom(Math.random());
    }, 500);
   }, []);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-sm">
            {stories.length} stories
          </Badge>
          <Badge variant="outline" className="text-sm">
            {totalPoints} pts
          </Badge>
        </div>
      </div>
      
        <Droppable droppableId={status}  key={random}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`space-y-3 min-h-[400px] rounded-lg p-3 transition-colors ${
              snapshot.isDraggingOver ? 'bg-blue-50' : 'bg-gray-50'
            }`}
          >
            {stories.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <p>No stories in {title.toLowerCase()}</p>
              </div>
            ) : (
              stories.map((story, index) => (
                <StoryCard
                  story={story}
                  index={index}
                  sprintStatus={sprintStatus}
                  userRole={userRole}
                  onViewStory={onViewStory}
                />
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </div>
  );
};
