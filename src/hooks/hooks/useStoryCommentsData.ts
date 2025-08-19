
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface StoryComment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
}

export const useStoryCommentsData = () => {
  const [comments, setComments] = useState<StoryComment[]>([]);

  const loadComments = async (storyId: string) => {
    if (!storyId) return;

    try {
      const { data, error } = await supabase
        .from('story_comments')
        .select('*')
        .eq('story_id', storyId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Error loading comments:', error);
        return;
      }

      if (data) {
        setComments(data as StoryComment[]);
        console.log('✅ Loaded comments:', data.length);
      }
    } catch (error) {
      console.error('❌ Error loading comments:', error);
    }
  };

  return {
    comments,
    setComments,
    loadComments
  };
};
