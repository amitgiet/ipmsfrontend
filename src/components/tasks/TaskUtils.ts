
interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  assignedTo?: string;
  created_by?: string;
  created_at: string;
}

export const getTasksByStatus = (tasks: Task[], status: string): Task[] => {
  return tasks.filter(task => task.status === status);
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins}m`;
};
