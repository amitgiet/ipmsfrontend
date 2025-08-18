
import { useState } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface StoryDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
}

export const useStoryDocumentsData = () => {
  const [documents, setDocuments] = useState<StoryDocument[]>([]);

  const loadDocuments = async (storyId: string) => {
    if (!storyId) return;

    try {
      const { data, error } = await apiCall(allRoutes.stories.get(storyId), 'get');

      if (error) {
        console.error('❌ Error loading documents:', error);
        return;
      }

      if (data) {
        setDocuments(data as StoryDocument[]);
        console.log('✅ Loaded documents:', data.length);
      }
    } catch (error) {
      console.error('❌ Error loading documents:', error);
    }
  };

  return {
    documents,
    setDocuments,
    loadDocuments
  };
};
