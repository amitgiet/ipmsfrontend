import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface ChangeRequest {
  id: string;
  project_id: string;
  title: string;
  description: string;
  requested_by_email: string;
  requested_by_name: string;
  requested_by_role: string;
  status: 'pending' | 'po_approved' | 'client_approved' | 'processed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  response_message?: string;
  reviewed_by?: string;
  reviewed_at?: string;
  po_approved_by?: string;
  po_approved_at?: string;
  client_approved_by?: string;
  client_approved_at?: string;
  processed_by?: string;
  processed_at?: string;
  created_at: string;
  updated_at: string;
}

export interface ChangeRequestComment {
  id: string;
  change_request_id: string;
  author_email: string;
  author_name: string;
  author_role: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export const useChangeRequests = (projectId: string) => {
  const [changeRequests, setChangeRequests] = useState<ChangeRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastViewedComments, setLastViewedComments] = useState<Record<string, string>>({});
  const [commentsCounts, setCommentsCounts] = useState<Record<string, number>>({});
  const { toast } = useToast();

  const loadChangeRequests = async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      console.log('🔄 Loading change requests for project:', projectId);

      const { data, error } = await supabase
        .from('change_requests')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading change requests:', error);
        throw error;
      }

      console.log('✅ Loaded change requests:', data?.length || 0);
      setChangeRequests((data || []) as ChangeRequest[]);
      
      // Load comments counts for each request
      if (data && data.length > 0) {
        await loadCommentsCounts(data.map(req => req.id));
      }
    } catch (error) {
      console.error('❌ Error loading change requests:', error);
      toast({
        title: "Error",
        description: "Failed to load change requests",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const loadCommentsCounts = async (requestIds: string[]) => {
    try {
      const { data, error } = await supabase
        .from('change_request_comments')
        .select('change_request_id, created_at')
        .in('change_request_id', requestIds)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading comments counts:', error);
        return;
      }

      // Count comments per request
      const counts: Record<string, number> = {};
      data?.forEach(comment => {
        counts[comment.change_request_id] = (counts[comment.change_request_id] || 0) + 1;
      });

      setCommentsCounts(counts);
    } catch (error) {
      console.error('❌ Error loading comments counts:', error);
    }
  };

  const getUnreadCommentsCount = (requestId: string, userEmail: string): number => {
    const lastViewed = lastViewedComments[`${requestId}_${userEmail}`];
    if (!lastViewed) {
      return commentsCounts[requestId] || 0;
    }

    // Count comments created after last viewed time
    // This is a simplified approach - in a real app you'd want to track this more precisely
    return 0; // Once viewed, reset to 0 for now
  };

  const markCommentsAsViewed = (requestId: string, userEmail: string) => {
    const key = `${requestId}_${userEmail}`;
    const now = new Date().toISOString();
    setLastViewedComments(prev => ({
      ...prev,
      [key]: now
    }));

    // Store in localStorage for persistence
    localStorage.setItem(`lastViewed_${key}`, now);
  };

  const updateChangeRequestStatus = async (
    requestId: string, 
    status: ChangeRequest['status'], 
    responseMessage?: string,
    reviewedBy?: string
  ) => {
    try {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString()
      };

      // Set appropriate approval fields based on status
      if (status === 'po_approved') {
        updateData.po_approved_by = reviewedBy;
        updateData.po_approved_at = new Date().toISOString();
      } else if (status === 'client_approved') {
        updateData.client_approved_by = reviewedBy;
        updateData.client_approved_at = new Date().toISOString();
      } else if (status === 'processed') {
        updateData.processed_by = reviewedBy;
        updateData.processed_at = new Date().toISOString();
      } else if (status === 'rejected') {
        updateData.reviewed_by = reviewedBy;
        updateData.reviewed_at = new Date().toISOString();
        updateData.response_message = responseMessage;
      }

      const { error } = await supabase
        .from('change_requests')
        .update(updateData)
        .eq('id', requestId);

      if (error) {
        console.error('❌ Error updating change request:', error);
        throw error;
      }

      setChangeRequests(prev => prev.map(req => 
        req.id === requestId 
          ? { ...req, ...updateData }
          : req
      ));

      toast({
        title: "Success",
        description: "Change request updated successfully",
      });
    } catch (error) {
      console.error('❌ Error updating change request:', error);
      toast({
        title: "Error",
        description: "Failed to update change request",
        variant: "destructive",
      });
    }
  };

  const addComment = async (requestId: string, content: string, authorEmail: string, authorName: string, authorRole: string) => {
    try {
      const { error } = await supabase
        .from('change_request_comments')
        .insert({
          change_request_id: requestId,
          content: content.trim(),
          author_email: authorEmail,
          author_name: authorName,
          author_role: authorRole,
        });

      if (error) {
        console.error('❌ Error adding comment:', error);
        throw error;
      }

      // Update comments count
      setCommentsCounts(prev => ({
        ...prev,
        [requestId]: (prev[requestId] || 0) + 1
      }));

      toast({
        title: "Success",
        description: "Comment added successfully",
      });
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast({
        title: "Error",
        description: "Failed to add comment",
        variant: "destructive",
      });
    }
  };

  const processAsEpic = async (requestId: string, processedBy: string) => {
    try {
      // First update the status to processed
      await updateChangeRequestStatus(requestId, 'processed', undefined, processedBy);
      
      // Here you would add logic to create an epic in the mindmap/backlog
      // This would integrate with the existing mindmap functionality
      
      toast({
        title: "Success",
        description: "Change request processed as epic",
      });
    } catch (error) {
      console.error('❌ Error processing as epic:', error);
      toast({
        title: "Error",
        description: "Failed to process as epic",
        variant: "destructive",
      });
    }
  };

  // Load last viewed timestamps from localStorage on mount
  useEffect(() => {
    const loadLastViewedFromStorage = () => {
      const stored: Record<string, string> = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith('lastViewed_')) {
          const actualKey = key.replace('lastViewed_', '');
          const value = localStorage.getItem(key);
          if (value) {
            stored[actualKey] = value;
          }
        }
      }
      setLastViewedComments(stored);
    };

    loadLastViewedFromStorage();
  }, []);

  useEffect(() => {
    loadChangeRequests();

    // Set up real-time subscription for change requests
    const channel = supabase
      .channel('change_requests_changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'change_requests',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('📥 New change request added:', payload.new);
          const newRequest = payload.new as ChangeRequest;
          setChangeRequests(prev => [newRequest, ...prev]);
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'change_requests',
          filter: `project_id=eq.${projectId}`
        },
        (payload) => {
          console.log('📝 Change request updated:', payload.new);
          const updatedRequest = payload.new as ChangeRequest;
          setChangeRequests(prev => prev.map(req => 
            req.id === updatedRequest.id ? updatedRequest : req
          ));
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'change_request_comments'
        },
        (payload) => {
          console.log('📥 New comment added:', payload.new);
          const comment = payload.new as ChangeRequestComment;
          // Update comments count
          setCommentsCounts(prev => ({
            ...prev,
            [comment.change_request_id]: (prev[comment.change_request_id] || 0) + 1
          }));
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId]);

  return {
    changeRequests,
    loading,
    loadChangeRequests,
    updateChangeRequestStatus,
    addComment,
    processAsEpic,
    getUnreadCommentsCount,
    markCommentsAsViewed
  };
};
