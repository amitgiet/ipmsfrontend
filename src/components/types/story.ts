
export interface UserStory {
  id: string;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'to_do' | 'in_grooming' | 'ready_for_estimate' | 'estimated' | 'ready' | 'in_progress' | 'qa' | 'done';
  storyPoints?: number;
  projectId: string;
  is_overworked?: boolean;
  total_logged_minutes?: number;
  estimated_minutes?: number;
}

export interface StoryDocument {
  id: string;
  filename: string;
  file_type: string;
  file_size: number;
  file_path: string;
  uploaded_at: string;
}

export interface StoryComment {
  id: string;
  content: string;
  created_at: string;
  author_name: string;
}
