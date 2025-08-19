
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useUserRole } from '@/hooks/useUserRole';

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
  const { toast } = useToast();
  const { currentUser } = useUserRole();
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(true);

  const loadTimeLogs = async () => {
    if (!storyId) return;

    try {
      console.log('🔄 Loading time logs for story:', storyId);

      // Get all tasks for this story first, then get time logs
      const { data: tasks, error: tasksError } = await supabase
        .from('story_tasks')
        .select('id')
        .eq('story_id', storyId);

      if (tasksError) {
        console.error('❌ Error loading tasks for time logs:', tasksError);
        return;
      }

      if (!tasks || tasks.length === 0) {
        setTimeLogs([]);
        return;
      }

      const taskIds = tasks.map(task => task.id);

      const { data, error } = await supabase
        .from('task_time_logs')
        .select('*')
        .in('task_id', taskIds)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading time logs:', error);
        toast({
          title: "Error",
          description: "Failed to load time logs",
          variant: "destructive",
        });
        return;
      }

      if (data) {
        setTimeLogs(data as TimeLog[]);
        console.log('✅ Loaded time logs:', data.length);
      }
    } catch (error) {
      console.error('❌ Error in loadTimeLogs:', error);
      toast({
        title: "Error",
        description: "Failed to load time logs",
        variant: "destructive",
      });
    }
  };

  const logTime = async (taskId: string, timeData: { startTime: string; endTime: string; timeSpentMinutes: number }) => {
    try {
      console.log('🔄 Logging time for task:', taskId, timeData);

      const today = new Date().toISOString().split('T')[0];
      const startDateTime = `${today}T${timeData.startTime}:00`;
      const endDateTime = `${today}T${timeData.endTime}:00`;

      const loggedBy = currentUser?.email || currentUser?.name || 'Current User';

      const { data, error } = await supabase
        .from('task_time_logs')
        .insert({
          task_id: taskId,
          start_time: startDateTime,
          end_time: endDateTime,
          time_spent_minutes: timeData.timeSpentMinutes,
          logged_by: loggedBy
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error logging time:', error);
        toast({
          title: "Error",
          description: "Failed to log time",
          variant: "destructive",
        });
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
      console.log('✅ Time logged successfully');
      
      toast({
        title: "Success",
        description: "Time logged successfully",
      });
    } catch (error) {
      console.error('❌ Error in logTime:', error);
      toast({
        title: "Error",
        description: "Failed to log time",
        variant: "destructive",
      });
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
