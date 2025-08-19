
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';

interface Sprint {
  id: string;
  project_id: string;
  sprint_name: string;
  start_date: string;
  end_date: string;
  duration: number;
  status: 'created' | 'running' | 'completed';
  created_at: string;
  updated_at: string;
}

export const useSprintsData = (projectId: string) => {
  const [sprints, setSprints] = useState<Sprint[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { teamUser } = useAuth();

  const fetchSprints = async () => {
    try {
      setLoading(true);
      console.log('🔄 Fetching sprints for project:', projectId);
      
      const { data, error } = await supabase
        .from('sprints')
        .select('*')
        .eq('project_id', projectId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching sprints:', error);
        toast({
          title: "Error",
          description: "Failed to fetch sprints",
          variant: "destructive",
        });
        return;
      }

      console.log('✅ Fetched sprints:', data);

      // Type assertion to ensure proper typing
      const typedSprints: Sprint[] = (data || []).map(sprint => ({
        ...sprint,
        status: sprint.status as 'created' | 'running' | 'completed'
      }));

      setSprints(typedSprints);
    } catch (error) {
      console.error('❌ Error fetching sprints:', error);
      toast({
        title: "Error",
        description: "Failed to fetch sprints",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createSprint = async (sprintData: Omit<Sprint, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      console.log('🔄 Creating sprint with data:', sprintData);
      console.log('🔄 Current team user:', teamUser);
      
      // Check if user has permission to create sprints
      if (!teamUser) {
        toast({
          title: "Authentication Error",
          description: "Please log in to create sprints",
          variant: "destructive",
        });
        return null;
      }

      // Check user role
      const allowedRoles = ['product_owner', 'project_manager', 'admin'];
      if (!allowedRoles.includes(teamUser.role)) {
        toast({
          title: "Permission Error",
          description: `Only product owners, project managers, and admins can create sprints. Your role: ${teamUser.role}`,
          variant: "destructive",
        });
        return null;
      }

      const { data, error } = await supabase
        .from('sprints')
        .insert([sprintData])
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating sprint:', error);
        toast({
          title: "Error",
          description: "Failed to create sprint: " + error.message,
          variant: "destructive",
        });
        return null;
      }

      console.log('✅ Sprint created successfully:', data);
      
      toast({
        title: "Success",
        description: "Sprint created successfully",
      });

      fetchSprints(); // Refresh the list
      return data;
    } catch (error) {
      console.error('❌ Error creating sprint:', error);
      toast({
        title: "Error",
        description: "Failed to create sprint",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateSprint = async (sprintId: string, updates: Partial<Sprint>) => {
    try {
      const { error } = await supabase
        .from('sprints')
        .update(updates)
        .eq('id', sprintId);

      if (error) {
        console.error('Error updating sprint:', error);
        toast({
          title: "Error",
          description: "Failed to update sprint",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Success",
        description: "Sprint updated successfully",
      });

      fetchSprints(); // Refresh the list
      return true;
    } catch (error) {
      console.error('Error updating sprint:', error);
      toast({
        title: "Error",
        description: "Failed to update sprint",
        variant: "destructive",
      });
      return false;
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchSprints();
    }
  }, [projectId]);

  return {
    sprints,
    loading,
    fetchSprints,
    createSprint,
    updateSprint
  };
};
