
import React from 'react';
import { TasksSummary } from './TasksSummary';
import { TaskKanbanView } from './TaskKanbanView';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  assignedTo?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

interface TasksContentProps {
  tasks: Task[];
  userRole: string | null;
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => Promise<void>;
  onUpdateTaskStatus: (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => Promise<void>;
  onLogTime: (task: Task) => Promise<void>;
}

export const TasksContent: React.FC<TasksContentProps> = ({
  tasks,
  userRole,
  onEditTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onLogTime
}) => {
  // Calculate task counts
  const todoCount = tasks.filter(task => task.status === 'to_do').length;
  const inProgressCount = tasks.filter(task => task.status === 'in_progress').length;
  const completedCount = tasks.filter(task => task.status === 'completed').length;

  return (
    <>
      <TasksSummary 
        totalTasks={tasks.length}
        todoCount={todoCount}
        inProgressCount={inProgressCount}
        completedCount={completedCount}
      />
      
      <TaskKanbanView
        tasks={tasks}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onUpdateTaskStatus={onUpdateTaskStatus}
        onLogTime={onLogTime}
        userRole={userRole}
      />
    </>
  );
};
