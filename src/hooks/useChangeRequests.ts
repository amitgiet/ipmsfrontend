import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { allRoutes } from '@/services/routes';
import { apiCall } from '@/services/apiCall';

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
  const [loading, setLoading] = useState(false);
  const [lastViewedComments, setLastViewedComments] = useState<Record<string, string>>({});
  const [commentsCounts, setCommentsCounts] = useState<Record<string, number>>({});

  const loadChangeRequests = async () => {
    if (!projectId) return;

    try {
      setLoading(true); 

        const { data, error } = await apiCall(allRoutes.clients.loadChangeRequests(projectId), 'get');

      if (error) {
        console.error('❌ Error loading change requests:', error);
        throw error;
      }
 
      setChangeRequests((data.data || []) as ChangeRequest[]);
      
      // Load comments counts for each request
      // if (data && data.length > 0) {
      //   await loadCommentsCounts(data.map(req => req.id));
      // }
    } catch (error) {
      console.error('❌ Error loading change requests:', error);
      toast.error("Failed to load change requests");
    } finally {
      setLoading(false);
    }
  };

  const loadCommentsCounts = async (requestIds: string[]) => {
    try {
      const { data, error } = await apiCall(allRoutes.comments.get(projectId, 'change_request'), 'get', {
        change_request_id: requestIds
      });

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
      let apiError: any = null;
  
      if (status === 'po_approved') {
        const { error } = await apiCall(allRoutes.clients.po_approved(requestId, projectId), 'patch');
        apiError = error;
      } 
      else if (status === 'client_approved') {
        const { error } = await apiCall(allRoutes.clients.client_approved(requestId, projectId), 'patch');
        apiError = error;
      } 
      else if (status === 'processed') {
        const { error } = await apiCall(allRoutes.clients.po_processed(requestId, projectId), 'patch');
        apiError = error;
      } 
      else if (status === 'rejected') {
        const { error } = await apiCall(allRoutes.clients.po_reject(requestId, projectId), 'patch' );
        apiError = error;
      }
  
      // ✅ unified error handling
      if (apiError) {
        console.error('❌ Error updating change request:', apiError);
        return;
      }
  
      await loadChangeRequests()
      toast.success("Change request updated successfully");
    } catch (error) {
      console.error('❌ Error updating change request:', error);
      toast.error("Failed to update change request");
    }
  };
  

  const addComment = async (requestId: string, content: string, authorEmail: string, authorName: string, authorRole: string) => {
    try {
      const { error } = await apiCall(allRoutes.comments.store, 'post', {
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

      toast.success("Comment added successfully");
    } catch (error) {
      console.error('❌ Error adding comment:', error);
      toast.error("Failed to add comment");
    }
  };

  const processAsEpic = async (requestId: string, processedBy: string) => {
    try {
      // First update the status to processed
      await updateChangeRequestStatus(requestId, 'processed', undefined, processedBy);
    } catch (error) {
      console.error('❌ Error processing as epic:', error);
      toast.error("Failed to process as epic");
    }
  };

  // Load last viewed timestamps from localStorage on mount
  // useEffect(() => {
  //   const loadLastViewedFromStorage = () => {
  //     const stored: Record<string, string> = {};
  //     for (let i = 0; i < localStorage.length; i++) {
  //       const key = localStorage.key(i);
  //       if (key?.startsWith('lastViewed_')) {
  //         const actualKey = key.replace('lastViewed_', '');
  //         const value = localStorage.getItem(key);
  //         if (value) {
  //           stored[actualKey] = value;
  //         }
  //       }
  //     }
  //     setLastViewedComments(stored);
  //   };

  //   loadLastViewedFromStorage();
  // }, []);

  useEffect(() => {
    loadChangeRequests();
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
