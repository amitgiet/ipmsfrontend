
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

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
  projects?: {
    project_name: string;
  };
}

export const useProductOwnerTimeLogs = (productOwnerEmail: string, skipFetch = false) => {
  const [timeLogs, setTimeLogs] = useState<TimeLog[]>([]);
  const [loading, setLoading] = useState(!skipFetch);
  const { toast } = useToast();

  const fetchTimeLogs = async () => {
    if (!productOwnerEmail) {
      setTimeLogs([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching time logs for:', productOwnerEmail);
      setLoading(true);
      
      const { data, error } = await supabase
        .from('product_owner_time_logs')
        .select(`
          *,
          projects (
            project_name
          )
        `)
        .eq('product_owner_email', productOwnerEmail)
        .order('logged_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching time logs:', error);
        // Only show toast for non-network errors
        if (!error.message?.includes('Failed to fetch')) {
          toast({
            title: "Error",
            description: "Failed to fetch time logs",
            variant: "destructive",
          });
        }
        return;
      }

      console.log('✅ Fetched time logs:', data?.length || 0);
      setTimeLogs(data || []);
    } catch (error) {
      console.error('❌ Error in fetchTimeLogs:', error);
      // Only show toast for non-network errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (!errorMessage.includes('Failed to fetch')) {
        toast({
          title: "Error",
          description: "Failed to fetch time logs",
          variant: "destructive",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!skipFetch) {
      fetchTimeLogs();
    }
  }, [productOwnerEmail, skipFetch]);

  return {
    timeLogs,
    loading,
    refetch: fetchTimeLogs
  };
};
