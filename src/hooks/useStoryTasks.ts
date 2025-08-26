import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';
import { useAuth } from '@/hooks/useAuth';
import { useParams } from 'react-router-dom';
import { useUserRole } from '@/hooks/useUserRole';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'to_do' | 'in_progress' | 'completed';
  assignedTo?: number;
  created_by?: string;
  created_at: string;
  updated_at: string;
}

export const useStoryTasks = (storyId: string) => {
  const { projectId } = useParams();
  const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    try {

      const { data, error } = await apiCall(allRoutes.tasks.list(projectId), 'get');

      if (error) {
        toast.error("Failed to load tasks");
        return;
      }

      if (data) {
        const mappedTasks: Task[] = data.data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status as 'to_do' | 'in_progress' | 'completed',
          assignedTo: task.assigned_to || undefined,
          created_by: task.created_by || undefined,
          created_at: task.created_at,
          updated_at: task.updated_at
        }));

        setTasks(mappedTasks);
      }
    } catch (error) {
      console.error('❌ Error in loadTasks:', error);
      toast.error("Failed to load tasks");
    }
  };

  const canDeleteTask = async (task: Task): Promise<boolean> => {
    if (!currentUser) return false;

    // Check if user created the task
    const userEmail = currentUser.email || currentUser.name || '';
    if (task.created_by !== userEmail && task.created_by !== 'Current User') {
      return false;
    }

    // Check if any time has been logged for this task
    try {
      const { data: timeLogs, error } = await apiCall(allRoutes.tasks.get(task.id), 'get');

      if (error) {
        console.error('❌ Error checking time logs:', error);
        return false;
      }

      return !timeLogs || timeLogs.length === 0;
    } catch (error) {
      console.error('❌ Error in canDeleteTask:', error);
      return false;
    }
  };

  const addTask = async (taskData: { title: string; description: string; assignedTo?: number }) => {
    try {

      let body = new FormData();
      body.append('project_id', projectId);
      body.append('user_story_id', storyId);
      body.append('title', taskData.title);
      body.append('description', taskData.description);
      body.append('assignee_to_user_id', taskData.assignedTo || '');

      const { data, error } = await apiCall(allRoutes.tasks.create, 'post', body);

      if (error) {
        console.error('❌ Error adding task:', error);
        return;
      }
      loadTasks();
      toast.success("Task added successfully");
    } catch (error) {
      console.error('❌ Error in addTask:', error);
      toast.error("Failed to add task");
    }
  };

  const updateTask = async (taskId: string, taskData: { title: string; description: string; status: 'to_do' | 'in_progress' | 'completed'; assignedTo?: number }) => {
    try {

      let body = new FormData();
      body.append('project_id', projectId);
      body.append('user_story_id', storyId);
      body.append('title', taskData.title);
      body.append('description', taskData.description);
      body.append('assignee_to_user_id', taskData.assignedTo || '');
      body.append('status', taskData.status);
      body.append('_method', 'patch');

      const { data, error } = await apiCall(allRoutes.tasks.update(taskId), 'patch', body);

      if (error) {
        console.error('❌ Error updating task:', error);
        return;
      }

      loadTasks();
      toast.success("Task updated successfully");
    } catch (error) {
      console.error('❌ Error in updateTask:', error);
      toast.error("Failed to update task");
    }
  };

  const updateAssignee = async (taskId: string, assigneeId: number, projectId: string) => {
    try {
      let body = new FormData();
      console.log(" assigneeId ", assigneeId);
      body.append('assignee_to_user_id', assigneeId);
      body.append('project_id', projectId);
      const { data, error } = await apiCall(allRoutes.tasks.update_assignee(taskId), 'post', body);
      if (error) {
        console.error('❌ Error updating assignee:', error);
        return;
      }
      loadTasks();
      toast.success("Assignee updated successfully");
      return true;
    } catch (error) {
      console.error('❌ Error in updateAssignee:', error);
      toast.error("Failed to update assignee");
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // const canDelete = await canDeleteTask(task);
      // if (!canDelete) {
      //   toast.error("You can only delete tasks you created that have no time logged");
      //   return;
      // }
      const { error } = await apiCall(allRoutes.tasks.delete(taskId, projectId), 'delete');

      if (error) {
        console.error('❌ Error deleting task:', error);
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== taskId))

      toast.success("Task deleted successfully");
    } catch (error) {
      console.error('❌ Error in deleteTask:', error);
      toast.error("Failed to delete task");
    }
  };

  useEffect(() => {
    if (projectId) {
      setLoading(true);
      loadTasks().finally(() => {
        setLoading(false);
      });
    }
  }, [projectId]);

  return {
    tasks,
    loading,
    addTask,
    updateAssignee,
    updateTask,
    deleteTask,
    loadTasks,
    canDeleteTask
  };
};
