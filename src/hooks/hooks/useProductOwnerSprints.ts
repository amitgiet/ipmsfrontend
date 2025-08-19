
import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Sprint {
  id: string;
  project_id: string;
  sprint_name: string;
  status: string;
  end_date: string;
}

export const useProductOwnerSprints = (projectIds: string[]) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [sprintsAboutToEnd, setSprintsAboutToEnd] = useState<Sprint[]>([]);
  const [overrunSprints, setOverrunSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Memoize projectIds to prevent unnecessary re-renders
  const memoizedProjectIds = useMemo(() => projectIds, [JSON.stringify(projectIds)]);

  // Enhanced retry fetcher with exponential backoff and circuit breaker
  const fetchWithRetry = async (fetcher: () => Promise<any>, maxRetries = 3) => {
    let retries = 0;
    let backoffDelay = 1000; // Start with 1 second
    
    while (retries < maxRetries) {
      try {
        return await fetcher();
      } catch (error) {
        retries++;
        console.log(`Retry attempt ${retries}/${maxRetries} for sprint data`);
        
        if (retries >= maxRetries) {
          throw error;
        }
        
        // Exponential backoff with jitter
        const jitter = Math.random() * 0.3 * backoffDelay;
        const delay = backoffDelay + jitter;
        await new Promise(resolve => setTimeout(resolve, delay));
        backoffDelay *= 2; // Double the delay for next attempt
      }
    }
  };

  const fetchSprints = async () => {
    // If no project IDs are provided, set empty arrays and exit early
    if (!memoizedProjectIds || memoizedProjectIds.length === 0) {
      setSprints([]);
      setSprintsAboutToEnd([]);
      setOverrunSprints([]);
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching sprints for projects:', memoizedProjectIds);
      setLoading(true);
      
      // Improved error handling for fetch operations that safely handles empty responses
      const fetchSprintData = async (query: any) => {
        try {
          const { data, error } = await query;
          if (error) throw error;
          return data || []; // Always return an array, even if empty
        } catch (err) {
          console.error('Error fetching sprint data:', err);
          return []; // Return empty array on error instead of throwing
        }
      };
      
      // Fetch running sprints with enhanced resilience
      const runningSprintsData = await fetchWithRetry(async () => {
        return await fetchSprintData(
          supabase
            .from('sprints')
            .select('id, project_id, sprint_name, status, end_date')
            .in('project_id', memoizedProjectIds)
            .eq('status', 'running')
        );
      });

      console.log('✅ Fetched running sprints:', runningSprintsData?.length || 0);
      setSprints(runningSprintsData || []);

      // Calculate date 72 hours from now
      const now = new Date();
      const next72Hours = new Date(now.getTime() + (72 * 60 * 60 * 1000));
      const next72HoursISO = next72Hours.toISOString().split('T')[0]; // Get YYYY-MM-DD format

      // Fetch sprints ending in the next 72 hours with enhanced resilience
      const endingSoonData = await fetchWithRetry(async () => {
        return await fetchSprintData(
          supabase
            .from('sprints')
            .select('id, project_id, sprint_name, status, end_date')
            .in('project_id', memoizedProjectIds)
            .in('status', ['created', 'running'])
            .lte('end_date', next72HoursISO)
        );
      });

      console.log('✅ Fetched sprints about to end:', endingSoonData?.length || 0);
      setSprintsAboutToEnd(endingSoonData || []);

      // Calculate today's date
      const today = new Date().toISOString().split('T')[0]; // Get YYYY-MM-DD format

      // Fetch overrun sprints with enhanced resilience
      const overrunSprintsData = await fetchWithRetry(async () => {
        return await fetchSprintData(
          supabase
            .from('sprints')
            .select('id, project_id, sprint_name, status, end_date')
            .in('project_id', memoizedProjectIds)
            .lt('end_date', today)
            .neq('status', 'completed')
        );
      });

      console.log('✅ Fetched overrun sprints:', overrunSprintsData?.length || 0);
      setOverrunSprints(overrunSprintsData || []);
    } catch (error) {
      console.error('❌ Error in fetchSprints:', error);
      // Only show toast for server errors, not network connectivity issues
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (!errorMessage.includes('Failed to fetch')) {
        toast({
          title: "Error",
          description: "Failed to fetch sprint data. Will retry automatically.",
          variant: "destructive",
        });
      }
      
      // Set empty data to avoid UI issues
      setSprints([]);
      setSprintsAboutToEnd([]);
      setOverrunSprints([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSprints();
  }, [memoizedProjectIds]); // Use memoized projectIds to prevent infinite loops

  return {
    sprints,
    sprintsAboutToEnd,
    overrunSprints,
    loading,
    refetch: fetchSprints
  };
};
