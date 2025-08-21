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
}

export const useStoryData = (
  storyId?: string,
  projectId?: string,
  initialStory?: any
) => {
  const { story, setStory, loading, setLoading, fetchStory, refetch: refetchStory } =
    useStoryFetching();
  const { documents, loadDocuments } = useStoryDocumentsData();
  const { comments, loadComments } = useStoryCommentsData();
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

  const updateStory = async (updates: Partial<Story>) => {
    if (story) {
      await updateStoryData(story, updates, setStory);
    }
  };

  const updateStoryStatus = async (status: Story["status"]) => {
    if (story) {
      await updateStoryStatusData(story, status, setStory);
    }
  };

  useEffect(() => {
    if (storyId) {
      setLoading(true);
      Promise.all([
        fetchStory(storyId, projectId),
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
    refetch: refetchStory
  };
};
