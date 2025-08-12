
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { User } from 'lucide-react';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready';
  storyPoints?: number;
}

interface SprintBacklogSelectorProps {
  loading: boolean;
  readyStories: UserStory[];
  selectedStories: string[];
  onStorySelection: (storyId: string, checked: boolean) => void;
}

export const SprintBacklogSelector = ({
  loading,
  readyStories,
  selectedStories,
  onStorySelection
}: SprintBacklogSelectorProps) => {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Sprint Backlog</CardTitle>
        <CardDescription>
          Select user stories that are ready for this sprint
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : readyStories.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>No ready user stories found.</p>
            <p className="text-sm">Complete user story grooming first.</p>
          </div>
        ) : (
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {readyStories.map((story) => (
              <div
                key={story.id}
                className="flex items-start space-x-3 p-3 border rounded-lg hover:bg-gray-50"
              >
                <Checkbox
                  checked={selectedStories.includes(story.id)}
                  onCheckedChange={(checked) => 
                    onStorySelection(story.id, checked as boolean)
                  }
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-sm">{story.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 text-xs rounded-full border ${getPriorityColor(story.priority)}`}>
                        {story.priority.toUpperCase()}
                      </span>
                      {story.storyPoints && (
                        <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                          {story.storyPoints} pts
                        </span>
                      )}
                    </div>
                  </div>
                  {story.description && (
                    <p className="text-xs text-gray-600 line-clamp-2">
                      {story.description}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
        
        {selectedStories.length > 0 && (
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              {selectedStories.length} user stories selected for this sprint
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
