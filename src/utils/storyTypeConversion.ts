
interface UserStory {
  id: string;
  storyId?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready' | 'ready_for_estimate';
  storyPoints?: number;
  projectId: string;
}

interface DatabaseStory {
  id: string;
  story_id?: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_progress' | 'qa' | 'done' | 'ready' | 'in_grooming' | 'ready_for_estimate';
  story_points?: number;
  project_id: string;
  created_at: string;
  updated_at: string;
}

export const convertToUserStory = (story: DatabaseStory | null): UserStory | null => {
  if (!story) return null;
  
  return {
    id: story.id,
    storyId: story.story_id,
    title: story.title,
    description: story.description,
    priority: story.priority,
    status: story.status as UserStory['status'],
    storyPoints: story.story_points,
    projectId: story.project_id
  };
};

export const createStoryUpdateHandler = (
  story: DatabaseStory | null,
  setStory: (story: DatabaseStory | null) => void
) => {
  return (updatedUserStory: UserStory) => { 
    if (story) {
      const updatedStory = {
        ...story,
        title: updatedUserStory.title,
        description: updatedUserStory.description,
        priority: updatedUserStory.priority,
        status: updatedUserStory.status as typeof story.status,
        story_points: updatedUserStory.storyPoints
      }; 
      setStory(updatedStory);
    }
  };
};
