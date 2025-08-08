
export interface Notification {
  id: string;
  user_id: string;
  user_email: string;
  title: string;
  message: string;
  type: 'project_assigned' | 'story_ready_estimation' | 'story_ready' | 'sprint_initiated' | 'bug_created' | 'story_status_change' | 'task_assigned';
  project_id?: string;
  story_id?: string;
  sprint_id?: string;
  bug_id?: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}
