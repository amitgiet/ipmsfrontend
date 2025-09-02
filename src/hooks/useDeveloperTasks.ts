
import { useState, useEffect } from 'react';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';
import { toast } from 'react-toastify';

export const useDeveloperTasks = (currentUserEmail: string) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTasks = async () => {
    if (!currentUserEmail) { 
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await apiCall(allRoutes.tasks.list(null, null, true), 'get');

      if (error) {
        console.error('❌ Error fetching developer tasks:', error);
        return;
      } 
      
      if (data) {
        const mappedTasks = data.data.map((task: any) => ({
          id: task.id,
          title: task.title,
          description: task.description || undefined,
          status: task.status as 'to_do' | 'in_progress' | 'completed',
          assigned_to: task.assigned_to || undefined,
          created_by: task.created_by || undefined,
          created_at: task.created_at,
          updated_at: task.updated_at,
          story_id: task.story_id
        }));

        setTasks(mappedTasks); 
      }
    } catch (error) {
      console.error('❌ Error in fetchTasks:', error);
      toast.error("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

    const updateTaskStatus = async (taskId: string, newStatus: 'to_do' | 'in_progress' | 'completed') => {
    try {
      const { error } = await apiCall(allRoutes.tasks.update(taskId), 'post', {
        status: newStatus,
        _method: 'patch'
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
