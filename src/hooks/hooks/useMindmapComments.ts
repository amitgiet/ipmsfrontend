
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';

export interface MindmapComment {
  id: string;
  mindmap_node_id: string;
  project_id: string;
  author_email: string;
  author_name: string;
  author_role: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useMindmapComments = (
  projectId: string,
  nodeId?: string,
  user?: User | null
) => {
  const [comments, setComments] = useState<MindmapComment[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchComments = async () => {
    if (!projectId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      let query = supabase
        .from('mindmap_comments')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });
        
      // If a specific node ID is provided, filter by that node
      if (nodeId) {
        query = query.eq('mindmap_node_id', nodeId);
      }
      
      const { data, error } = await query;
      
      if (error) {
        console.error('❌ Error loading mindmap comments:', error);
        throw error;
      }
      
      console.log('✅ Loaded mindmap comments:', data?.length || 0);
      setComments(data || []);
    } catch (error) {
      console.error('❌ Failed to load mindmap comments:', error);
      toast({
        title: "Error",
        description: "Failed to load comments",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (nodeId: string, content: string) => {
    if (!user || !content.trim() || !projectId || !nodeId) {
      console.error('❌ Missing data for comment:', { 
        hasUser: !!user, 
        content: content.trim().length > 0,
        projectId: !!projectId,
        nodeId: !!nodeId
      });
      
      toast({
        title: "Error",
        description: "Missing required information to add comment",
        variant: "destructive",
      });
      return false;
    }

    try {
      console.log('🔄 Attempting to add comment as user:', user.email, user.role);
      
      const newComment = {
        mindmap_node_id: nodeId,
        project_id: projectId,
        author_email: user.email,
        author_name: user.name || user.email,
        author_role: user.role || 'client', // Ensure we have a role
        content: content.trim(),
      };

      console.log('📝 Comment data:', newComment);

      const { data, error } = await supabase
        .from('mindmap_comments')
        .insert(newComment)
        .select();

      if (error) {
        console.error('❌ Error adding mindmap comment:', error);
        throw error;
      }

      console.log('✅ Added new mindmap comment:', data);
      
      // Update local state with the new comment
      if (data && data.length > 0) {
        setComments((prev) => [data[0], ...prev]);
      }
      
      toast({
        title: "Success",
        description: "Comment added successfully",
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to add mindmap comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
      return false;
    }
  };

  const deleteComment = async (commentId: string) => {
    if (!commentId) return false;

    try {
      const { error } = await supabase
        .from('mindmap_comments')
        .delete()
        .eq('id', commentId);

      if (error) {
        console.error('❌ Error deleting mindmap comment:', error);
        throw error;
      }

      console.log('✅ Deleted mindmap comment:', commentId);
      
      // Update local state by removing the deleted comment
      setComments((prev) => prev.filter(comment => comment.id !== commentId));
      
      toast({
        title: "Success",
        description: "Comment deleted successfully",
      });
      
      return true;
    } catch (error) {
      console.error('❌ Failed to delete mindmap comment:', error);
      toast({
        title: "Error",
        description: "Failed to delete comment",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    fetchComments();
  }, [projectId, nodeId]);

  return {
    comments,
    loading,
    addComment,
    deleteComment,
    refreshComments: fetchComments
  };
};
