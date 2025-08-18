import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

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

export const useStoryTasks = (storyId: string) => {
  const { toast } = useToast();
    const { user, teamUser } = useAuth();
  const currentUser = user || teamUser;
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTasks = async () => {
    if (!storyId) return;

    try {
      console.log('🔄 Loading tasks for story:', storyId);

      const { data, error } = await apiCall(allRoutes.tasks.get(storyId), 'get');

      if (error) {
        console.error('❌ Error loading tasks:', error);
        toast({
          title: "Error",
          description: "Failed to load tasks",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        const mappedTasks: Task[] = data.map(task => ({
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
        console.log('✅ Loaded tasks:', mappedTasks.length);
      }
    } catch (error) {
      console.error('❌ Error in loadTasks:', error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
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

  const addTask = async (taskData: { title: string; description: string; assignedTo?: string }) => {
    try {
      console.log('🔄 Adding new task:', taskData);
      console.log('🔍 Debug - Current user:', currentUser);
      console.log('🔍 Debug - Story ID:', storyId);

      const createdByUser = currentUser?.email || currentUser?.name || 'Current User';

      const { data, error } = await apiCall(allRoutes.tasks.create, 'post', {
        story_id: storyId,
        title: taskData.title,
        description: taskData.description || null,
        status: 'to_do',
        assigned_to: taskData.assignedTo || null,
        created_by: createdByUser
      });

      if (error) {
        console.error('❌ Error adding task:', error);
        toast({
          title: "Error",
          description: "Failed to add task",
          variant: "destructive",
        });
        return;
      }

      const newTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as 'to_do' | 'in_progress' | 'completed',
        assignedTo: data.assigned_to || undefined,
        created_by: data.created_by || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setTasks(prev => [...prev, newTask]);
      console.log('✅ Task added successfully');
      
      toast({
        title: "Success",
        description: "Task added successfully",
      });
    } catch (error) {
      console.error('❌ Error in addTask:', error);
      toast({
        title: "Error",
        description: "Failed to add task",
        variant: "destructive",
      });
    }
  };

  const updateTask = async (taskId: string, taskData: { title: string; description: string; status: 'to_do' | 'in_progress' | 'completed'; assignedTo?: string }) => {
    try {
      console.log('🔄 Updating task:', taskId, taskData);

        const { data, error } = await apiCall(allRoutes.tasks.update(taskId), 'put', {
        title: taskData.title,
        description: taskData.description || null,
        status: taskData.status,
        assigned_to: taskData.assignedTo || null,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('❌ Error updating task:', error);
        toast({
          title: "Error",
          description: "Failed to update task",
          variant: "destructive",
        });
        return;
      }

      const updatedTask: Task = {
        id: data.id,
        title: data.title,
        description: data.description || undefined,
        status: data.status as 'to_do' | 'in_progress' | 'completed',
        assignedTo: data.assigned_to || undefined,
        created_by: data.created_by || undefined,
        created_at: data.created_at,
        updated_at: data.updated_at
      };

      setTasks(prev => prev.map(task => task.id === taskId ? updatedTask : task));
      console.log('✅ Task updated successfully');
      console.log('🔍 Updated task:', updatedTask);
      
      toast({
        title: "Success",
        description: "Task updated successfully",
      });
    } catch (error) {
      console.error('❌ Error in updateTask:', error);
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      console.log('🔄 Checking if task can be deleted:', taskId);
      
      const canDelete = await canDeleteTask(task);
      if (!canDelete) {
        toast({
          title: "Cannot Delete Task",
          description: "You can only delete tasks you created that have no time logged",
          variant: "destructive",
        });
        return;
      }

      console.log('🔄 Deleting task:', taskId);

      const { error } = await apiCall(allRoutes.tasks.delete(taskId), 'delete');

      if (error) {
        console.error('❌ Error deleting task:', error);
        toast({
          title: "Error",
          description: "Failed to delete task",
          variant: "destructive",
        });
        return;
      }

      setTasks(prev => prev.filter(task => task.id !== taskId));
      console.log('✅ Task deleted successfully');
      
      toast({
        title: "Success",
        description: "Task deleted successfully",
      });
    } catch (error) {
      console.error('❌ Error in deleteTask:', error);
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (storyId) {
      setLoading(true);
      loadTasks().finally(() => {
        setLoading(false);
      });
    }
  }, [storyId]);

  return {
    tasks,
    loading,
    addTask,
    updateTask,
    deleteTask,
    loadTasks,
    canDeleteTask
  };
};
