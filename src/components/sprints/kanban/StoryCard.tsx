
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle } from 'lucide-react';
import { Draggable } from 'react-beautiful-dnd';

interface Story {
  id: number;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'ready' | 'in_progress' | 'qa' | 'done';
  story_points?: number;
  project_id: string;
  is_overworked?: boolean;
  total_logged_minutes?: number;
  estimated_minutes?: number;
}

interface StoryCardProps {
  story: Story;
  index: number;
  sprintStatus: 'created' | 'running' | 'completed';
  userRole?: string;
  onViewStory: (story: Story) => void;
}

const priorityColors = {
  low: 'bg-green-50 text-green-700 border-green-200',
  medium: 'bg-yellow-50 text-yellow-700 border-yellow-200',
  high: 'bg-orange-50 text-orange-700 border-orange-200',
  urgent: 'bg-red-50 text-red-700 border-red-200',
};

export const StoryCard: React.FC<StoryCardProps> = ({
  story,
  index,
  sprintStatus,
  userRole,
  onViewStory
}) => {
  const isDragDisabled = sprintStatus !== 'running' || !userRole || !['team_lead', 'developer', 'qa'].includes(userRole);
  return (
    <Draggable 
      key={story.code} 
      draggableId={story.code} 
      index={index}
      isDragDisabled={isDragDisabled}
    >
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`${
            !isDragDisabled ? 'cursor-grab' : 'cursor-default'
          } hover:shadow-md transition-all ${
            snapshot.isDragging ? 'shadow-lg rotate-3 bg-white' : ''
          } ${
            sprintStatus !== 'running' ? 'opacity-75' : ''
          }`}
        >
          <CardContent className="p-4">
            <div className="space-y-3">
              {/* Title first */}
              <h4 className="font-medium text-sm text-gray-900 break-words leading-tight">
                {story.title}
              </h4>
              
              {/* Badges section */}
              <div className="flex flex-wrap gap-1">
                {/* Priority badge */}
                <Badge className={priorityColors[story.priority]} variant="outline">
                  {story.priority}
                </Badge>
                
                {/* Overworked badge */}
                {story.is_overworked && (
                  <Badge variant="destructive" className="text-xs">
                    <AlertTriangle className="h-3 w-3 mr-1" />
                    Overworked
                  </Badge>
                )}
              </div>
              
              {/* Estimate badge */}
              {story.story_points && (
                <div className="flex justify-start">
                  <Badge variant="outline">
                    {story.story_points} pts
                  </Badge>
                </div>
              )}
              
              {/* Eye button at the bottom */}
              <div className="flex justify-end pt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewStory(story);
                  }}
                  className="h-8 w-8 p-0"
                >
                  <Eye className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
