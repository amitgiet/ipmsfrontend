
import { useState, useEffect } from 'react';
import { getProjectStatus } from '@/utils/projectStatusValidation';

interface Story {
  id: string;
  project_id: string;
}

interface Sprint {
  project_id: string;
}

export const useProjectStatus = (stories: Story[], sprint?: Sprint) => {
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    const fetchProjectStatus = async () => {
      try {
        setIsLoadingStatus(true);
        
        // Get project ID from sprint first, then fall back to stories
        let projectId: string | null = null;
        
        if (sprint?.project_id) {
          projectId = sprint.project_id;
        } else if (stories.length > 0) {
          projectId = stories[0].project_id;
        }
        
        if (!projectId) {
          console.error('❌ No project ID found in sprint or stories');
          setProjectStatus('unknown');
          setIsLoadingStatus(false);
          return;
        }

        console.log('🔄 useProjectStatus - Fetching project status for project:', projectId);
        
        const status = await getProjectStatus(projectId);
        console.log('✅ useProjectStatus - Project status fetched:', status);
        setProjectStatus(status);
      } catch (error) {
        console.error('❌ Error in useProjectStatus fetchProjectStatus:', error);
        setProjectStatus('unknown');
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchProjectStatus();
  }, [stories, sprint]);

  return {
    projectStatus,
    isLoadingStatus,
    isProjectInProgress: projectStatus === 'in-progress'
  };
};
