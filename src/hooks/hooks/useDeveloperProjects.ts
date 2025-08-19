
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useDeveloperProjects = (currentUser: any) => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProjects = async () => {
    if (!currentUser?.email) {
      setLoading(false);
      return;
    }

    try {
      console.log('🔄 Fetching projects for developer:', currentUser.email);

      // First approach: Check if developer has direct project membership
      const { data: teamMember, error: teamMemberError } = await supabase
        .from('team_members')
        .select('id')
        .eq('email', currentUser.email)
        .maybeSingle();
      
      if (teamMemberError) {
        console.error('❌ Error fetching team member:', teamMemberError);
        toast({
          title: "Error",
          description: "Failed to check team membership",
          variant: "destructive",
        });
        return;
      }

      let developerProjects: any[] = [];

      // If found as team member, get projects through project_team_members
      if (teamMember?.id) {
        const { data: projectMemberships, error: membershipError } = await supabase
          .from('project_team_members')
          .select('project_id')
          .eq('team_member_id', teamMember.id);

        if (membershipError) {
          console.error('❌ Error fetching project memberships:', membershipError);
          toast({
            title: "Error",
            description: "Failed to load project memberships",
            variant: "destructive",
          });
        } else if (projectMemberships && projectMemberships.length > 0) {
          // Get the project IDs the developer is assigned to
          const projectIds = projectMemberships.map(pm => pm.project_id);
          console.log('Project IDs from membership:', projectIds);

          // Fetch the projects
          const { data: projectsData, error: projectsError } = await supabase
            .from('projects')
            .select('*')
            .in('id', projectIds);

          if (projectsError) {
            console.error('❌ Error fetching projects:', projectsError);
            toast({
              title: "Error",
              description: "Failed to load projects",
              variant: "destructive",
            });
          } else {
            developerProjects = projectsData || [];
            console.log('✅ Fetched projects through team membership:', developerProjects.length);
          }
        }
      }

      // Second approach: Find projects through assigned tasks (original approach)
      // Only run this if no projects were found through team membership
      if (developerProjects.length === 0) {
        console.log('No projects found through team membership, checking tasks...');
        
        // Query tasks assigned to this developer
        const { data: assignedTasks, error: tasksError } = await supabase
          .from('story_tasks')
          .select('story_id, assigned_to')
          .eq('assigned_to', currentUser.email);

        if (tasksError) {
          console.error('❌ Error fetching assigned tasks:', tasksError);
          toast({
            title: "Error",
            description: "Failed to load assigned tasks",
            variant: "destructive",
          });
          return;
        }

        console.log('✅ Found assigned tasks:', assignedTasks?.length || 0);

        if (assignedTasks && assignedTasks.length > 0) {
          // Extract all story IDs from assigned tasks
          const storyIds = assignedTasks.map(task => task.story_id);
          
          // Get user stories for these tasks
          const { data: userStories, error: storiesError } = await supabase
            .from('user_stories')
            .select('project_id')
            .in('id', storyIds);

          if (storiesError) {
            console.error('❌ Error fetching user stories:', storiesError);
            toast({
              title: "Error",
              description: "Failed to load user stories",
              variant: "destructive",
            });
            return;
          }

          if (userStories && userStories.length > 0) {
            // Extract unique project IDs
            const projectIds = Array.from(new Set(userStories.map(story => story.project_id)));
            
            // Fetch project details
            const { data: projectsData, error: projectsError } = await supabase
              .from('projects')
              .select('*')
              .in('id', projectIds);

            if (projectsError) {
              console.error('❌ Error fetching projects:', projectsError);
              toast({
                title: "Error",
                description: "Failed to load projects",
                variant: "destructive",
              });
              return;
            }

            developerProjects = projectsData || [];
            console.log('✅ Fetched projects through tasks:', developerProjects.length);
          }
        }
      }

      // As a fallback: If the developer is assigned to the project directly through creator
      if (developerProjects.length === 0) {
        console.log('No projects found through team membership or tasks, checking created projects...');
        
        // Check if the user has created any projects
        const { data: createdProjects, error: createdError } = await supabase
          .from('projects')
          .select('*')
          .eq('created_by', currentUser.id);
        
        if (createdError) {
          console.error('❌ Error fetching created projects:', createdError);
        } else if (createdProjects && createdProjects.length > 0) {
          developerProjects = createdProjects;
          console.log('✅ Fetched projects created by developer:', developerProjects.length);
        }
      }
      
      console.log('✅ Total developer projects found:', developerProjects.length);
      setProjects(developerProjects);

    } catch (error) {
      console.error('❌ Error in fetchProjects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const refetch = () => {
    setLoading(true);
    fetchProjects();
  };

  useEffect(() => {
    fetchProjects();
  }, [currentUser?.email]);

  return {
    projects,
    loading,
    refetch
  };
};
