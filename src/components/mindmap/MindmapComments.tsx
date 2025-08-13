
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/useAuth';
import { formatDistanceToNow } from 'date-fns';
import { Send, Trash2 } from 'lucide-react';

interface MindmapComment {
  id: string;
  content: string;
  author_name: string;
  author_email: string;
  author_role: string;
  created_at: string;
}

interface MindmapCommentsProps {
  projectId: string;
  nodeId?: string;
}

export const MindmapComments = ({ projectId, nodeId }: MindmapCommentsProps) => {
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState<MindmapComment[]>([
    {
      id: '1',
      content: 'This project looks great! Looking forward to working on it.',
      author_name: 'John Developer',
      author_email: 'john@example.com',
      author_role: 'developer',
      created_at: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      content: 'The timeline seems realistic. Let\'s make sure we stick to it.',
      author_name: 'Sarah Manager',
      author_email: 'sarah@example.com',
      author_role: 'product_owner',
      created_at: '2024-01-15T11:15:00Z'
    },
    {
      id: '3',
      content: 'I have some questions about the requirements. Can we discuss this?',
      author_name: 'Mike QA',
      author_email: 'mike@example.com',
      author_role: 'qa',
      created_at: '2024-01-15T14:20:00Z'
    }
  ]);
  const [loading, setLoading] = useState(false);

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!commentText.trim()) {
      return;
    }
    
    if (!currentUser) {
      console.error('Cannot add comment: No authenticated user');
      return;
    }
    
    console.log('Submitting comment as user:', currentUser);
    
    // Add new comment to local state
    const newComment: MindmapComment = {
      id: Date.now().toString(),
      content: commentText,
      author_name: currentUser.name || currentUser.email || 'Anonymous',
      author_email: currentUser.email || '',
      author_role: currentUser.role || 'user',
      created_at: new Date().toISOString()
    };
    
    setComments(prev => [newComment, ...prev]);
    setCommentText('');
  };

  const handleDeleteComment = async (commentId: string) => {
    // Remove comment from local state
    setComments(prev => prev.filter(comment => comment.id !== commentId));
  };

  const canDeleteComment = (comment: MindmapComment) => {
    if (!currentUser) return false;
    return currentUser.email === comment.author_email;
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
  
  // Debug authentication status
  console.log('💡 MindmapComments Auth:', { 
    user: user?.email,
    teamUser: teamUser?.email,
    currentUser: currentUser?.email,
    role: currentUser?.role
  });

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
          <form onSubmit={handleSubmitComment} className="space-y-2">
            <Textarea 
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
              className="min-h-[80px]"
            />
            <div className="flex justify-end">
              <Button 
                type="submit" 
                disabled={!commentText.trim()}
                size="sm"
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
                    <span className="font-medium">{comment.author_name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${getRoleBadgeColor(comment.author_role)}`}>
                      {comment.author_role.replace('_', ' ')}
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
