
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'ready' | 'in_progress' | 'completed';
  assignedTo?: string;
  created_by?: string;
  created_at: string;
  updated_at: string;
  story_id: string;
}

export const useDeveloperTasks = (currentUserEmail: string) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!currentUserEmail) {
      console.log('❌ No currentUserEmail provided');
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching tasks for developer:', currentUserEmail);

      // First, let's see all tasks in the table
      const { data: allTasks, error: allTasksError } = await apiCall(allRoutes.tasks.list, 'get');

      if (allTasksError) {
        console.error('❌ Error fetching all tasks:', allTasksError);
      } else {
        console.log('📋 All tasks in database:', allTasks);
        console.log('📋 Looking for tasks assigned to:', currentUserEmail);
        const matchingTasks = allTasks?.filter(task => task.assigned_to === currentUserEmail) || [];
        console.log('🎯 Matching tasks found:', matchingTasks);
      }

      // Now try the original filtered query
      const { data, error } = await apiCall(allRoutes.tasks.list, 'get');

      if (error) {
        console.error('❌ Error fetching developer tasks:', error);
        toast.error("Failed to load your tasks");
        return;
      }

      console.log('✅ Filtered query result:', data);

      if (data) {
        const mappedTasks: Task[] = data.map(task => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status as 'ready' | 'in_progress' | 'completed',
          assignedTo: task.assigned_to || undefined,
          created_by: task.created_by || undefined,
          created_at: task.created_at,
          updated_at: task.updated_at,
          story_id: task.story_id
        }));

        setTasks(mappedTasks);
        console.log('✅ Fetched developer tasks:', mappedTasks.length, mappedTasks);
      }
    } catch (error) {
      console.error('❌ Error in fetchTasks:', error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

    const updateTaskStatus = async (taskId: string, newStatus: 'ready' | 'in_progress' | 'completed') => {
    try {
      console.log('🔄 Updating task status:', taskId, newStatus);

      const { error } = await apiCall(allRoutes.tasks.update(taskId), 'put', {
        status: newStatus,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.error('❌ Error updating task status:', error);
        toast.error("Failed to update task status");
        return;
      }

      // Update local state
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { ...task, status: newStatus, updated_at: new Date().toISOString() }
          : task
      ));

      console.log('✅ Task status updated successfully');
      
      toast.success("Task status updated successfully");
    } catch (error) {
      console.error('❌ Error in updateTaskStatus:', error);
      toast.error("Failed to update task status");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [currentUserEmail]);

  return {
    tasks,
    loading,
    refetch: fetchTasks,
    updateTaskStatus
  };
};
