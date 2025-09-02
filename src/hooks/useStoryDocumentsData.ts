
import { useState } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface StoryDocument {
  id: string;
  name: string;
  url: string;
  uploaded_at?: string;
}

export const useStoryDocumentsData = () => {
  const [documents, setDocuments] = useState<StoryDocument[]>([]);
  const [currentStoryId, setCurrentStoryId] = useState<string | null>(null);

  const loadDocuments = async (storyId: string) => {
    if (!storyId) return;

    try {
      setCurrentStoryId(storyId);
      const { data, error } = await apiCall(allRoutes.stories.get(storyId), 'get');

      if (error) {
        console.error('❌ Error loading documents:', error);
        return;
      }

      if (data && data.data && data.data.media) {
        // Transform the API response to match the UI expectations
        const transformedDocuments = data.data.media.map((doc: any) => ({
          id: doc.id,
          name: doc.name || doc.filename || 'Unknown Document',
          url: doc.url || doc.file_path || '',
          uploaded_at: doc.uploaded_at || doc.created_at || new Date().toISOString()
        }));
        
        setDocuments(transformedDocuments); 
      } else {
        setDocuments([]); 
      }
    } catch (error) {
      console.error('❌ Error loading documents:', error);
    }
  };

  // Refetch function to reload documents
  const refetchDocuments = async () => {
    if (currentStoryId) {
      await loadDocuments(currentStoryId);
    }
  };

  return {
    documents,
    setDocuments,
    loadDocuments,
    refetchDocuments
  };
};
