
import { useState, useEffect } from 'react';
import { getProjectStatus } from '@/utils/projectStatusValidation';
import { useParams } from 'react-router-dom';

  

export const useProjectStatus = () => {
  const { projectId } = useParams();
  const [projectStatus, setProjectStatus] = useState<string | null>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(true);

  useEffect(() => {
    const fetchProjectStatus = async () => {
      try {
        setIsLoadingStatus(true);
        
        // Get project ID from sprint first, then fall back to stories
        
        
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
  }, [projectId]);

  return {
    projectStatus,
    isLoadingStatus,
    isProjectInProgress: projectStatus === 'in-progress'
  };
};
