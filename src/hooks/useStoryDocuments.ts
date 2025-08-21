
import { useState } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useStoryDetailsData } from './useStoryDetailsData';
import { useStoryFetching } from './useStoryFetching';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

interface StoryDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
}

export const useStoryDocuments = (
  story: UserStory | null,
  updateStoryStatus: (status: UserStory['status']) => Promise<void>,
  loadDocuments: () => Promise<void>,
) => {
  const { projectId, storyId } = useParams();
    const { fetchStory } = useStoryFetching();

  const [uploading, setUploading] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !story) return;

    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp'
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Invalid File Type");
      return;
    }
    console.log(story, file, projectId, 'story')
    setUploading(true);

    let formData = new FormData();
    formData.append('flow_document', file);
    formData.append('_method', 'patch');
    formData.append('project_id', projectId || '');

    try {
      const { error: uploadError } = await apiCall(allRoutes.stories.update(story.id), 'post',
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (uploadError) {
        throw uploadError;
      }


      // await updateStoryStatus('in_grooming');

      toast.success("Document uploaded successfully");

      fetchStory(storyId, projectId);
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error("Failed to upload document");
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const downloadDocument = async (document: StoryDocument) => {
    try {
      const { data, error } = await apiCall(allRoutes.stories.download(document.file_path), 'get');

      if (error) {
        throw error;
      }

      const url = URL.createObjectURL(data);
      const a = globalThis.document.createElement('a');
      a.href = url;
      a.download = document.filename;
      globalThis.document.body.appendChild(a);
      a.click();
      globalThis.document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading document:', error);
      toast.error("Failed to download document");
    }
  };

  return {
    uploading,
    handleFileUpload,
    downloadDocument
  };
};
