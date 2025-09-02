import { useEffect } from "react";
import { useStoryFetching } from "@/hooks/useStoryFetching";
import { useStoryDocumentsData } from "@/hooks/useStoryDocumentsData";
import { useStoryCommentsData } from "@/hooks/useStoryCommentsData";
import { useStoryUpdating } from "@/hooks/useStoryUpdating";

interface Story {
  id: string;
  title: string;
  description?: string;
  priority: "low" | "medium" | "high" | "urgent";
  status:
    | "to_do"
    | "in_progress"
    | "qa"
    | "done"
    | "ready"
    | "in_grooming"
    | "ready_for_estimate";
  story_points?: number;
  project_id: string;
  created_at: string;
  updated_at: string;
  media: {
    id: string;
    name: string;
    url: string;
  }[];
}

export const useStoryData = (
  storyId?: string,
  projectId?: string,
  initialStory?: any
) => {
  const { story, setStory, loading, setLoading, fetchStory, refetch: refetchStory } =
    useStoryFetching();
  const { documents, loadDocuments, refetchDocuments } = useStoryDocumentsData();
  const { comments, loadComments, refetchComments } = useStoryCommentsData();
  const {
    updateStory: updateStoryData,
    updateStoryStatus: updateStoryStatusData,
  } = useStoryUpdating();

  // Initialize with initial story if provided
  useEffect(() => {
    if (initialStory && !story) {
      setStory(initialStory);
    }
  }, [initialStory, story, setStory]);

  // Create wrapper functions that handle type conversion
  const updateStory = async (updates: Partial<Story>) => {
    if (story) {
      const setStoryWrapper = (updatedStory: Story | null) => {
        setStory(updatedStory);
      };
      await updateStoryData(story, updates, setStoryWrapper);
    }
  };

  const updateStoryStatus = async (status: Story["status"]) => {
    if (story) {
      const setStoryWrapper = (updatedStory: Story | null) => {
        setStory(updatedStory);
      };
      await updateStoryStatusData(story, status, setStoryWrapper);
    }
  };

  // Comprehensive refetch function that updates all data
  const refetch = async () => { 
    
    if (storyId && projectId) {
      setLoading(true);
      try { 
        await Promise.all([
          refetchStory(), // This will also refresh the documents since they're in story.media
          // refetchDocuments(), // Not needed - documents are refreshed with story
          refetchComments()
        ]); 
      } catch (error) {
        console.error('❌ Error during refetch:', error);
      } finally {
        setLoading(false);
      }
    } else {
      console.error('❌ Cannot refetch: Missing storyId or projectId', { storyId, projectId });
    }
  };

  useEffect(() => {
    if (storyId) {
      setLoading(true);
      Promise.all([
        fetchStory(storyId, projectId),
        // loadDocuments(storyId), // Documents are fetched in the same API call as story
        loadComments(storyId, projectId),
      ]).finally(() => {
        setLoading(false);
      });
    }
  }, [storyId, projectId]);

  return {
    story,
    setStory,
    documents,
    comments,
    loading,
    loadDocuments: () => (storyId ? loadDocuments(storyId) : Promise.resolve()),
    loadComments: () => (storyId ? loadComments(storyId, projectId) : Promise.resolve()),
    updateStory,
    updateStoryStatus,
    fetchStory: () =>
      storyId && projectId ? fetchStory(storyId, projectId) : Promise.resolve(),
    refetch
  };
};
