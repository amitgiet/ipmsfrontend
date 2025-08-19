
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  loadDocuments: () => Promise<void>
) => {
  const { toast } = useToast();
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
      toast({
        title: "Invalid File Type",
        description: "Please upload PDF, Word documents, or images only",
        variant: "destructive",
      });
      return;
    }

    setUploading(true);

    try {
      const fileName = `${story.id}/${Date.now()}-${file.name}`;
      
      const { error: uploadError } = await supabase.storage
        .from('story-documents')
        .upload(fileName, file);

      if (uploadError) {
        throw uploadError;
      }

      const { error: dbError } = await supabase
        .from('story_documents')
        .insert({
          story_id: story.id,
          filename: file.name,
          file_path: fileName,
          file_type: file.type,
          file_size: file.size
        });

      if (dbError) {
        throw dbError;
      }

      await updateStoryStatus('in_grooming');

      toast({
        title: "Success",
        description: "Document uploaded successfully",
      });

      loadDocuments();
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "Failed to upload document",
        variant: "destructive",
      });
    } finally {
      setUploading(false);
      event.target.value = '';
    }
  };

  const downloadDocument = async (document: StoryDocument) => {
    try {
      const { data, error } = await supabase.storage
        .from('story-documents')
        .download(document.file_path);

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
      toast({
        title: "Error",
        description: "Failed to download document",
        variant: "destructive",
      });
    }
  };

  return {
    uploading,
    handleFileUpload,
    downloadDocument
  };
};
