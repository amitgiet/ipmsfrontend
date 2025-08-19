
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { User } from '@/types/auth';

interface ClientProject {
  id: string;
  project_name: string;
  project_id: string | null;
  client_name: string | null;
  project_status: string | null;
  start_date: string | null;
  end_date: string | null;
  estimated_budget: number | null;
  budget_currency: string | null;
  progress_percent: number | null;
  priority: string | null;
  project_type: string | null;
  created_at: string;
}

export const useClientProjects = (user: User | null) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<ClientProject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadClientProjects();
    } else {
      setLoading(false);
    }
  }, [user]);

  const loadClientProjects = async () => {
    try {
      console.log('🔄 Loading client projects for user:', {
        id: user?.id,
        email: user?.email,
        name: user?.name,
        role: user?.role
      });

      // Check current authentication status
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      console.log('🔐 Current session:', session?.user?.id, session?.user?.email);

      if (sessionError) {
        console.error('❌ Session error:', sessionError);
      }

      // Check if user exists in profiles table
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id);

      console.log('👤 Profile check result:', profileData, profileError);

      // Query client_projects table with explicit email filter for debugging
      const { data: clientProjects, error } = await supabase
        .from('client_projects')
        .select('*')
        .eq('client_email', user?.email) // Explicitly filter by client email
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error loading client projects:', error);
        throw error;
      }

      console.log('✅ Client projects loaded successfully:', clientProjects?.length || 0, clientProjects);
      console.log('📧 Filtered for client email:', user?.email);
      
      setProjects(clientProjects || []);

      if (!clientProjects || clientProjects.length === 0) {
        console.log('ℹ️ No projects found for this client');
        toast({
          title: "No Projects",
          description: "You don't have access to any projects yet. Contact your project manager for access.",
        });
      } else {
        console.log('✅ Successfully loaded projects:', clientProjects.length);
        toast({
          title: "Projects Loaded",
          description: `Found ${clientProjects.length} project(s) accessible to you.`,
        });
      }
    } catch (error) {
      console.error('❌ Exception loading client projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
      setProjects([]);
    } finally {
      setLoading(false);
    }
  };

  return {
    projects,
    loading,
    refetch: loadClientProjects,
  };
};
