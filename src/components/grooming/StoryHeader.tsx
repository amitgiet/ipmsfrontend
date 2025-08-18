
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface UserStory {
  id: string;
  storyId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

interface StoryHeaderProps {
  story: UserStory;
}

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'urgent':
      return 'bg-red-100 text-red-800';
    case 'high':
      return 'bg-orange-100 text-orange-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'to_do':
      return 'bg-gray-100 text-gray-800';
    case 'in_grooming':
      return 'bg-blue-100 text-blue-800';
    case 'ready':
      return 'bg-green-100 text-green-800';
    case 'ready_for_estimate':
      return 'bg-purple-100 text-purple-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const StoryHeader: React.FC<StoryHeaderProps> = ({ story }) => {
  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              {story.storyId && (
                <Badge variant="outline" className="font-mono text-sm">
                  {story.storyId}
                </Badge>
              )}
              <Badge className={getPriorityColor(story.priority)}>
                {story.priority.toUpperCase()}
              </Badge>
              <Badge className={getStatusColor(story.status)}>
                {story.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <CardTitle className="text-2xl">{story.title}</CardTitle>
          </div>
          {story.storyPoints && (
            <div className="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full">
              <span className="text-lg font-bold text-blue-600">{story.storyPoints}</span>
            </div>
          )}
        </div>
        {story.description && (
          <CardDescription className="text-base mt-4">
            {story.description}
          </CardDescription>
        )}
      </CardHeader>
    </Card>
  );
};
