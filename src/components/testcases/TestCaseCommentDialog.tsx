
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { MessageSquare, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

interface TestCase {
  id: string;
  tc_id: string;
  title: string;
  description?: string;
  preconditions?: string;
  steps: string;
  expected_results: string;
  status: string;
  unit_tested: boolean;
  unit_tested_by?: string;
  unit_tested_at?: string;
  qc_approved: boolean;
  qc_approved_by?: string;
  qc_approved_at?: string;
}

interface TestCaseComment {
  id: string;
  comment: string;
  comment_type: string;
  author_name: string;
  author_email: string;
  author_role: string;
  created_at: string;
}

interface TestCaseCommentDialogProps {
  open: boolean;
  onClose: () => void;
  testCase: TestCase;
  onCommentAdded: () => void;
}

export const TestCaseCommentDialog: React.FC<TestCaseCommentDialogProps> = ({
  open,
  onClose,
  testCase,
  onCommentAdded
}) => {
  const [comments, setComments] = useState<TestCaseComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentType, setCommentType] = useState<'general' | 'reopen'>('general');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const { userRole, currentUser } = useUserRole();

  const canReopen = userRole === 'qa';

  useEffect(() => {
    if (open && testCase?.id) {
      loadComments();
    }
  }, [open, testCase?.id]);

  const loadComments = async () => {
    if (!testCase?.id) return;
    
    setLoading(true);
    try {
      console.log('🔄 Loading test case comments for:', testCase.id);

      const { data, error } = await apiCall(allRoutes.testCases.getComments(testCase.id), 'get');

      if (error) {
        console.error('❌ Error loading test case comments:', error);
        toast({
          title: "Error",
          description: "Failed to load comments",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Loaded test case comments:', data?.length || 0, data);
      setComments(data || []);
    } catch (error) {
      console.error('❌ Error in loadComments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Error",
        description: "Please enter a comment",
        variant: "destructive",
      });
      return;
    }

    if (!currentUser) {
      toast({
        title: "Error",
        description: "You must be logged in to add comments",
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      console.log('🔄 Adding test case comment:', {
        testCaseId: testCase.id,
        commentType,
        comment: newComment.trim(),
        user: currentUser
      });

      const commentData = {
        test_case_id: testCase.id,
        comment: newComment.trim(),
        comment_type: commentType,
        author_name: currentUser.name || currentUser.email,
        author_email: currentUser.email,
        author_role: userRole || 'unknown'
      };

      const { data, error } = await apiCall(allRoutes.testCases.addComment(testCase.id), 'post', commentData);

      if (error) {
        console.error('❌ Error adding test case comment:', error);
        toast({
          title: "Error",
          description: `Failed to add comment: ${error.message}`,
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Comment added successfully:', data);

      // If this is a reopen comment, also update the test case status
      if (commentType === 'reopen' && canReopen) {
        const { error: updateError } = await apiCall(allRoutes.testCases.reopen(testCase.id), 'put', {
          unit_tested: false,
          qc_approved: false,
          updated_at: new Date().toISOString()
          });

        if (updateError) {
          console.error('❌ Error reopening test case:', updateError);
          toast({
            title: "Warning",
            description: "Comment added but failed to update test case status",
            variant: "destructive",
          });
        } else {
          toast({
            title: "Success",
            description: "Test case reopened and comment added successfully",
          });
        }
      } else {
        toast({
          title: "Success",
          description: "Comment added successfully",
        });
      }

      setNewComment('');
      setCommentType('general');
      await loadComments(); // Reload comments to show the new one
      onCommentAdded(); // Refresh the parent component
    } catch (error) {
      console.error('❌ Error in handleSubmitComment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getCommentTypeColor = (type: string) => {
    switch (type) {
      case 'reopen':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'unit_test':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'qc':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCommentTypeLabel = (type: string) => {
    switch (type) {
      case 'reopen':
        return 'Reopen';
      case 'unit_test':
        return 'Unit Test';
      case 'qc':
        return 'QC';
      case 'general':
        return 'General';
      default:
        return 'Comment';
    }
  };

  const handleClose = () => {
    setNewComment('');
    setCommentType('general');
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-w-[95vw] h-[90vh] max-h-[800px] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-2 flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {testCase.tc_id}: {testCase.title}
          </DialogTitle>
          <DialogDescription>
            Comments and discussion for this test case
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-hidden px-6 pb-2">
          <ScrollArea className="h-full pr-4">
            <div className="space-y-6">
              {/* Test Case Summary */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="text-sm space-y-2">
                  <div><strong>Steps:</strong> {testCase.steps}</div>
                  <div><strong>Expected Results:</strong> {testCase.expected_results}</div>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Comments ({comments.length})</Label>
                
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {comments.map((comment) => (
                      <div key={comment.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-r-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium text-sm">{comment.author_name}</span>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${getCommentTypeColor(comment.comment_type)}`}
                          >
                            {getCommentTypeLabel(comment.comment_type)}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Add New Comment Section */}
              <div className="space-y-4 pb-4">
                <Label htmlFor="newComment" className="text-sm font-medium">Add Comment</Label>
                
                {canReopen && (
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commentType"
                        value="general"
                        checked={commentType === 'general'}
                        onChange={() => setCommentType('general')}
                        className="cursor-pointer"
                      />
                      <span className="text-sm">General Comment</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="radio"
                        name="commentType"
                        value="reopen"
                        checked={commentType === 'reopen'}
                        onChange={() => setCommentType('reopen')}
                        className="cursor-pointer"
                      />
                      <span className="text-sm flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3 text-orange-500" />
                        Reopen Test Case
                      </span>
                    </label>
                  </div>
                )}

                <Textarea
                  id="newComment"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder={commentType === 'reopen' 
                    ? "Explain why this test case needs to be reopened..." 
                    : "Add your comment..."}
                  rows={4}
                  className="resize-none"
                />
              </div>
            </div>
          </ScrollArea>
        </div>
        
        <DialogFooter className="flex-shrink-0 px-6 py-4 border-t bg-gray-50">
          <Button variant="outline" onClick={handleClose} disabled={submitting}>
            Close
          </Button>
          <Button 
            onClick={handleSubmitComment}
            disabled={!newComment.trim() || submitting}
          >
            {submitting ? 'Adding...' : commentType === 'reopen' ? 'Reopen & Comment' : 'Add Comment'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
