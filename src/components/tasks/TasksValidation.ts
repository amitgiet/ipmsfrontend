
import { useToast } from '@/hooks/use-toast';
import { isProjectInProgress } from '@/utils/projectStatusValidation';

export const useTaskValidation = () => {
  const { toast } = useToast();

  const validateTaskOperation = async (
    projectId: string,
    projectStatus: string,
    sprintStatus: 'created' | 'running' | 'completed',
    operation: 'create' | 'update' | 'delete' | 'status-update'
  ): Promise<boolean> => {
    // Check if project is in progress
    const projectInProgress = await isProjectInProgress(projectId);
    if (!projectInProgress) {
      const operationText = operation === 'create' ? 'create' : 
                           operation === 'delete' ? 'delete' : 
                           operation === 'status-update' ? 'update status of' : 'update';
      
      toast({
        title: `Cannot ${operationText.charAt(0).toUpperCase() + operationText.slice(1)} Task${operation === 'status-update' ? ' Status' : ''}`,
        description: `Task${operation === 'status-update' ? ' statuses' : 's'} can only be ${operationText}d when the project is in progress.`,
        variant: "destructive",
      });
      return false;
    }

    // Check if sprint is running
    if (sprintStatus !== 'running') {
      const operationText = operation === 'create' ? 'created' : 
                           operation === 'delete' ? 'deleted' : 
                           operation === 'status-update' ? 'updated' : 'updated';
      
      toast({
        title: `Cannot ${operation === 'create' ? 'Create' : operation === 'delete' ? 'Delete' : 'Update'} Task${operation === 'status-update' ? ' Status' : ''}`,
        description: `Task${operation === 'status-update' ? ' statuses' : 's'} can only be ${operationText} when the sprint is running.`,
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  return { validateTaskOperation };
};
