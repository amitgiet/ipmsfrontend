import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge, Send } from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface StoryComment {
  id: string;
  content: string;
  created_at: string;
  user: {
    name: string;
    role: string;
  };
}

interface CommentsSectionProps {
  comments: StoryComment[];
  newComment: string;
  onNewCommentChange: (value: string) => void;
  onAddComment: () => void;
  canAddComments?: boolean;
  readOnly?: boolean;
}

export const CommentsSection: React.FC<CommentsSectionProps> = ({
  comments,
  newComment,
  onNewCommentChange,
  onAddComment,
  canAddComments = true,
  readOnly = false
}) => {
  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-red-100 text-red-800';
      case 'team_lead':
        return 'bg-blue-100 text-blue-800';
      case 'product_owner':
        return 'bg-green-100 text-green-800';
      case 'developer':
        return 'bg-purple-100 text-purple-800';
      case 'qa':
        return 'bg-orange-100 text-orange-800';
      case 'client':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Comments</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 mb-4">
          {comments.map((comment) => (
            <div key={comment.id} className="border-l-4 border-blue-200 pl-4">
              <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{comment.user.name} ({comment.user.role.replace('_', ' ').toUpperCase()})</span>
                <span className="text-xs text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </span>
              </div>
              <p className="text-gray-700">{comment.content}</p>
            </div>
          ))}
          {comments.length === 0 && (
            <p className="text-gray-500 text-center py-4">No comments yet</p>
          )}
        </div>

        {!readOnly && canAddComments ? (
          <div className="flex gap-2">
            <Textarea
              value={newComment}
              onChange={(e) => onNewCommentChange(e.target.value)}
              placeholder="Add a comment..."
              className="flex-1"
              rows={3}
            />
            <Button
              onClick={onAddComment}
              disabled={!newComment.trim()}
              className="self-end"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        ) : readOnly && (
          <Alert className="bg-yellow-50">
            <Info className="h-4 w-4" />
            <AlertTitle>Comments are disabled when the story is marked as ready</AlertTitle>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
