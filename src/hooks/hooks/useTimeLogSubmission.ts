
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { calculateDurationMinutes, createTimestamp } from '@/utils/timeCalculations';

interface TimeLog {
  id: string;
  product_owner_email: string;
  project_id: string;
  activity_type: string;
  description: string | null;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  logged_at: string;
  created_at: string;
}

export const useTimeLogSubmission = (
  productOwnerEmail: string,
  onTimeLogged: () => void,
  onClose: () => void
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [lastSubmittedLog, setLastSubmittedLog] = useState<TimeLog | null>(null);
  const { toast } = useToast();

  const submitTimeLog = async (
    projectId: string,
    activityType: string,
    description: string,
    startTime: string,
    endTime: string
  ) => {
    const durationMinutes = calculateDurationMinutes(startTime, endTime);
    
    if (!projectId || !activityType || !startTime || !endTime || durationMinutes <= 0) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields and ensure end time is after start time",
        variant: "destructive",
      });
      return false;
    }

    setIsSubmitting(true);
    try {
      console.log('Submitting time log with details:', {
        email: productOwnerEmail,
        project: projectId,
        activity: activityType,
        duration: durationMinutes
      });
      
      // Create full timestamp strings for today
      const today = new Date().toISOString().split('T')[0];
      const startTimestamp = createTimestamp(today, startTime);
      const endTimestamp = createTimestamp(today, endTime);

      const { data, error } = await supabase
        .from('product_owner_time_logs')
        .insert({
          product_owner_email: productOwnerEmail,
          project_id: projectId,
          activity_type: activityType,
          description: description || null,
          start_time: startTimestamp,
          end_time: endTimestamp,
          duration_minutes: durationMinutes,
          logged_at: new Date().toISOString()
        })
        .select('*, projects(project_name)');

      if (error) {
        console.error('Error logging time:', error);
        toast({
          title: "Error",
          description: "Failed to log time. Please try again.",
          variant: "destructive",
        });
        return false;
      }

      console.log('Time log submitted successfully:', data);
      
      // Store the newly created time log
      if (data && data.length > 0) {
        setLastSubmittedLog(data[0] as TimeLog);
      }
      
      toast({
        title: "Success",
        description: "Time logged successfully",
      });

      onTimeLogged();
      return true;
    } catch (error) {
      console.error('Error logging time:', error);
      toast({
        title: "Error",
        description: "Failed to log time. Please try again.",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitTimeLog,
    lastSubmittedLog
  };
};
