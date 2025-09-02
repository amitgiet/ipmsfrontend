import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'react-toastify';
import { formatDistanceToNow } from 'date-fns';
import { MessageSquare, Send } from 'lucide-react';
import { ChangeRequestComment } from '@/hooks/useChangeRequests';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useParams } from 'react-router-dom';

interface ChangeRequestCommentsProps {
  requestId: string;
  currentUserEmail: string;
  currentUserName: string;
  currentUserRole: string;
  onCommentAdded?: () => void;
  onCommentsViewed?: (requestId: string, userEmail: string) => void;
}

export const ChangeRequestComments = ({
  requestId,
}: ChangeRequestCommentsProps) => {
  const { projectId } = useParams();
  const [comments, setComments] = useState<ChangeRequestComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const loadComments = async () => {
    try {
      setLoading(true);
      const { data, error } = await apiCall(allRoutes.comments.get(projectId || '', 'change_request', null, null, requestId), 'get', {},
        {
          headers: {
            'Content-Type': 'application/json',
          }
        });

      if (error) {
        console.error('❌ Error loading comments:', error);
        return;
      }

      setComments(data.data || []);
    } catch (error) {
      console.error('❌ Error loading comments:', error);
      toast.error("Failed to load comments");
    } finally {
      setLoading(false);
    }
  };

  const addComment = async () => {
    if (!newComment.trim()) return;

    try {
      setSubmitting(true);
      const { error } = await apiCall(allRoutes.comments.store, 'post', {
        project_id: projectId || '',
        type: 'change_request',
        content: newComment.trim(),
        change_request_id: requestId,
      });

      if (error) {
        console.error('❌ Error adding comment:', error);
        return;
      }

      loadComments();
      setNewComment('');
      toast.success("Comment added successfully");
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast.error("Failed to add comment");
    } finally {
      setSubmitting(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'product_owner':
        return 'bg-purple-100 text-purple-800';
      case 'client':
        return 'bg-blue-100 text-blue-800';
      case 'business_analyst':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTimestamp = (dateString: string) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch {
      return 'recently';
    }
  };

  useEffect(() => {
    loadComments();

    // Set up real-time subscription for comments
    // const channel = apiCall(allRoutes.comments.get(projectId, 'change_request'), 'get', {
    //   event: 'INSERT',
    //   schema: 'public',
    //   table: 'change_request_comments',
    //   filter: `change_request_id=eq.${requestId}`
    // }, {
    //   event: 'INSERT',
    //   schema: 'public',
    //   table: 'change_request_comments',
    //   filter: `change_request_id=eq.${requestId}`
    // });
    //     (payload) => { 
    //       const newCommentData = payload.new as ChangeRequestComment;
    //       setComments(prev => [...prev, newCommentData]);
    //     }
    //   )
    //   .subscribe();

    // return () => {
    //   apiCall(allRoutes.comments.get(projectId, 'change_request'), 'get');
    // };
  }, [requestId]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          Comments ({comments.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Comments List */}
        {comments.length > 0 ? (
          <div className="space-y-3 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div key={comment.id} className="border-l-2 border-gray-200 pl-3 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium">{comment.user.name}</span>
                  <Badge className={`${getRoleBadgeColor(comment.user.role)} border-0 text-xs`}>
                    {comment.user.role.replace('_', ' ').toUpperCase()}
                  </Badge>
                  <span className="text-xs text-gray-500">{getTimestamp(comment.created_at)}</span>
                </div>
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">No comments yet</p>
        )}

        {/* Add Comment Form */}
        <div className="border-t pt-3 space-y-2">
          <Textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="min-h-[80px] text-sm"
          />
          <div className="flex justify-end">
            <Button
              size="sm"
              onClick={addComment}
              disabled={!newComment.trim() || submitting}
            >
              <Send className="h-4 w-4 mr-1" />
              {submitting ? 'Adding...' : 'Add Comment'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
