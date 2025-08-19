
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { MessageCircle, User, Calendar } from 'lucide-react';
import { apiCall } from '@/services/apiCall';
import { toast } from 'react-toastify';
import { useUserRole } from '@/hooks/useUserRole';
import { allRoutes } from '@/services/routes';

interface Bug {
  id: string;
  title: string;
  description?: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'resolved' | 'reopened';
  reported_by: string;
  resolved_by?: string;
  resolved_at?: string;
  created_at: string;
  user_stories?: {
    title: string;
  };
}

interface BugComment {
  id: string;
  content: string;
  author_name: string;
  author_role: string;
  created_at: string;
}

interface BugDetailsDialogProps {
  bug: Bug;
  isOpen: boolean;
  onClose: () => void;
  onBugUpdated: () => void;
}

export const BugDetailsDialog: React.FC<BugDetailsDialogProps> = ({
  bug,
  isOpen,
  onClose,
  onBugUpdated
}) => {
  const [comments, setComments] = useState<BugComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [commentsLoading, setCommentsLoading] = useState(true);
  const { userRole } = useUserRole();

  const fetchComments = async () => {
    try {
      setCommentsLoading(true);
      console.log('🔄 Fetching comments for bug:', bug.id);

      const { data: commentsData, error } = await apiCall(allRoutes.sprints.getBugComments(bug.id), 'GET');


      setComments(commentsData || []);
    } catch (error) {
      toast.error("Failed to fetch comments");
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
        toast.error("Please enter a comment");
      return;
    }

    try {
      setLoading(true);
      console.log('🔄 Adding comment to bug:', bug.id);

      const { error } = await apiCall(allRoutes.sprints.createBugComment(bug.id), 'POST', {
          bug_id: bug.id,
          content: newComment.trim(),
          author_name: 'Current User', // You can enhance this to get actual user info
          author_role: userRole || 'unknown'
      });

      toast.success("Comment added successfully");

      setNewComment('');
      fetchComments(); // Refresh comments
    } catch (error) {
      toast.error("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'critical':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reopened':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  useEffect(() => {
    if (isOpen && bug.id) {
      fetchComments();
    }
  }, [isOpen, bug.id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Bug Details
            <Badge className={getStatusColor(bug.status)}>
              {bug.status.toUpperCase()}
            </Badge>
          </DialogTitle>
          <DialogDescription>
            View and manage bug details and comments
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Bug Details */}
          <div className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{bug.title}</h3>
              <div className="flex items-center gap-2 mt-2">
                <Badge className={getSeverityColor(bug.severity)}>
                  {bug.severity.toUpperCase()}
                </Badge>
                <span className="text-sm text-gray-500">
                  Story: {bug.user_stories?.title || 'Unknown'}
                </span>
              </div>
            </div>

            {bug.description && (
              <div>
                <Label className="text-sm font-medium">Description</Label>
                <p className="text-gray-700 mt-1">{bug.description}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-sm font-medium">Reported By</Label>
                <p className="text-gray-600">{bug.reported_by}</p>
              </div>
              <div>
                <Label className="text-sm font-medium">Reported Date</Label>
                <p className="text-gray-600">{new Date(bug.created_at).toLocaleDateString()}</p>
              </div>
              {bug.resolved_by && (
                <>
                  <div>
                    <Label className="text-sm font-medium">Resolved By</Label>
                    <p className="text-gray-600">{bug.resolved_by}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium">Resolved Date</Label>
                    <p className="text-gray-600">
                      {bug.resolved_at ? new Date(bug.resolved_at).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-5 w-5" />
              <h4 className="font-semibold">Comments ({comments.length})</h4>
            </div>

            {commentsLoading ? (
              <div className="flex justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              </div>
            ) : (
              <div className="space-y-3 max-h-60 overflow-y-auto">
                {comments.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">No comments yet</p>
                ) : (
                  comments.map(comment => (
                    <Card key={comment.id} className="p-3">
                      <CardContent className="p-0">
                        <div className="flex items-start gap-3">
                          <User className="h-8 w-8 text-gray-400 bg-gray-100 rounded-full p-1" />
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm">{comment.author_name}</span>
                              <Badge variant="outline" className="text-xs">
                                {comment.author_role}
                              </Badge>
                              <span className="text-xs text-gray-500 flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(comment.created_at).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-700">{comment.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="space-y-3">
              <div>
                <Label htmlFor="comment">Add Comment</Label>
                <Textarea
                  id="comment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add your comment here..."
                  rows={3}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button type="submit" disabled={loading}>
                  {loading ? 'Adding...' : 'Add Comment'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
