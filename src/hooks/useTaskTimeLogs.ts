
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useUserRole } from '@/hooks/useUserRole';
import { apiCall } from '@/services/apiCall';
import { allRoutes } from '@/services/routes';

interface TimeLog {
  id: string;
  task_id: string;
  start_time: string;
  end_time: string;
  time_spent_minutes: number;
  logged_by: string;
  logged_at: string;
  created_at: string;
}

export const useTaskTimeLogs = (storyId: string) => {
  const { currentUser } = useUserRole();
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTimeLogs = async () => {
    if (!storyId) return;

    try { 

      // Get all tasks for this story first, then get time logs
      const { data: tasks, error: tasksError } = await apiCall(allRoutes.tasks.list, 'get');

      if (tasksError) {
        console.error('❌ Error loading tasks for time logs:', tasksError);
        return;
      }

      if (!tasks || tasks.length === 0) {
        setTimeLogs([]);
        return;
      }

      const taskIds = tasks.map(task => task.id);

      const { data, error } = await apiCall(allRoutes.tasks.list, 'get');

      if (error) {
        console.error('❌ Error loading time logs:', error);
        toast.error("Failed to load time logs");
        return;
      }

      if (data) {
        setTimeLogs(data as TimeLog[]); 
      }
    } catch (error) {
      console.error('❌ Error in loadTimeLogs:', error);
      toast.error("Failed to load time logs");
    }
  };

  const logTime = async (taskId: string, timeData: { startTime: string; endTime: string; timeSpentMinutes: number }) => {
    try { 

      const today = new Date().toISOString().split('T')[0];
      const startDateTime = `${today}T${timeData.startTime}:00`;
      const endDateTime = `${today}T${timeData.endTime}:00`;

      const loggedBy = currentUser?.email || currentUser?.name || 'Current User';

      const { data, error } = await apiCall(allRoutes.tasks.list, 'post', {
        task_id: taskId,
        start_time: startDateTime,
        end_time: endDateTime,
        time_spent_minutes: timeData.timeSpentMinutes,
        logged_by: loggedBy
      });

      if (error) {
        console.error('❌ Error logging time:', error);
        toast.error("Failed to log time");
        return;
      }

      const newTimeLog: TimeLog = {
        id: data.id,
        task_id: data.task_id,
        start_time: data.start_time,
        end_time: data.end_time,
        time_spent_minutes: data.time_spent_minutes,
        logged_by: data.logged_by || loggedBy,
        logged_at: data.logged_at,
        created_at: data.created_at
      };

      setTimeLogs(prev => [newTimeLog, ...prev]); 
      
      toast.success("Time logged successfully");
    } catch (error) {
      console.error('❌ Error in logTime:', error);
      toast.error("Failed to log time");
    }
  };

  useEffect(() => {
    if (storyId) {
      setLoading(true);
      loadTimeLogs().finally(() => {
        setLoading(false);
      });
    }
  }, [storyId]);

  return {
    timeLogs,
    loading,
    logTime,
    loadTimeLogs
  };
};
