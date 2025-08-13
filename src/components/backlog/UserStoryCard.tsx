
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Eye, Edit, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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

interface UserStoryCardProps {
  story: UserStory;
  onUpdateStatus: (storyId: string, newStatus: UserStory['status']) => void;
  onUpdatePriority: (storyId: string, newPriority: UserStory['priority']) => void;
  onDelete: (storyId: string) => void;
  readOnly?: boolean;
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

export const UserStoryCard: React.FC<UserStoryCardProps> = ({
  story,
  onUpdateStatus,
  onUpdatePriority,
  onDelete,
  readOnly = false
}) => {
  const navigate = useNavigate();

  const handleViewStory = () => {
    navigate(`/project/${story.projectId}/story/${story.id}/groom`);
  };

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {story.storyId && (
                <Badge variant="outline" className="font-mono text-xs">
                  {story.storyId}
                </Badge>
              )}
              {!readOnly ? (
                <Select
                  value={story.priority}
                  onValueChange={(value) => onUpdatePriority(story.id, value as UserStory['priority'])}
                >
                  <SelectTrigger className={`w-24 h-6 text-xs ${getPriorityColor(story.priority)}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={getPriorityColor(story.priority)}>
                  {story.priority.toUpperCase()}
                </Badge>
              )}
              <Badge className={getStatusColor(story.status)}>
                {story.status.replace('_', ' ').toUpperCase()}
              </Badge>
            </div>
            <h3 className="font-semibold text-lg leading-tight">{story.title}</h3>
          </div>
          {story.storyPoints && (
            <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full ml-3">
              <span className="text-sm font-bold text-blue-600">{story.storyPoints}</span>
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        {story.description && (
          <CardDescription className="mb-4 line-clamp-2">
            {story.description}
          </CardDescription>
        )}
        <div className="flex items-center justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewStory}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Eye className="h-4 w-4 mr-1" />
              {readOnly ? 'View' : 'Groom'}
            </Button>
          </div>
          {!readOnly && (
            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete User Story</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete "{story.title}"? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => onDelete(story.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
