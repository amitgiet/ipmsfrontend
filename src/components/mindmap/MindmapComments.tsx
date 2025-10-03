
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Send, Trash2 } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface MindmapComment {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  author_role: string;
  created_at: string;
  user_id?: string;
  user?: {
    name: string;
    role: string;
  };
}

interface MindmapCommentsProps {
  projectId: string;
  nodeId?: string;
}

export const MindmapComments = ({ projectId, nodeId }: MindmapCommentsProps) => {
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<MindmapComment[]>([]);
  const [loading, setLoading] = useState(false);
  
  const MAX_CHARACTERS = 500;
  
  const getCharacterCount = (text: string) => {
    return text.length;
  };
  
  const characterCount = getCharacterCount(commentText);
  const isOverLimit = characterCount > MAX_CHARACTERS;
  const isNearLimit = characterCount > MAX_CHARACTERS * 0.8;
  const handleDeleteComment = async (commentId: string) => {
    // Remove comment from local state
    const { data, error } = await apiCall(allRoutes.comments.delete(projectId, 'mindmap', commentId), 'delete');
    if (error) {
      console.error('❌ Error deleting comment:', error);
      throw error;
    }
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const canDeleteComment = (comment: MindmapComment) => {
    if (!currentUser) return false;
    return currentUser.id === comment.user_id || currentUser.email === comment.author_email;
  };

  const getTimestamp = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'product_owner':
        return 'bg-green-100 text-green-800';
      case 'admin':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const fetchComments = async () => {
    const { data, error } = await apiCall(allRoutes.comments.get(projectId, 'mindmap'), 'get');
    if (error) {
      console.error('❌ Error fetching comments:', error);
      throw error;
    }
    setComments(data.data || []);
  }

  const addComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    const { data, error } = await apiCall(allRoutes.comments.store, 'post', {
      project_id: projectId,
      type: 'mindmap',
      content: commentText
    }); 
    if (error) {
      console.error('❌ Error adding comment:', error);
      throw error;
    }
    setComments(prev => [data.data, ...prev]);
    setCommentText('');
  }

  useEffect(() => {
    fetchComments();
  }, [projectId]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Comments</CardTitle>
        <CardDescription>
          {nodeId 
            ? 'Discussion about this item' 
            : 'General project discussion'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentUser ? (
            <form onSubmit={addComment} className="space-y-2">
            <div className="space-y-2">
              <Textarea 
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className={`min-h-[80px] ${isOverLimit ? 'border-red-500 focus:border-red-500' : ''}`}
              />
              <div className="flex justify-between items-center">
                <div className={`text-sm ${isOverLimit ? 'text-red-600' : isNearLimit ? 'text-yellow-600' : 'text-gray-500'}`}>
                  {characterCount} / {MAX_CHARACTERS} characters
                  {isOverLimit && (
                    <span className="ml-2 font-medium">Character limit exceeded!</span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!commentText.trim() || isOverLimit}
                size="sm"
                className={isOverLimit ? 'opacity-50 cursor-not-allowed' : ''}
              >
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </form>
        ) : (
          <div className="text-center py-4 bg-yellow-50 rounded-md border border-yellow-200">
            <p className="text-yellow-700">Please log in to add comments</p>
          </div>
        )}

        <div className="space-y-4 mt-4">
          {loading ? (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Loading comments...</p>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-3 bg-gray-50">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{comment.user?.name || comment.author_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(comment.user?.role || comment.author_role)}`}>
                      {(comment.user?.role || comment.author_role).replace('_', ' ').replace('-', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="flex items-center text-xs text-gray-500 gap-2">
                    <span>{getTimestamp(comment.created_at)}</span>
                    {canDeleteComment(comment) && (
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 text-red-500 hover:text-red-700"
                        onClick={() => handleDeleteComment(comment.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </div>
                <p className="mt-1 text-gray-800 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          ) : (
            <div className="text-center py-4 text-gray-500">
              <p>No comments yet</p>
              <p className="text-sm">Be the first to start the conversation</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
