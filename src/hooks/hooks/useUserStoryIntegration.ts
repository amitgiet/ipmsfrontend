
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export const useUserStoryIntegration = (projectId: string) => {
  const { toast } = useToast();

  useEffect(() => {
    const addUserStoryToBacklog = async (userStory: any) => {
      console.log('🚀 GLOBAL: Adding user story to backlog:', userStory);
      
      try {
        if (!userStory?.title) {
          console.error('❌ No title provided in user story');
          return false;
        }

        if (!projectId) {
          console.error('❌ No project ID available');
          return false;
        }

        const insertData = {
          title: String(userStory.title).trim(),
          description: userStory.description ? String(userStory.description).trim() : String(userStory.title).trim(),
          priority: 'medium' as const,
          status: 'to_do' as const,
          project_id: String(projectId)
        };

        console.log('📤 GLOBAL: Prepared insert data:', insertData);

        const { data: insertedData, error: insertError } = await supabase
          .from('user_stories')
          .insert(insertData)
          .select('*')
          .single();

        if (insertError) {
          console.error('❌ GLOBAL: Database insert failed:', insertError);
          toast({
            title: "Database Error",
            description: `Failed to save user story: ${insertError.message}`,
            variant: "destructive",
          });
          return false;
        }

        if (!insertedData) {
          console.error('❌ GLOBAL: No data returned from insert');
          return false;
        }

        console.log('✅ GLOBAL: Database insert successful!', insertedData);

        toast({
          title: "Success",
          description: `User story "${insertedData.title}" added successfully`,
        });

        window.dispatchEvent(new CustomEvent('userStoryAdded', { 
          detail: insertedData 
        }));

        return true;

      } catch (error) {
        console.error('❌ GLOBAL: Exception in addUserStoryToBacklog:', error);
        toast({
          title: "Unexpected Error", 
          description: `An unexpected error occurred: ${error}`,
          variant: "destructive",
        });
        return false;
      }
    };

    console.log('🔧 Setting up global addStoryToBacklog function in ProjectDashboard');
    (window as any).addStoryToBacklog = addUserStoryToBacklog;
    
    return () => {
      console.log('🧹 Cleaning up global addStoryToBacklog function');
      delete (window as any).addStoryToBacklog;
    };
  }, [projectId, toast]);
};
