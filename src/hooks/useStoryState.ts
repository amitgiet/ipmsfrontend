
import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { useStoryData } from '@/hooks/useStoryData';

interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

export const useStoryState = () => {
  const { storyId } = useParams();
  const location = useLocation();
  
  const [description, setDescription] = useState('');
  const [newComment, setNewComment] = useState('');

  const {
    story,
    setStory,
    documents,
    comments,
    loading,
    loadDocuments,
    loadComments,
    updateStoryStatus
  } = useStoryData(storyId, location.state?.story);

  // Update description when story data changes
  useEffect(() => {
    if (story?.description) {
      setDescription(story.description);
    } else if (location.state?.story?.description) {
      setDescription(location.state.story.description);
    }
  }, [story?.description, location.state?.story?.description]);

  // Scroll to top when component mounts and when loading is complete
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!loading) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    }
  }, [loading]);

  return {
    story,
    setStory,
    documents,
    comments,
    loading,
    description,
    setDescription,
    newComment,
    setNewComment,
    loadDocuments,
    loadComments,
    updateStoryStatus
  };
};
