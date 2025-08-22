import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'react-router-dom';

interface UserStory {
  id: string;
  storyId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate' | 'estimated' | 'in_progress' | 'qa' | 'done';
  storyPoints?: number;
  projectId: string;
  is_overworked?: boolean;
  total_logged_minutes?: number;
  estimated_minutes?: number;
  acceptanceCriteria?: string;
  media?: {
    id: string;
    name: string;
    url: string;
  }[];
}

interface StoryDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
}

interface StoryComment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
}

export const useStoryDetailsData = (storyId?: string) => {  
  const { projectId } = useParams();
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  const userRole = currentUser?.role || null;
  const [story1, setStory] = useState<UserStory | null>(null);
  const [documents, setDocuments] = useState<StoryDocument[]>([]);
  const [comments, setComments] = useState<StoryComment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadStoryData = async () => {
    if (!storyId||!projectId) return;

    try {
      const { data, error } = await apiCall(allRoutes.stories.get(storyId,projectId), 'get');
      // Type assertion to handle the acceptance_criteria field that may not be in the generated types yet
      const storyData = data.data
      const mappedStory: UserStory = {
        id: storyData.id,
        storyId: storyId,
        title: storyData.title,
        description: storyData.description || undefined,
        priority: storyData.priority as 'low' | 'medium' | 'high' | 'urgent',
        status: storyData.status as 'to_do' | 'in_grooming' | 'ready' | 'in_progress' | 'qa' | 'done',
        storyPoints: storyData.story_point || undefined,
        projectId: projectId,
        is_overworked: storyData.is_overworked || false,
        total_logged_minutes: storyData.total_logged_minutes || 0,
        estimated_minutes: storyData.estimated_minutes || 0,
        acceptanceCriteria: storyData.acceptance_criteria || undefined,
        media:storyData.media || []
      };
      setStory(mappedStory);
    } catch (error) {
      console.error('❌ Error in loadStoryData:', error);
      toast.error("Failed to load user story");
    }
  };

  const loadComments = async () => {
    if (!storyId||!projectId  ) return;

    try {
      // const { data, error } = await apiCall(allRoutes.stories.get(storyId), 'get');  
      const demoData = [{
        id: '1',
        content: 'Comment 1',
        created_at: '2021-01-01',
        author_name: 'John Doe',
      }]
      const error = null;
      if (error) {
        console.error('❌ Error loading comments:', error);
        return;
      }

      if (demoData) {
        setComments(demoData as StoryComment[]);
      }
    } catch (error) {
      console.error('❌ Error loading comments:', error);
    }
  };

  const downloadDocument = async (document: StoryDocument) => {
    try {
      // const { data, error } = await apiCall(allRoutes.stories.get(storyId), 'get');
      const demoData = {
        id: '1',
        filename: 'Document 1',
        file_type: 'pdf',
        file_size: 100,
        file_path: 'https://example.com/document.pdf',
        uploaded_at: '2021-01-01',
      }
      const error = null;
      if (error) {
        console.error('❌ Error downloading document:', error);
        return;
      }

      const url = URL.createObjectURL(demoData as any);
      const a = globalThis.document.createElement('a');
      a.href = url;
      a.download = document.filename;
      globalThis.document.body.appendChild(a);
      a.click();
      globalThis.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Error downloading document:', error);
      toast.error("Failed to download document");
    }
  };

  const refetch = () => {
    if (storyId) {
      setLoading(true);
      Promise.all([
        loadStoryData(),
        loadComments()
      ]).finally(() => {
        setLoading(false);
      });
    }
  };

  useEffect(() => {
    refetch();
  }, [storyId]);

  return {
    story1,
    documents,
    comments,
    loading,
    downloadDocument,
    refetch,
    loadStoryData
  };
};
